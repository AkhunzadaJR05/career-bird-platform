"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, MapPin, Share2, Sparkles, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"

interface ScholarshipDetailHeaderProps {
  grant: any
  isSaved: boolean
}

export function ScholarshipDetailHeader({ grant, isSaved: initialSaved }: ScholarshipDetailHeaderProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)

  const handleSave = async () => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/scholarships" className="hover:text-foreground">
          Scholarships
        </Link>
        <span>/</span>
        <Link href="/scholarships?country=United%20Kingdom" className="hover:text-foreground">
          United Kingdom
        </Link>
        <span>/</span>
        <span className="text-foreground">Global Excellence PhD Fellowship</span>
      </div>

      <div className="flex items-start gap-6">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          {grant.universities?.logo_url ? (
            <Image
              src={grant.universities.logo_url || "/placeholder.svg"}
              alt={grant.universities.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
              {grant.universities?.name?.[0] || "U"}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified Opportunity
            </Badge>
            <Badge variant="destructive">Highly Competitive</Badge>
          </div>

          <h1 className="mb-2 text-3xl font-bold">{grant.title}</h1>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{grant.universities?.name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {grant.universities?.city}, {grant.universities?.country}
              </span>
            </div>
            {grant.universities?.ranking && (
              <Badge variant="secondary">
                <Sparkles className="mr-1 h-3 w-3" />#{grant.universities.ranking} World Ranking (THE)
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleSave}>
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-blue-900">Full Tuition + £18,000/yr</span>
        </div>

        <Badge variant="secondary" className="px-3 py-1">
          3-4 Years Duration
        </Badge>

        <Badge variant="secondary" className="px-3 py-1">
          Department of Computer Science
        </Badge>
      </div>
    </div>
  )
}
