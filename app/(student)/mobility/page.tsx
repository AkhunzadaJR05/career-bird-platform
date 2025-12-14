import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Lock,
  Calendar,
  FileText,
  Home,
  Plane,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Eye,
  Menu,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

async function getMobilityData() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, nationality, current_country, field_of_study")
    .eq("user_id", user.id)
    .single()

  const firstName = profile?.first_name || "Student"

  // Fetch accepted applications to determine destination
  const { data: acceptedApplications } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        universities:university_id (
          name,
          country,
          city
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })
    .limit(1)

  const destination = acceptedApplications?.[0]?.grants?.universities?.name || "Your Destination University"

  // Calculate days to departure based on grant start date or deadline
  let daysToDeparture = 0
  
  if (acceptedApplications?.[0]?.grants) {
    // Try to get start_date from grant, or calculate from deadline
    const grant = acceptedApplications[0].grants
    let departureDate: Date | null = null
    
    if (grant.start_date) {
      departureDate = new Date(grant.start_date)
    } else if (grant.deadline) {
      // Estimate 3 months after deadline
      departureDate = new Date(grant.deadline)
      departureDate.setMonth(departureDate.getMonth() + 3)
    }
    
    if (departureDate) {
      daysToDeparture = Math.ceil((departureDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      daysToDeparture = Math.max(0, daysToDeparture) // Don't show negative days
    }
  }

  // Fetch user documents
  const { data: documents } = await supabase
    .from("documents")
    .select("id, name, document_type, uploaded_at")
    .eq("user_id", user.id)
    .in("document_type", ["cv", "transcript", "recommendation", "sop"])
    .order("uploaded_at", { ascending: false })
    .limit(5)

  // Fetch upcoming deadlines from applications for upcoming events
  const { data: upcomingDeadlines } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        deadline,
        title,
        start_date
      )
    `,
    )
    .eq("user_id", user.id)
    .not("grants.deadline", "is", null)
    .order("grants.deadline", { ascending: true })
    .limit(5)

  // Build upcoming events from actual deadlines
  const upcoming: Array<{
    id: string
    title: string
    date: string
    daysLeft: number
    type: "urgent" | "info"
  }> = []

  if (upcomingDeadlines) {
    const now = new Date()
    upcomingDeadlines.forEach((app) => {
      if (app.grants?.deadline) {
        const deadline = new Date(app.grants.deadline)
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (daysLeft >= 0 && daysLeft <= 30) {
          const month = deadline.toLocaleDateString("en-US", { month: "short" })
          const day = deadline.getDate()
          upcoming.push({
            id: app.id,
            title: `Deadline: ${app.grants.title || "Application"}`,
            date: `${month} ${day}`,
            daysLeft,
            type: daysLeft <= 7 ? "urgent" : "info",
          })
        }
      }
    })
  }

  // Build journey steps based on application status
  const journey = [
    {
      id: "1",
      title: "University Acceptance",
      description: acceptedApplications?.[0]
        ? `Confirmed placement at ${destination}.`
        : "Complete your application to unlock this step.",
      status: acceptedApplications?.[0] ? "completed" : "pending",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      id: "2",
      title: "Visa Application",
      description: acceptedApplications?.[0]
        ? "Prepare your visa documents and schedule interview."
        : "Unlocks after acceptance.",
      status: acceptedApplications?.[0] ? "in-progress" : "locked",
      icon: FileText,
      color: "text-blue-600",
      alert: acceptedApplications?.[0]
        ? {
            type: "warning",
            message: "Action Required: Prepare Visa Documents",
            details: "Start gathering required documents for your visa application.",
            action: "View Checklist",
          }
        : undefined,
    },
    {
      id: "3",
      title: "Housing Hunt",
      description: acceptedApplications?.[0]
        ? "Research housing options near your university."
        : "Unlocks after acceptance.",
      status: acceptedApplications?.[0] ? "pending" : "locked",
      icon: Home,
      color: "text-gray-400",
    },
    {
      id: "4",
      title: "Travel & Logistics",
      description: acceptedApplications?.[0]
        ? "Book flights and arrange transportation."
        : "Unlocks after acceptance.",
      status: acceptedApplications?.[0] ? "pending" : "locked",
      icon: Plane,
      color: "text-gray-400",
    },
  ]

  // Calculate readiness score based on profile completion and documents
  const profileFields = [
    profile?.first_name,
    profile?.last_name,
    profile?.nationality,
    profile?.current_country,
    profile?.field_of_study,
  ]
  const completedFields = profileFields.filter(Boolean).length
  const readinessScore = Math.min(
    100,
    Math.round((completedFields / profileFields.length) * 60 + (documents?.length || 0) * 8),
  )

  // Get destination info from accepted application
  const destinationCity = acceptedApplications?.[0]?.grants?.universities?.city
  const destinationCountry = acceptedApplications?.[0]?.grants?.universities?.country

  return {
    user: {
      name: firstName,
      destination,
    },
    countdown: {
      days: daysToDeparture || 0,
      readinessScore,
      readinessChange: 5,
      budgetUtilized: 35,
    },
    journey,
    destination: {
      city: destinationCity && destinationCountry
        ? `${destinationCity}, ${destinationCountry}`
        : "Your Destination",
      weather: destinationCountry ? "Check local weather" : "N/A",
      currency: destinationCountry ? "Check exchange rates" : "N/A",
      image: "/images/4.png",
    },
    upcoming: upcoming.length > 0 ? upcoming : [],
    documents:
      documents?.map((doc) => ({
        id: doc.id,
        name: doc.name,
        icon: "📄",
        status: "uploaded",
      })) || [],
  }
}

export default async function MobilityOSPage() {
  const data = await getMobilityData()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Sidebar Toggle - Hidden on desktop */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-gray-800 bg-gray-950 p-4 sm:p-6 overflow-y-auto">
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base">Mobility OS</h2>
              <p className="text-xs text-gray-400">Travel Assistant</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/mobility"
            className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500">
              <span className="text-lg">🎓</span>
            </div>
            <span>Command Center</span>
          </Link>
          <Link
            href="/profile/edit"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
              <FileText className="h-4 w-4" />
            </div>
            <span>My Documents</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
              <span className="text-lg">💰</span>
            </div>
            <span>Finances</span>
          </Link>
          <Link
            href="/profile/edit"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
              <span className="text-lg">👤</span>
            </div>
            <span>University Profile</span>
          </Link>
        </nav>

        <div className="mt-auto">
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="text-lg">💡</div>
                <p className="text-sm font-semibold text-white">QUICK TIPS</p>
              </div>
              <p className="text-xs text-gray-400">
                Based on your Visa stage, make sure your passport has at least 6 months validity beyond your intended
                stay.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0 text-xs text-blue-400">
                Read Visa Guide →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="text-white">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {data.user.name}</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-400">
            Your journey to <span className="font-semibold text-blue-400">{data.user.destination}</span> is in motion.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/messages">
              <Button variant="outline" className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
                Ask Mentor
              </Button>
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700">View Pre-departure Guide</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">DAYS TO DEPARTURE</CardTitle>
              <Calendar className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-white">{data.countdown.days}</div>
              <p className="mt-1 flex items-center text-xs text-orange-400">
                <AlertCircle className="mr-1 h-3 w-3" />
                Time is ticking
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">READINESS SCORE</CardTitle>
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-white">{data.countdown.readinessScore}%</div>
              <p className="mt-1 flex items-center text-xs text-green-400">
                <TrendingUp className="mr-1 h-3 w-3" />+{data.countdown.readinessChange}% this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">BUDGET UTILIZED</CardTitle>
              <span className="text-lg">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-white">{data.countdown.budgetUtilized}%</div>
              <p className="mt-1 text-xs text-gray-400">On Track</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Your Journey */}
          <Card className="border-gray-800 bg-gray-900 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-base sm:text-lg">Your Journey</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm">
                View Full Roadmap
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {data.journey.map((step, idx) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="relative">
                      {idx < data.journey.length - 1 && (
                        <div className="absolute left-4 top-12 h-12 sm:h-16 w-0.5 bg-gray-800" />
                      )}
                      <div className="flex gap-3 sm:gap-4">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            step.status === "completed"
                              ? "bg-green-600"
                              : step.status === "in-progress"
                                ? "bg-blue-600"
                                : "bg-gray-800"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${step.status === "locked" ? "text-gray-600" : "text-white"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-white text-sm sm:text-base">{step.title}</h3>
                            {step.status === "completed" && (
                              <Badge variant="secondary" className="bg-green-900 text-green-300 text-xs">
                                Completed
                              </Badge>
                            )}
                            {step.status === "in-progress" && (
                              <Badge variant="secondary" className="bg-blue-900 text-blue-300 text-xs">
                                In Progress
                              </Badge>
                            )}
                            {step.status === "locked" && <Lock className="h-4 w-4 text-gray-600" />}
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-gray-400">{step.description}</p>

                          {step.alert && (
                            <Card className="mt-3 border-orange-800 bg-orange-950/20">
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-orange-300">{step.alert.message}</p>
                                    <p className="mt-1 text-xs text-orange-200">{step.alert.details}</p>
                                    <Button size="sm" className="mt-2 h-8 bg-blue-600 text-xs hover:bg-blue-700">
                                      {step.alert.action}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Destination */}
            <Card className="overflow-hidden border-gray-800 bg-gray-900">
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <Image
                  src={data.destination.image || "/placeholder.svg"}
                  alt="Destination"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">Destination</h3>
                  <p className="text-xl sm:text-2xl font-bold text-white">{data.destination.city}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span>☁️</span>
                    <span className="text-gray-300">{data.destination.weather}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💷</span>
                    <span className="text-gray-300">{data.destination.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white text-base sm:text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.upcoming.length > 0 ? (
                  <>
                    {data.upcoming.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-lg border p-3 ${item.type === "urgent" ? "border-red-800 bg-red-950/20" : "border-gray-800"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs sm:text-sm font-semibold truncate ${item.type === "urgent" ? "text-red-300" : "text-white"}`}
                            >
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.type === "urgent" ? "Due in " : "Starts in "}
                              {item.daysLeft} days
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-xs text-gray-500">OCT</p>
                            <p className="text-base sm:text-lg font-bold text-white">{item.date.split(" ")[1]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="h-auto w-full p-0 text-xs sm:text-sm text-blue-400">
                      View Full Calendar
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No upcoming events</p>
                )}
              </CardContent>
            </Card>

            {/* Document Vault */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white text-base sm:text-lg">Document Vault</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.documents.length > 0 ? (
                  data.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-gray-800 p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="text-xl sm:text-2xl shrink-0">{doc.icon}</div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{doc.name}</p>
                          <p className="text-xs text-green-400">✓ Uploaded</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white shrink-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400 mb-2">No documents uploaded yet</p>
                    <Link href="/profile/edit">
                      <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                        Upload Documents
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
