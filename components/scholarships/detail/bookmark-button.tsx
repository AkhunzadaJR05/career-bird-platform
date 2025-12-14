"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookmarkIcon } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface ScholarshipBookmarkButtonProps {
  grantId: string
  initialSaved: boolean
}

export function ScholarshipBookmarkButton({ grantId, initialSaved }: ScholarshipBookmarkButtonProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const handleBookmark = async () => {
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

      if (isSaved) {
        await supabase.from("saved_grants").delete().eq("user_id", user.id).eq("grant_id", grantId)
        setIsSaved(false)
      } else {
        await supabase.from("saved_grants").insert({
          user_id: user.id,
          grant_id: grantId,
        })
        setIsSaved(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex-1 bg-transparent"
      onClick={handleBookmark}
      disabled={loading}
    >
      <BookmarkIcon className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  )
}


