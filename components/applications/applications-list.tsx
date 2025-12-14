"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Eye, Download, FileText } from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  status: string
  submitted_at?: string
  r_score?: number
  match_score?: number
  grants?: {
    id: string
    title?: string
    deadline?: string
    universities?: {
      name?: string
      city?: string
      country?: string
    }
  }
}

interface ApplicationsListProps {
  applications: Application[]
  searchQuery?: string
}

function getStatusBadge(status: string) {
  switch (status) {
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
          Accepted
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300">
          Rejected
        </Badge>
      )
    case "under_review":
    case "submitted":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
          Under Review
        </Badge>
      )
    case "shortlisted":
      return (
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300">
          Shortlisted
        </Badge>
      )
    case "interview":
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300">
          Interview
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="outline" className="border-gray-300">
          Draft
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      )
  }
}

export function ApplicationsList({ applications, searchQuery = "" }: ApplicationsListProps) {
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications

    const query = searchQuery.toLowerCase()
    return applications.filter((application) => {
      const grant = application.grants
      const university = grant?.universities
      return (
        grant?.title?.toLowerCase().includes(query) ||
        university?.name?.toLowerCase().includes(query) ||
        university?.country?.toLowerCase().includes(query) ||
        application.status.toLowerCase().includes(query)
      )
    })
  }, [applications, searchQuery])

  if (filteredApplications.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No applications found" : "No applications yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Start applying to scholarships to see your applications here."}
          </p>
          {!searchQuery && (
            <Link href="/scholarships">
              <Button>Browse Scholarships</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredApplications.map((application) => {
        const grant = application.grants
        const university = grant?.universities

        return (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* University Logo/Icon */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    {university?.name?.[0] || "U"}
                  </div>
                </div>

                {/* Application Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{grant?.title || "Application"}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      {university && (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">{university.name}</span>
                          {university.city && university.country && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {university.city}, {university.country}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Application Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {application.submitted_at && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {new Date(application.submitted_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {grant?.deadline && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {application.r_score && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="font-medium">R-Score:</span>
                        <span className="font-semibold text-orange-600">{application.r_score}/100</span>
                      </div>
                    )}
                    {application.match_score && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="font-medium">Match:</span>
                        <span className="font-semibold text-blue-600">{application.match_score}%</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/scholarships/${grant?.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                    {application.status === "draft" && (
                      <Link href={`/applications/new?grant=${grant?.id}`}>
                        <Button size="sm" className="w-full sm:w-auto">
                          Continue Application
                        </Button>
                      </Link>
                    )}
                    {application.status === "accepted" && (
                      <Link href={`/applications/success?applicationId=${application.id}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Download className="mr-2 h-4 w-4" />
                          View Acceptance
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
