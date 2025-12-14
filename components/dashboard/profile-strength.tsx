import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface ProfileStrengthProps {
  profile?: any
}

export function ProfileStrength({ profile }: ProfileStrengthProps) {
  // Calculate profile completion
  const calculateCompletion = () => {
    if (!profile) return 0
    let completed = 0
    const totalFields = 7

    if (profile.first_name || profile.full_name) completed++
    if (profile.last_name || profile.full_name) completed++
    if (profile.bio) completed++
    if (profile.current_degree) completed++
    if (profile.field_of_study) completed++
    if (profile.gpa) completed++
    if (profile.research_interests && profile.research_interests.length > 0) completed++

    return Math.round((completed / totalFields) * 100)
  }

  const completion = calculateCompletion()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Strength</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-2xl">{completion}%</span>
            <span className="text-muted-foreground">Complete</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>

        {completion < 100 && (
          <p className="text-sm text-muted-foreground">
            Adding your <span className="font-semibold text-foreground">GRE Score</span> will increase your match
            accuracy by 15%.
          </p>
        )}

        <Button asChild className="w-full" variant={completion < 80 ? "default" : "outline"}>
          <Link href="/profile/edit">Complete Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
