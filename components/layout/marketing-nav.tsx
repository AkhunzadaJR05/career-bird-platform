"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, GraduationCap, Building2, Users, BookOpen, User, LayoutDashboard, Sparkles, Home } from "lucide-react"

interface MarketingNavProps {
  user?: any
}

export function MarketingNav({ user }: MarketingNavProps = {}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const publicLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { href: "/for-professors", label: "For Professors", icon: Users },
    { href: "/for-universities", label: "For Universities", icon: Building2 },
    { href: "/about", label: "About", icon: BookOpen },
  ]

  const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile/edit", label: "Profile", icon: User },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🐦</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight">The Career Bird</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase hidden sm:block">
                Your Global Academic Partner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {!user && publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href) 
                    ? "text-foreground bg-accent/80" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/scholarships"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/scholarships") 
                      ? "text-foreground bg-accent/80" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  Scholarships
                  {isActive("/scholarships") && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href) 
                        ? "text-foreground bg-accent/80" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/profile/edit" className="hidden lg:block">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 cursor-pointer hover:scale-105 transition-transform shadow-lg flex items-center justify-center ring-2 ring-background">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="default" 
                  asChild 
                  className="text-sm font-medium hover:bg-accent/50"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button 
                  size="default" 
                  asChild 
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/signup">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Started
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[380px]">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">🐦</span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-base">The Career Bird</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          Your Global Academic Partner
                        </span>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-8">
                  {!user && publicLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                          isActive(link.href)
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                  {user && (
                    <>
                      <Link
                        href="/scholarships"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                          isActive("/scholarships")
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <GraduationCap className="h-5 w-5 flex-shrink-0" />
                        <span>Scholarships</span>
                      </Link>
                      {userLinks.map((link) => {
                        const Icon = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                              isActive(link.href)
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span>{link.label}</span>
                          </Link>
                        )
                      })}
                    </>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600" 
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/profile/edit">
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button 
                          variant="outline" 
                          asChild 
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/login">Log in</Link>
                        </Button>
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/signup">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
