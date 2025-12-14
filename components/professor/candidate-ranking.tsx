"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, ChevronRight, Users } from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: string
  rank: number
  name: string
  candidateId: string
  origin: string
  university: string
  gpa: number
  researchInterest: string
  aiMatch: number
  status: string
}

interface CandidateRankingProps {
  candidates: Candidate[]
  totalApplicants: number
}

export function CandidateRanking({ candidates, totalApplicants }: CandidateRankingProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) {
      return candidates
    }

    const query = searchQuery.toLowerCase()
    return candidates.filter((candidate) => {
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.candidateId.toLowerCase().includes(query) ||
        candidate.origin.toLowerCase().includes(query) ||
        candidate.university.toLowerCase().includes(query) ||
        candidate.researchInterest.toLowerCase().includes(query) ||
        candidate.status.toLowerCase().includes(query)
      )
    })
  }, [candidates, searchQuery])

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative mb-4 sm:mb-0 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCandidates.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-semibold text-white shrink-0">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">
                            #{candidate.rank} {candidate.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">ID: {candidate.candidateId}</p>
                        <div className="space-y-1 text-xs">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Origin:</span> {candidate.origin}
                          </p>
                          <p className="text-muted-foreground truncate">
                            <span className="font-medium">University:</span> {candidate.university}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">GPA:</span> {candidate.gpa || "N/A"}
                          </p>
                          <p className="text-muted-foreground truncate">
                            <span className="font-medium">Research:</span> {candidate.researchInterest}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">
                            {candidate.aiMatch}%
                          </span>
                        </div>
                        <Badge
                          variant={
                            candidate.status === "shortlisted"
                              ? "default"
                              : candidate.status === "under_review" || candidate.status === "submitted"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            candidate.status === "shortlisted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : candidate.status === "under_review" || candidate.status === "submitted"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                : ""
                          }
                        >
                          {candidate.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/professor/applications/${candidate.id}`}>
                          Review
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                    <th className="pb-3 pr-4">RANK</th>
                    <th className="pb-3 pr-4">CANDIDATE</th>
                    <th className="pb-3 pr-4 hidden md:table-cell">ORIGIN & UNIVERSITY</th>
                    <th className="pb-3 pr-4 hidden lg:table-cell">GPA</th>
                    <th className="pb-3 pr-4 hidden lg:table-cell">RESEARCH INTEREST</th>
                    <th className="pb-3 pr-4">MATCH</th>
                    <th className="pb-3 pr-4">STATUS</th>
                    <th className="pb-3">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-4">
                        <span className="text-sm font-medium">#{candidate.rank}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-semibold text-white shrink-0">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {candidate.candidateId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 hidden md:table-cell">
                        <div>
                          <p className="text-sm font-medium">{candidate.origin}</p>
                          <p className="text-xs text-muted-foreground truncate">{candidate.university}</p>
                        </div>
                      </td>
                      <td className="py-4 hidden lg:table-cell">
                        <span className="text-sm font-semibold">{candidate.gpa || "N/A"}</span>
                      </td>
                      <td className="py-4 hidden lg:table-cell">
                        <span className="text-sm truncate block max-w-[150px]">{candidate.researchInterest}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">
                              {candidate.aiMatch}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            candidate.status === "shortlisted"
                              ? "default"
                              : candidate.status === "under_review" || candidate.status === "submitted"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            candidate.status === "shortlisted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : candidate.status === "under_review" || candidate.status === "submitted"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                : ""
                          }
                        >
                          {candidate.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/professor/applications/${candidate.id}`}>
                            Review
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `Showing ${filteredCandidates.length} of ${candidates.length} candidates`
                  : `Showing 1-${candidates.length} of ${totalApplicants} candidates`}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{searchQuery ? "No candidates found" : "No applicants yet"}</p>
            <p className="text-sm mt-1">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Applications will appear here once students apply to your grants."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
