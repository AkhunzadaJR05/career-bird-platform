import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ApplicationsPageClient } from "./page-client"

async function getApplicationsData() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch all applications for the user
  const { data: applications, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        description,
        deadline,
        funding_amount,
        stipend_monthly,
        universities:university_id (
          id,
          name,
          country,
          city
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
    return { applications: [] }
  }

  return { applications: applications || [] }
}

export default async function ApplicationsPage() {
  const { applications } = await getApplicationsData()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xl">🐦</span>
            </div>
            <span className="font-semibold text-base sm:text-lg">The Career Bird</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/scholarships" className="text-xs sm:text-sm text-primary font-medium">
              Scholarships
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage all your scholarship applications in one place.
          </p>
        </div>

        {/* Client Component for Search and List */}
        <ApplicationsPageClient applications={applications} />
      </main>
    </div>
  )
}


