import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Lock, User, Mail, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"

export default async function SettingsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                <Button variant="outline" size="sm">Change Email</Button>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Profile</h3>
                <p className="text-sm text-muted-foreground mb-2">Update your personal information and academic profile</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/edit">
                    Edit Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Password</h3>
                <p className="text-sm text-muted-foreground mb-2">Change your password to keep your account secure</p>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Email Notifications</h3>
                <p className="text-sm text-muted-foreground mb-2">Manage how you receive updates about scholarships and applications</p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">More Settings Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                We're working on adding more customization options including notification preferences, 
                privacy settings, and account management features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
