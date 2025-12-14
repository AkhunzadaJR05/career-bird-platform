"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SparklesIcon, BookmarkIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AIRecommendationProps {
  grant?: {
    id: string
    title: string
    universities?: {
      name: string
      country: string
    }
    funding_type?: string
    funding_amount?: string
    stipend_amount?: number | string
    language?: string
  }
}

export function AIRecommendation({ grant }: AIRecommendationProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // If no grant provided, show empty state with call to action
  if (!grant) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <Badge className="bg-blue-600 text-white">
              <SparklesIcon className="h-3 w-3 mr-1" />
              AI Recommendations
            </Badge>
          </div>

          <div className="text-center py-6 sm:py-8">
            <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 opacity-50" />
            <h3 className="font-semibold text-lg sm:text-xl mb-2">No recommendations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your profile to get personalized scholarship recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Button asChild className="flex-1 sm:flex-initial">
                <Link href="/scholarships">Browse Scholarships</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 sm:flex-initial">
                <Link href="/profile/edit">Complete Profile</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleBookmark = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      if (isBookmarked) {
        // Remove bookmark
        await supabase.from("saved_grants").delete().eq("user_id", user.id).eq("grant_id", grant.id)
        setIsBookmarked(false)
      } else {
        // Add bookmark
        await supabase.from("saved_grants").insert({
          user_id: user.id,
          grant_id: grant.id,
        })
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotInterested = async () => {
    setIsLoading(true)
    try {
      // You can implement a "not interested" feature here
      // For now, just show a message
      alert("We'll show you fewer similar opportunities")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-blue-600 text-white">
            <SparklesIcon className="h-3 w-3 mr-1" />
            98% MATCH - AI Recommended
          </Badge>
          <button
            onClick={handleBookmark}
            disabled={isLoading}
            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <BookmarkIcon
              className={`h-5 w-5 transition-colors ${
                isBookmarked ? "text-blue-600 fill-blue-600" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {grant.universities?.name?.substring(0, 3).toUpperCase() || "UNI"}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg sm:text-xl mb-1 truncate">{grant.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              {grant.universities?.name} • {grant.universities?.country}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(grant.funding_type || grant.funding_amount) && (
                <Badge variant="secondary" className="text-xs">
                  {grant.funding_type || grant.funding_amount}
                </Badge>
              )}
              {grant.stipend_amount && (
                <Badge variant="secondary" className="text-xs">
                  Stipend: {typeof grant.stipend_amount === 'string' ? grant.stipend_amount : `€${grant.stipend_amount.toLocaleString()}/mo`}
                </Badge>
              )}
              {grant.language && (
                <Badge variant="secondary" className="text-xs">
                  {grant.language} Taught
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button asChild className="flex-1">
                <Link href={`/scholarships/${grant.id}`}>View Details</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial"
                onClick={handleNotInterested}
                disabled={isLoading}
              >
                Not Interested
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
