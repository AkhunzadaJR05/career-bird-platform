"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface ScholarshipDetailTabsProps {
  grant: any
}

export function ScholarshipDetailTabs({ grant }: ScholarshipDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
        <TabsTrigger value="funding">Funding</TabsTrigger>
        <TabsTrigger value="application">Application Process</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-bold">About the Fellowship</h3>
            <div className="prose max-w-none">
              <p>{grant.description}</p>

              <p className="mt-4">
                The Global Excellence PhD Fellowship represents one of the most prestigious opportunities at the
                University of Oxford. Designed for exceptional students worldwide, this program aims to foster
                ground-breaking research in the field of Artificial Intelligence and Human-Computer Interaction.
              </p>

              <p className="mt-4">
                Fellows will join a vibrant community of scholars and will be mentored by world-leading professors.
                Beyond financial support, the fellowship provides access to exclusive conferences, research grants, and
                a global network of alumni in academia and industry.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="eligibility">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-bold">Eligibility Criteria</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="font-medium">
                    First-class or strong upper second-class undergraduate degree with honors
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="font-medium">Master's degree in Computer Science, Mathematics, or related field</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="font-medium">Strong research proposal aligned with department interests</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="font-medium">English Language Proficiency (IELTS 7.5 or equivalent)</p>
                  <p className="text-sm text-muted-foreground">Minimum of 7.0 in each component</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="font-medium">Not currently enrolled in a PhD program</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">Note:</p>
              <p className="mt-1 text-sm text-blue-800">
                Preference is given to candidates with prior publications in top-tier conferences (NeurIPS, ICML, CVPR).
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="funding">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-bold">What's Covered</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">100% Tuition Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Covers full tuition for domestic and international students for up to 4 years.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Annual Stipend</h4>
                  <p className="text-sm text-muted-foreground">
                    £18,000 tax-free living allowance per year, adjusted for inflation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded-lg bg-purple-100 p-3">
                  <svg className="h-6 w-6 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Travel Grant</h4>
                  <p className="text-sm text-muted-foreground">
                    Up to £2,000 annually for conference travel and research visits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded-lg bg-teal-100 p-3">
                  <svg className="h-6 w-6 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Health Surcharge</h4>
                  <p className="text-sm text-muted-foreground">
                    Reimbursement of the Immigration Health Surcharge (IHS) for visa.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="application">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-bold">Application Process</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-semibold">Prepare Documents</h4>
                  <p className="mb-2 text-sm text-muted-foreground">Recommended: Start 4 weeks before deadline</p>
                  <p className="text-sm">
                    Gather your transcripts, CV, 3 letters of recommendation, and research proposal. Ensure all
                    documents are translated if not in English.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-semibold">Submit Online Application</h4>
                  <p className="mb-2 text-sm text-muted-foreground">Deadline: January 15, 2025</p>
                  <p className="text-sm">
                    Complete the university's graduate application portal. Select "Global Excellence Fellowship" in the
                    funding section.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-semibold">Interview Stage</h4>
                  <p className="mb-2 text-sm text-muted-foreground">February 2025</p>
                  <p className="text-sm">
                    Shortlisted candidates will be invited for a virtual interview with the faculty panel.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-semibold">Final Decision</h4>
                  <p className="mb-2 text-sm text-muted-foreground">March 2025</p>
                  <p className="text-sm">
                    Successful applicants will receive their offer letters and fellowship confirmation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
