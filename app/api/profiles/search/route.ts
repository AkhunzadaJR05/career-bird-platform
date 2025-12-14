import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 })
  }

  const supabase = await getSupabaseServerClient()

  // Search profiles for professors (users with professor role)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      first_name,
      last_name,
      title,
      department,
      university_id,
      universities:university_id (
        id,
        name,
        country
      )
    `,
    )
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,title.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error("Error searching profiles:", error)
    return NextResponse.json({ error: "Failed to search profiles" }, { status: 500 })
  }

  // Format results
  const results = (profiles || []).map((profile: any) => {
    // Handle universities - Supabase returns it as a single object for foreign key relationships
    // but TypeScript might infer it as an array, so we handle both cases
    let universityName = "Unknown University"
    if (profile.universities) {
      if (Array.isArray(profile.universities)) {
        universityName = profile.universities[0]?.name || "Unknown University"
      } else {
        universityName = profile.universities.name || "Unknown University"
      }
    }

    return {
      id: profile.id,
      name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Unknown",
      title: profile.title || "Professor",
      department: profile.department || "",
      university: universityName,
      isVerified: true, // You can add a verified field to profiles if needed
      status: "available" as const,
    }
  })

  return NextResponse.json({ results })
}


