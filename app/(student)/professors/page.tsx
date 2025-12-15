import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"

export default async function ProfessorsPage() {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Professors</h1>
          <p className="text-muted-foreground">
            Connect with professors and researchers at top universities worldwide
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              Professor Directory Coming Soon
            </h2>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're building a comprehensive directory of professors and researchers. 
              You'll soon be able to search, connect, and collaborate with academic mentors worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/scholarships">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Scholarships
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> In the meantime, check out scholarship opportunities where you can connect 
                with professors through their research positions and funding opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
