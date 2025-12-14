import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, AlertCircleIcon } from "lucide-react"
import Link from "next/link"

interface SavedOpportunitiesProps {
  savedGrants: Array<{
    id: string
    grants?: {
      id: string
      title: string
      deadline?: string
      universities?: {
        name: string
        country?: string
      }
    }
  }>
}

export function SavedOpportunities({ savedGrants }: SavedOpportunitiesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Saved Opportunities</CardTitle>
        {savedGrants.length > 0 && (
          <Button variant="link" asChild className="h-auto p-0 text-primary text-sm">
            <Link href="/scholarships?filter=saved">View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {savedGrants && savedGrants.length > 0 ? (
          savedGrants.map((saved) => (
            <Link
              key={saved.id}
              href={`/scholarships/${saved.grants?.id || saved.id}`}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                {saved.grants?.universities?.name?.substring(0, 2).toUpperCase() || "OP"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                  {saved.grants?.title || "Opportunity"}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {saved.grants?.universities?.name}
                  {saved.grants?.universities?.country && ` • ${saved.grants.universities.country}`}
                </p>
                {saved.grants?.deadline && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <AlertCircleIcon className="h-3 w-3 text-orange-600 flex-shrink-0" />
                    <span className="text-xs text-orange-600">
                      Deadline:{" "}
                      {new Date(saved.grants.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <BookmarkIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm sm:text-base mb-1">No saved opportunities yet</p>
            <p className="text-xs text-muted-foreground mb-4">Start browsing and save opportunities you're interested in</p>
            <Button variant="outline" asChild>
              <Link href="/scholarships">Browse Scholarships</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
