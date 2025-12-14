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
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">140+ Countries • 1000+ Universities Worldwide</span>
              <span className="sm:hidden">140+ Countries</span>
            </div>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Global Scholarships for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MS & PhD Students
              </span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              The intelligent platform connecting global talent with world-class universities. We combine trust and AI
              to empower your academic mobility.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/scholarships">Browse Scholarships</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">Trusted by 100+ Universities worldwide</p>
          </div>
        </div>

        {/* Trusted Universities Strip */}
        <div className="container mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 sm:mb-6 text-center text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Trusted by Leading Institutions Worldwide
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 flex-wrap opacity-60 grayscale">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-muted" />
                <span className="text-xs sm:text-sm font-medium">Cambridge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-muted" />
                <span className="text-xs sm:text-sm font-medium">Stanford</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-muted" />
                <span className="text-xs sm:text-sm font-medium">MIT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Why Choose The Career Bird?
            </h2>
            <p className="text-lg text-muted-foreground">
              We combine verified trust, artificial intelligence, and global reach to empower your next academic journey
              seamlessly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Global Mobility */}
            <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Global Mobility</h3>
              <p className="text-muted-foreground">
                Seamlessly connect with opportunities in 140+ countries. We handle the complexity of international
                relocation and support.
              </p>
            </div>

            {/* Intelligent Matching */}
            <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950">
                <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Intelligent Matching</h3>
              <p className="text-muted-foreground">
                AI-driven algorithms to find opportunities that align with your unique profile and aspirations.
              </p>
            </div>

            {/* Verified Trust */}
            <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Verified Trust</h3>
              <p className="text-muted-foreground">
                Secure and verified profiles for students and institutions, eliminating fraud and building confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tailored Journey Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Tailored for your journey
            </h2>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <Button variant="default" size="lg">
              For Students
            </Button>
            <Button variant="outline" size="lg">
              For Professors
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* For Students Card */}
            <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                  FOR STUDENTS
                </span>
              </div>
              <div className="p-8 pt-16">
                <h3 className="text-2xl font-bold mb-3">Secure Your Future</h3>
                <p className="text-muted-foreground mb-6">
                  Access thousands of fully-funded MS/PhD funding opportunities and connect with mentors at the world's
                  top universities.
                </p>
                <Button asChild>
                  <Link href="/scholarships">Browse Scholarships</Link>
                </Button>
              </div>
            </div>

            {/* For Professors Card */}
            <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-300">
                  FOR PROFESSORS
                </span>
              </div>
              <div className="p-8 pt-16">
                <h3 className="text-2xl font-bold mb-3">Build Your Lab</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with pre-vetted, high-potential researchers ready to contribute to your research.
                </p>
                <Button asChild>
                  <Link href="/for-professors">Find Researchers</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border bg-card p-8 md:p-12 text-center">
              <div className="mb-6 text-4xl">💬</div>
              <blockquote className="text-xl md:text-2xl font-medium mb-6 text-balance">
                "The Career Bird didn't just find me a scholarship; it found me a community and a mentor who changed the
                trajectory of my research."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="text-left">
                  <p className="font-semibold">Elena Rodriguez</p>
                  <p className="text-sm text-muted-foreground">PhD Candidate, MIT • Neuroscience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Ready to take flight?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students and professors connected daily on the world's most intelligent academic
              platform.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/signup">Create Free Profile</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🐦</span>
                </div>
                <span className="font-semibold">The Career Bird</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Empowering global academic mobility through trust and technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/scholarships" className="hover:text-foreground">
                    Browse Scholarships
                  </Link>
                </li>
                <li>
                  <Link href="/universities">For Universities</Link>
                </li>
                <li>
                  <Link href="/mentors">University Mentors</Link>
                </li>
                <li>
                  <Link href="/for-professors">Matches for Professors</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/press">Press</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/cookie">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 The Career Bird. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
