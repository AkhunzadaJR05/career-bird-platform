import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Sparkles, ShieldCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-base sm:text-xl font-bold">🐦</span>
            </div>
            <span className="font-semibold text-base sm:text-lg">The Career Bird</span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/about"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/scholarships"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Scholarships
            </Link>
            <Link
              href="/universities"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              For Universities
            </Link>
            <Link
              href="/mentors"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mentors
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="text-xs sm:text-sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Global Opportunity
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Connect with professors, discover master's and PhD scholarships, and take your academic career to the next
            level. Join thousands of students finding their perfect match.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/scholarships">
                Browse Scholarships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 border-t">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
            Why Choose The Career Bird?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Our intelligent system matches you with opportunities that align with your research interests and
                academic profile.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Access scholarships and opportunities from top universities worldwide. Expand your academic horizons.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Verified Opportunities</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                All opportunities are verified and directly posted by professors. Trustworthy and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 border-t">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Join thousands of students who have found their perfect academic match. It's free to get started.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🐦</span>
                </div>
                <span className="font-semibold text-lg">The Career Bird</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting students with global academic opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/scholarships" className="hover:text-foreground">
                    Browse Scholarships
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-foreground">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Professors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/professor/dashboard" className="hover:text-foreground">
                    Post Opportunities
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-foreground">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} The Career Bird. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
