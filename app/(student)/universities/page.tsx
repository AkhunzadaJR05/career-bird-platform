import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Search, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"

export default async function UniversitiesPage() {
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
          <h1 className="text-3xl font-bold mb-2">Explore Universities</h1>
          <p className="text-muted-foreground">
            Discover top universities offering scholarships and research opportunities
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
              <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              University Explorer Coming Soon
            </h2>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're building a comprehensive database of universities worldwide. 
              You'll soon be able to explore institutions, compare programs, and discover opportunities.
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
                <strong>Tip:</strong> You can already explore universities through our scholarship listings. 
                Each scholarship shows detailed information about the hosting institution.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
