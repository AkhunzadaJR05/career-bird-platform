import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Share2, Download, FileText, CheckCircle2, Star, X } from "lucide-react"
import Link from "next/link"

async function getApplicationData(id: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Get application with all related data
  const { data: application, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        universities:university_id (
          name,
          country
        )
      ),
      profiles:user_id (
        id,
        first_name,
        last_name,
        email,
        nationality,
        current_country,
        current_city,
        university_id,
        current_degree,
        field_of_study,
        gpa,
        gpa_scale,
        gre_verbal,
        gre_quant,
        gre_awa,
        toefl_score,
        ielts_score,
        research_interests,
        universities:university_id (
          name,
          country
        )
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error || !application) {
    notFound()
  }

  // Verify professor has access to this application
  const { data: grant } = await supabase.from("grants").select("created_by").eq("id", application.grant_id).single()

  if (grant?.created_by !== user.id) {
    redirect("/professor/dashboard")
  }

  // Get documents for this user
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", application.user_id)
    .order("uploaded_at", { ascending: false })

  // Get tryout submission if exists
  const { data: tryout } = await supabase
    .from("tryout_submissions")
    .select("*")
    .eq("application_id", application.id)
    .single()

  return {
    application,
    documents: documents || [],
    tryout,
  }
}

export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { application, documents, tryout } = await getApplicationData(id)

  const candidate = application.profiles
  const grant = application.grants

  const candidateName = `${candidate?.first_name || ""} ${candidate?.last_name || ""}`.trim() || "Unknown"
  const initials = candidateName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  // Calculate scores
  const gpa = candidate?.gpa || 0
  const gpaMax = candidate?.gpa_scale || 4.0
  const greTotal = candidate?.gre_verbal && candidate?.gre_quant ? candidate.gre_verbal + candidate.gre_quant : null
  const toefl = candidate?.toefl_score || null
  const ielts = candidate?.ielts_score || null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/professor/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Application Review: {candidateName}</h1>
          <p className="text-sm text-muted-foreground">
            {grant?.title} • App ID: {application.id.substring(0, 8)}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Candidate Profile */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold truncate">{candidateName}</h2>
                        {application.status === "submitted" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            New Applicant
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {candidate?.current_degree?.toUpperCase()} • {candidate?.field_of_study || "Not specified"}
                      </p>
                      <div className="mt-1 flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                        {candidate?.universities?.name && (
                          <span className="flex items-center gap-1">
                            <span>🎓</span>
                            <span className="truncate">{candidate.universities.name}</span>
                          </span>
                        )}
                        {candidate?.current_city && candidate?.current_country && (
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            <span className="truncate">
                              {candidate.current_city}, {candidate.current_country}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {candidate?.email && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={`mailto:${candidate.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Scores */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">GPA</p>
                    <p className="text-xl sm:text-2xl font-bold">{gpa || "N/A"}</p>
                    {gpa && <p className="text-xs text-muted-foreground">/{gpaMax}</p>}
                  </div>
                  {greTotal && (
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-xs text-muted-foreground">GRE</p>
                      <p className="text-xl sm:text-2xl font-bold">{greTotal}</p>
                      <p className="text-xs text-muted-foreground">/340</p>
                    </div>
                  )}
                  {toefl && (
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-xs text-muted-foreground">TOEFL</p>
                      <p className="text-xl sm:text-2xl font-bold">{toefl}</p>
                      <p className="text-xs text-muted-foreground">/120</p>
                    </div>
                  )}
                  {ielts && (
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-xs text-muted-foreground">IELTS</p>
                      <p className="text-xl sm:text-2xl font-bold">{ielts}</p>
                      <p className="text-xs text-muted-foreground">/9.0</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statement of Purpose */}
            {application.statement_of_purpose && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base sm:text-lg">Statement of Purpose</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {application.statement_of_purpose}
                      </p>
                    </div>
                    {candidate?.research_interests && candidate.research_interests.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-semibold text-sm sm:text-base">Research Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.research_interests.map((interest: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Research Proposal */}
            {application.research_proposal && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Research Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {application.research_proposal}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tryout Submission */}
            {tryout && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Tryout Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tryout.proposal_url && (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-sm">Research Proposal</p>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={tryout.proposal_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                  {tryout.video_url && (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-sm">Introductory Video</p>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={tryout.video_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Supporting Documents */}
            {documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950 flex-shrink-0">
                            <FileText className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : ""} •{" "}
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Evaluation */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Candidate Evaluation</CardTitle>
                  <Badge variant="secondary" className="text-xs">Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Match Score</label>
                    <span className="text-lg font-bold text-blue-600">{application.match_score || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${application.match_score || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Reviewer Notes</label>
                  <div className="text-xs text-muted-foreground mb-2">Internal notes (visible to committee)</div>
                  <Textarea
                    placeholder="Enter your observations regarding this candidate's fit for the scholarship..."
                    rows={4}
                    className="resize-none text-sm"
                    defaultValue={application.reviewer_notes || ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Final Decision */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">FINAL DECISION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve & Forward
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 bg-transparent"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-600 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 bg-transparent"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Application Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      application.status === "shortlisted"
                        ? "default"
                        : application.status === "under_review" || application.status === "submitted"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {application.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                {application.submitted_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>{new Date(application.submitted_at).toLocaleDateString()}</span>
                  </div>
                )}
                {application.reviewed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviewed:</span>
                    <span>{new Date(application.reviewed_at).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
