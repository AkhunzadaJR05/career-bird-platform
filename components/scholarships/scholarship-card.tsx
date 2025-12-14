"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface ScholarshipCardProps {
  grant: any
}

export function ScholarshipCard({ grant }: ScholarshipCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const supabase = getSupabaseBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    if (isSaved) {
      await supabase.from("saved_grants").delete().match({ user_id: user.id, grant_id: grant.id })
      setIsSaved(false)
    } else {
      await supabase.from("saved_grants").insert({ user_id: user.id, grant_id: grant.id })
      setIsSaved(true)
    }
  }

  const getDaysUntilDeadline = () => {
    if (!grant.deadline) return null
    const today = new Date()
    const deadline = new Date(grant.deadline)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilDeadline()
  const isUrgent = daysLeft !== null && daysLeft <= 12

  return (
    <Link href={`/scholarships/${grant.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {grant.universities?.logo_url ? (
                  <Image
                    src={grant.universities.logo_url || "/placeholder.svg"}
                    alt={grant.universities.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-bold text-muted-foreground">
                    {grant.universities?.name?.[0] || "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {grant.universities?.country || "Global"}
                </p>
                <p className="text-sm font-semibold">{grant.universities?.name || "Various Universities"}</p>
                {grant.is_featured && (
                  <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>

          <h3 className="mb-2 font-bold leading-tight text-balance group-hover:text-primary">{grant.title}</h3>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{grant.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {grant.covers_tuition && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {grant.grant_type === "scholarship" ? "Fully Funded" : "Full Tuition"}
              </Badge>
            )}
            {grant.degree_levels?.includes("phd") && <Badge variant="secondary">PhD</Badge>}
            {grant.degree_levels?.includes("masters") && <Badge variant="secondary">MS/PhD</Badge>}
            {grant.stipend_monthly && <Badge variant="secondary">Monthly Stipend</Badge>}
          </div>

          <div className="flex items-center justify-between border-t pt-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {daysLeft !== null && daysLeft > 0 ? (
                <span className={isUrgent ? "font-medium text-orange-600" : ""}>
                  {isUrgent && "⚠️ "}
                  {daysLeft} days left
                </span>
              ) : (
                <span>Deadline passed</span>
              )}
            </div>

            <Button variant="link" className="h-auto p-0 text-primary">
              Apply Now →
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
