import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ScholarshipsPageClient } from "./page-client"

export default async function ScholarshipsPage() {
  const supabase = await getSupabaseServerClient()
  
  // Optional: Check for user but don't require authentication (public page)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch grants on server side (publicly accessible - students cannot see created_by field)
  const { data: grants, error } = await supabase
    .from("grants")
    .select(
      `
      id,
      title,
      description,
      grant_type,
      university_id,
      degree_levels,
      fields_of_study,
      eligible_countries,
      min_gpa,
      funding_amount,
      stipend_monthly,
      covers_tuition,
      covers_living,
      deadline,
      start_date,
      duration_months,
      language,
      application_url,
      is_featured,
      created_at,
      updated_at,
      universities:university_id (
        id,
        name,
        country,
        city,
        logo_url
      )
    `,
    )
    .order("created_at", { ascending: false })

  // Fetch saved grants only if user is logged in
  let savedGrants: string[] = []
  if (user) {
    const { data: saved } = await supabase
      .from("saved_grants")
      .select("grant_id")
      .eq("user_id", user.id)
    savedGrants = saved?.map((s) => s.grant_id) || []
  }

  return (
    <ScholarshipsPageClient 
      initialGrants={grants || []} 
      initialUser={user || null}
      initialSavedGrants={savedGrants}
    />
  )
}
