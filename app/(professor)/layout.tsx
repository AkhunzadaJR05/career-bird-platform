import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/professor/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-lg font-bold text-white">🎓</span>
              </div>
              <span className="text-xl font-bold">The Career Bird</span>
            </Link>
            <nav className="hidden md:flex md:gap-6">
              <Link href="/professor/dashboard" className="text-sm font-medium transition-colors hover:text-blue-600">
                Dashboard
              </Link>
              <Link
                href="/professor/positions"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
              >
                Open Positions
              </Link>
              <Link
                href="/professor/interviews"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
              >
                Interviews
              </Link>
              <Link
                href="/professor/settings"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
              AS
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Dr. A. Smith</p>
              <p className="text-xs text-gray-500">Computer Science Dept.</p>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
