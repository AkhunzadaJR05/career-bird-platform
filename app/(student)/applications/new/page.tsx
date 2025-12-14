"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, UploadIcon, AlertCircleIcon, CalendarIcon } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function NewApplicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const grantId = searchParams.get("grant")

  const [loading, setLoading] = useState(false)
  const [grant, setGrant] = useState<any>(null)
  const [application, setApplication] = useState<any>(null)
  const [formData, setFormData] = useState({
    proposalFile: null as File | null,
    videoFile: null as File | null,
    portfolioFile: null as File | null,
  })

  useEffect(() => {
    if (grantId) {
      loadGrantData()
    }
  }, [grantId])

  const loadGrantData = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Load grant details
      const { data: grantData } = await supabase
        .from("grants")
        .select(
          `
          *,
          universities:university_id (
            id,
            name,
            country
          )
        `,
        )
        .eq("id", grantId)
        .single()

      setGrant(grantData)

      // Check if application already exists
      const { data: existingApp } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .eq("grant_id", grantId)
        .single()

      if (existingApp) {
        setApplication(existingApp)

        // Load tryout submission if exists
        const { data: tryout } = await supabase
          .from("tryout_submissions")
          .select("*")
          .eq("application_id", existingApp.id)
          .single()

        if (tryout) {
          setFormData({
            proposalFile: tryout.proposal_url ? ({} as File) : null,
            videoFile: tryout.video_url ? ({} as File) : null,
            portfolioFile: tryout.portfolio_url ? ({} as File) : null,
          })
        }
      }
    } catch (error) {
      console.error("Error loading grant data:", error)
    }
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

  const handleSubmit = async () => {
    if (!grantId || !formData.proposalFile || !formData.videoFile) {
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Create or get application
      let appId = application?.id

      if (!appId) {
        const { data: newApp, error } = await supabase
          .from("applications")
          .insert({
            user_id: user.id,
            grant_id: grantId,
            status: "submitted",
            submitted_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        appId = newApp.id
      }

      // Upload files to Supabase Storage (you'll need to set up storage buckets)
      // For now, we'll just store the file names
      const proposalUrl = formData.proposalFile ? `proposals/${appId}/${formData.proposalFile.name}` : null
      const videoUrl = formData.videoFile ? `videos/${appId}/${formData.videoFile.name}` : null
      const portfolioUrl = formData.portfolioFile ? `portfolios/${appId}/${formData.portfolioFile.name}` : null

      // Create or update tryout submission
      const { error: tryoutError } = await supabase.from("tryout_submissions").upsert({
        application_id: appId,
        user_id: user.id,
        proposal_url: proposalUrl,
        video_url: videoUrl,
        portfolio_url: portfolioUrl,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })

      if (tryoutError) throw tryoutError

      router.push("/applications/success")
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!grant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    )
  }

  const daysUntilDeadline = grant.deadline
    ? Math.ceil((new Date(grant.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xl">🐦</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">The Career Bird</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline-block"
            >
              Home
            </Link>
            <Link href="/applications" className="text-sm text-primary font-medium">
              Applications
            </Link>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/applications" className="hover:text-foreground">
              Applications
            </Link>
            <span>/</span>
            <Link href={`/scholarships/${grantId}`} className="hover:text-foreground truncate max-w-[150px] sm:max-w-none">
              {grant.title}
            </Link>
            <span>/</span>
            <span className="text-foreground">Tryout Submission</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold">Step 2: Tryout Submission</h1>
              {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
                <Badge className={`bg-${daysUntilDeadline <= 7 ? "orange" : "blue"}-600 text-white`}>
                  <AlertCircleIcon className="h-3 w-3 mr-1" />
                  Due in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Showcase your potential. Submit the required materials for the review committee to evaluate your
              capabilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Project Proposal */}
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1">Project Proposal</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Upload your research proposal in PDF format.</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      REQUIRED
                    </Badge>
                  </div>

                  {formData.proposalFile ? (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200">
                      <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {formData.proposalFile.name || "proposal.pdf"}
                        </p>
                        {formData.proposalFile.size && (
                          <p className="text-xs text-muted-foreground">
                            {(formData.proposalFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleFileChange("proposalFile", null)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="block">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange("proposalFile", e.target.files?.[0] || null)}
                      />
                      <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-primary cursor-pointer transition-colors">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 mb-3">
                          <UploadIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF only (max. 10MB)</p>
                      </div>
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Introductory Video */}
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1">Introductory Video</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        A 2-minute video introducing yourself and your research interests.
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      REQUIRED
                    </Badge>
                  </div>

                  {formData.videoFile ? (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200">
                      <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{formData.videoFile.name || "video.mp4"}</p>
                        {formData.videoFile.size && (
                          <p className="text-xs text-muted-foreground">
                            {(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleFileChange("videoFile", null)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="block">
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileChange("videoFile", e.target.files?.[0] || null)}
                      />
                      <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-primary cursor-pointer transition-colors">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 mb-3">
                          <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV (max. 50MB)</p>
                      </div>
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Code Sample or Portfolio */}
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1">Code Sample or Portfolio</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Upload a ZIP file containing relevant work samples.
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                      OPTIONAL
                    </Badge>
                  </div>

                  <label className="block">
                    <input
                      type="file"
                      accept=".zip,.rar"
                      className="hidden"
                      onChange={(e) => handleFileChange("portfolioFile", e.target.files?.[0] || null)}
                    />
                    <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-primary cursor-pointer transition-colors">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950 mb-3">
                        <UploadIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">ZIP, RAR (max. 50MB)</p>
                    </div>
                  </label>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6">
                <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.proposalFile || !formData.videoFile}
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  {loading ? "Submitting..." : "Submit Tryout for Review"}
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                <svg
                  className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-muted-foreground">Your submission is encrypted and secure.</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Status */}
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <h3 className="font-semibold text-sm sm:text-base">Application Status</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Application Submitted</p>
                        {application?.submitted_at && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(application.submitted_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-600">Tryout Phase</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                        {grant.deadline && (
                          <p className="text-xs text-muted-foreground">
                            Due {new Date(grant.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Guidelines */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="p-4 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                      Submission Guidelines
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p>
                        <strong>Language:</strong> All documents must be submitted in English unless specified otherwise.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p>
                        <strong>File Size:</strong> Maximum file size is 10MB per upload.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
