import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  SendIcon,
  FileTextIcon,
  CalendarIcon,
  AlertCircleIcon,
  BookmarkIcon,
  SparklesIcon,
  BellIcon,
} from "lucide-react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SavedOpportunities } from "@/components/dashboard/saved-opportunities"
import { ProfileStrength } from "@/components/dashboard/profile-strength"
import { ThisWeek } from "@/components/dashboard/this-week"
import { PremiumCard } from "@/components/dashboard/premium-card"
import { AIRecommendation } from "@/components/dashboard/ai-recommendation"

export default async function StudentDashboard() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Fetch user profile with error handling
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Fetch applications with error handling
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        university_id,
        universities:university_id (
          name,
          country
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch saved opportunities with error handling
  const { data: savedGrants, error: savedGrantsError } = await supabase
    .from("saved_grants")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        deadline,
        universities:university_id (
          name,
          country
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch a recommended grant (for now, just get the first available grant)
  // In the future, this would use AI matching based on user profile
  // Note: Students cannot see created_by field (professors are hidden)
  const { data: recommendedGrantData } = await supabase
    .from("grants")
    .select(
      `
      id,
      title,
      funding_amount,
      stipend_monthly,
      language,
      deadline,
      start_date,
      universities:university_id (
        name,
        country
      )
    `,
    )
    .limit(1)
    .single()
  
  // Transform to match expected type (handle universities as single object)
  const recommendedGrant = recommendedGrantData ? {
    id: recommendedGrantData.id,
    title: recommendedGrantData.title,
    funding_type: recommendedGrantData.funding_amount,
    stipend_amount: recommendedGrantData.stipend_monthly,
    language: recommendedGrantData.language,
    universities: Array.isArray(recommendedGrantData.universities) 
      ? recommendedGrantData.universities[0] 
      : recommendedGrantData.universities
  } : undefined

  // Fetch upcoming deadlines from applications
  const { data: upcomingDeadlines } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        deadline,
        title,
        universities:university_id (
          name
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .not("grants.deadline", "is", null)
    .order("grants.deadline", { ascending: true })
    .limit(5)

  // Calculate stats
  const applicationsSent = applications?.length || 0
  const pendingReview = applications?.filter((app) => app.status === "under_review" || app.status === "pending").length || 0
  const interviewsScheduled = applications?.filter((app) => app.status === "interview" || app.status === "interview_scheduled").length || 0

  // Count upcoming deadlines this week
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const deadlinesThisWeek = upcomingDeadlines?.filter((app) => {
    if (!app.grants?.deadline) return false
    const deadline = new Date(app.grants.deadline)
    return deadline >= now && deadline <= nextWeek
  }).length || 0

  // Get user's first name
  const firstName = profile?.first_name || profile?.full_name?.split(" ")[0] || "there"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xl">🐦</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">The Career Bird</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/scholarships"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Find Scholarships
            </Link>
            <Link
              href="/applications"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Applications
            </Link>
            <Link
              href="/profile/edit"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/profile/edit">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {firstName}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {deadlinesThisWeek > 0 ? (
              <>
                You have{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-500">
                  {deadlinesThisWeek} upcoming deadline{deadlinesThisWeek !== 1 ? "s" : ""}
                </span>{" "}
                this week.
              </>
            ) : (
              "You're all caught up! No upcoming deadlines this week."
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8">
          <DashboardStats
            applicationsSent={applicationsSent}
            pendingReview={pendingReview}
            interviewsScheduled={interviewsScheduled}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommended Opportunity */}
            <AIRecommendation grant={recommendedGrant || undefined} />

            {/* Saved Opportunities */}
            <SavedOpportunities savedGrants={savedGrants || []} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <ProfileStrength profile={profile} />

            <ThisWeek upcomingDeadlines={upcomingDeadlines || []} />

            <PremiumCard />
          </div>
        </div>
      </main>
    </div>
  )
}
