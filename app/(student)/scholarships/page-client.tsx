"use client"

import { useState, useEffect, useMemo } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SearchIcon, BookmarkIcon, BellIcon, ArrowRightIcon, CalendarIcon, Filter, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ScholarshipsPageClientProps {
  initialGrants: any[]
  initialUser?: any
  initialSavedGrants?: string[]
}

export function ScholarshipsPageClient({ 
  initialGrants, 
  initialUser = null,
  initialSavedGrants = []
}: ScholarshipsPageClientProps) {
  const router = useRouter()
  const [grants] = useState<any[]>(initialGrants)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    degreeLevels: [] as string[],
    countries: [] as string[],
    fields: [] as string[],
  })
  const [savedGrants, setSavedGrants] = useState<Set<string>>(new Set(initialSavedGrants))
  const [user, setUser] = useState<any>(initialUser)
  const [showFilters, setShowFilters] = useState(false)

  // Try to get user on client side (optional, won't fail if not authenticated)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          setUser(currentUser)
          // Fetch saved grants if user is logged in
          const { data: saved } = await supabase
            .from("saved_grants")
            .select("grant_id")
            .eq("user_id", currentUser.id)
          if (saved) {
            setSavedGrants(new Set(saved.map((s) => s.grant_id)))
          }
        }
      } catch (error) {
        // User is not authenticated - this is fine
      }
    }
    checkUser()
  }, [])

  const filteredGrants = useMemo(() => {
    let filtered = [...grants]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (grant) =>
          grant.title?.toLowerCase().includes(query) ||
          grant.description?.toLowerCase().includes(query) ||
          grant.universities?.name?.toLowerCase().includes(query) ||
          grant.universities?.country?.toLowerCase().includes(query),
      )
    }

    // Degree level filter
    if (filters.degreeLevels.length > 0) {
      filtered = filtered.filter((grant) =>
        filters.degreeLevels.some((level) => grant.degree_levels?.includes(level)),
      )
    }

    // Country filter
    if (filters.countries.length > 0) {
      filtered = filtered.filter((grant) =>
        filters.countries.includes(grant.universities?.country),
      )
    }

    // Field filter
    if (filters.fields.length > 0) {
      filtered = filtered.filter((grant) =>
        filters.fields.some((field) => grant.fields_of_study?.includes(field)),
      )
    }

    return filtered
  }, [grants, searchQuery, filters])

  const toggleFilter = (type: "degreeLevels" | "countries" | "fields", value: string) => {
    setFilters((prev) => {
      const current = prev[type]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [type]: updated }
    })
  }

  const clearFilters = () => {
    setFilters({ degreeLevels: [], countries: [], fields: [] })
    setSearchQuery("")
  }

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleBookmark = async (grantId: string) => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      const isSaved = savedGrants.has(grantId)

      if (isSaved) {
        await supabase.from("saved_grants").delete().eq("user_id", user.id).eq("grant_id", grantId)
        setSavedGrants((prev) => {
          const newSet = new Set(prev)
          newSet.delete(grantId)
          return newSet
        })
      } else {
        await supabase.from("saved_grants").insert({
          user_id: user.id,
          grant_id: grantId,
        })
        setSavedGrants((prev) => new Set([...prev, grantId]))
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  // Get unique countries and fields for filters
  const uniqueCountries = Array.from(new Set(grants.map((g) => g.universities?.country).filter(Boolean)))
  const uniqueFields = Array.from(
    new Set(grants.flatMap((g) => g.fields_of_study || []).filter(Boolean)),
  ).slice(0, 10)

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
              className="text-sm font-medium text-primary"
            >
              Scholarships
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile/edit"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <BellIcon className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            )}
            {user ? (
              <Link href="/profile/edit">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Scholarships</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Find Your Next Global Opportunity</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover master's and PhD scholarships at top global institutions. Connect with professors and secure your
            future.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
            {/* Mobile filter header */}
            <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b">
              <h3 className="font-semibold text-base">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Degree Level</h3>
                  <div className="space-y-2">
                    {["masters", "phd", "postdoc"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`degree-${level}`}
                          checked={filters.degreeLevels.includes(level)}
                          onCheckedChange={() => toggleFilter("degreeLevels", level)}
                        />
                        <Label htmlFor={`degree-${level}`} className="text-sm cursor-pointer capitalize">
                          {level === "phd" ? "PhD" : level === "postdoc" ? "Postdoc" : "Master's"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Country</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueCountries.slice(0, 10).map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={filters.countries.includes(country)}
                          onCheckedChange={() => toggleFilter("countries", country)}
                        />
                        <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Field of Study</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueFields.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field}`}
                          checked={filters.fields.includes(field)}
                          onCheckedChange={() => toggleFilter("fields", field)}
                        />
                        <Label htmlFor={`field-${field}`} className="text-sm cursor-pointer">
                          {field}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships by title, university, or country..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">1-{filteredGrants.length}</span> of{" "}
                  <span className="font-medium text-foreground">{grants.length}</span> Scholarships
                </p>
                {(filters.degreeLevels.length > 0 || filters.countries.length > 0 || filters.fields.length > 0) && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {filters.degreeLevels.map((level) => (
                      <Badge key={level} variant="secondary" className="bg-blue-100 text-blue-700 border-0 capitalize">
                        {level}
                        <button
                          className="ml-2 hover:bg-blue-200 rounded px-1"
                          onClick={() => toggleFilter("degreeLevels", level)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {filters.countries.map((country) => (
                      <Badge key={country} variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                        {country}
                        <button
                          className="ml-2 hover:bg-blue-200 rounded px-1"
                          onClick={() => toggleFilter("countries", country)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {filters.fields.map((field) => (
                      <Badge key={field} variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                        {field}
                        <button
                          className="ml-2 hover:bg-blue-200 rounded px-1"
                          onClick={() => toggleFilter("fields", field)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scholarship Cards */}
            {filteredGrants.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No scholarships found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredGrants.map((grant) => {
                  const daysLeft = getDaysUntilDeadline(grant.deadline)
                  const isSaved = savedGrants.has(grant.id)
                  const universityInitials = grant.universities?.name
                    ?.split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .substring(0, 3)
                    .toUpperCase() || "UNI"

                  return (
                    <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                            {grant.universities?.logo_url ? (
                              <img
                                src={grant.universities.logo_url}
                                alt={grant.universities.name}
                                className="h-full w-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-white text-xs font-bold">{universityInitials}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  {grant.universities?.country && (
                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                      {grant.universities.country}
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
                                  {grant.universities?.name || "University"}
                                </h3>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 h-9 w-9"
                                onClick={() => handleBookmark(grant.id)}
                              >
                                <BookmarkIcon
                                  className={`h-5 w-5 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`}
                                />
                              </Button>
                            </div>

                            <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">{grant.title}</h4>

                            <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                              {grant.description || "No description available."}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {grant.grant_type && (
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {grant.grant_type.replace("_", " ")}
                                </Badge>
                              )}
                              {grant.degree_levels?.map((level: string) => (
                                <Badge key={level} variant="secondary" className="text-xs capitalize">
                                  {level}
                                </Badge>
                              ))}
                              {grant.covers_tuition && (
                                <Badge variant="secondary" className="text-xs">
                                  Fully Funded
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-1 text-sm">
                                {grant.deadline && (
                                  <>
                                    <CalendarIcon
                                      className={`h-4 w-4 ${daysLeft !== null && daysLeft <= 7 ? "text-orange-600" : "text-muted-foreground"}`}
                                    />
                                    {daysLeft !== null && daysLeft > 0 ? (
                                      <span
                                        className={daysLeft <= 7 ? "text-orange-600 font-medium" : "text-muted-foreground"}
                                      >
                                        {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Deadline: {formatDeadline(grant.deadline)}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <Button asChild size="sm" className="w-full sm:w-auto">
                                <Link href={`/scholarships/${grant.id}`}>
                                  View Details
                                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
