"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, CheckCircle2Icon } from "lucide-react"

interface ProfileResult {
  id: string
  name: string
  title: string
  department: string
  university: string
  isVerified: boolean
  avatarUrl?: string
  status: "available" | "pending" | "locked"
}

export default function ClaimProfilePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ProfileResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/profiles/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (!response.ok) {
        throw new Error("Search failed")
      }
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleClaimProfile = (profileId: string) => {
    router.push(`/verify-identity?profile=${profileId}`)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xl">🐦</span>
            </div>
            <span className="font-semibold text-base sm:text-lg">The Career Bird</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/about"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hidden sm:inline"
            >
              For Professors
            </Link>
            <Link
              href="/universities"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hidden sm:inline"
            >
              For Universities
            </Link>
            <Link
              href="/about"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hidden sm:inline"
            >
              About Us
            </Link>
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Claim Your Academic Profile
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Verify your identity to manage scholarships, showcase your research, and connect with global talent.
            </p>
            <Button variant="link" asChild className="text-primary text-xs sm:text-sm">
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>

          {/* Search Box */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, title, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 text-sm sm:text-base lg:text-lg h-10 sm:h-12"
                    required
                    minLength={2}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading || searchQuery.trim().length < 2}>
                  {loading ? "Searching..." : "Search"}
                </Button>
                {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Please enter at least 2 characters to search
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Search Results
                  <span className="ml-2 text-xs sm:text-sm font-normal text-muted-foreground">
                    {searchResults.length} profile{searchResults.length !== 1 ? "s" : ""} found
                  </span>
                </h2>
              </div>

              {searchResults.length > 0 ? (
                <>
                  {searchResults.map((profile) => (
                    <Card key={profile.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                          {/* Avatar */}
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shrink-0" />

                          {/* Profile Info */}
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-base sm:text-lg truncate">{profile.name}</h3>
                                  {profile.isVerified && (
                                    <CheckCircle2Icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground truncate">{profile.title}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  {profile.department || profile.university}
                                </p>
                                {profile.university && profile.department && (
                                  <p className="text-xs text-muted-foreground truncate">{profile.university}</p>
                                )}
                              </div>

                              {/* Action Button */}
                              <div className="shrink-0 w-full sm:w-auto">
                                {profile.status === "available" && (
                                  <div className="flex flex-col sm:flex-col-reverse items-stretch sm:items-end gap-2">
                                    <Button
                                      onClick={() => handleClaimProfile(profile.id)}
                                      className="w-full sm:w-auto"
                                    >
                                      Claim Profile
                                    </Button>
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200 text-xs w-fit sm:ml-auto"
                                    >
                                      Available to Claim
                                    </Badge>
                                  </div>
                                )}
                                {profile.status === "pending" && (
                                  <div className="flex flex-col sm:flex-col-reverse items-stretch sm:items-end gap-2">
                                    <Button variant="outline" disabled className="w-full sm:w-auto bg-transparent">
                                      Locked
                                    </Button>
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs w-fit sm:ml-auto"
                                    >
                                      Pending Verification
                                    </Badge>
                                  </div>
                                )}
                                {profile.status === "locked" && (
                                  <div className="flex flex-col sm:flex-col-reverse items-stretch sm:items-end gap-2">
                                    <Button variant="outline" disabled className="w-full sm:w-auto bg-transparent">
                                      Locked
                                    </Button>
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-50 text-gray-700 border-gray-200 text-xs w-fit sm:ml-auto"
                                    >
                                      Locked
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card className="border-dashed bg-muted/30">
                  <CardContent className="p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg">No profiles found</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Try a different search query or create a new verified academic profile to get started.
                    </p>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/signup">Create New Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Create New Profile */}
              {searchResults.length > 0 && (
                <Card className="border-dashed bg-muted/30">
                  <CardContent className="p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg">Don't see your profile?</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      If you couldn't find your existing profile in our database, you can create a new verified
                      academic profile to get started.
                    </p>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/signup">Create New Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 sm:mt-20 py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <p>&copy; 2025 The Career Bird. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-foreground">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
