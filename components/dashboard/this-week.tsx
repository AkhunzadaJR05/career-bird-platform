import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Deadline {
  grants?: {
    deadline: string
    title: string
    universities?: {
      name: string
    }
  }
}

interface ThisWeekProps {
  upcomingDeadlines?: Deadline[]
}

export function ThisWeek({ upcomingDeadlines = [] }: ThisWeekProps) {
  // Filter deadlines for this week
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const deadlinesThisWeek = upcomingDeadlines
    .filter((item) => {
      if (!item.grants?.deadline) return false
      const deadline = new Date(item.grants.deadline)
      return deadline >= now && deadline <= nextWeek
    })
    .slice(0, 5)
    .map((item) => {
      const deadline = new Date(item.grants!.deadline)
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        date: daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : deadline.toLocaleDateString("en-US", { weekday: "long" }),
        label: item.grants!.title,
        sublabel: item.grants!.universities?.name || "Application",
        urgent: daysUntil <= 2,
        daysUntil,
      }
    })

  // If no deadlines, show placeholder
  if (deadlinesThisWeek.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <CardTitle className="text-lg">This Week</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No upcoming deadlines this week</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
          <Button variant="link" asChild className="w-full text-primary">
            <Link href="/applications">View All Applications</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <CardTitle className="text-lg">This Week</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {deadlinesThisWeek.map((task, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-16 sm:w-20 text-center">
                <div className="text-xs font-medium text-muted-foreground uppercase">{task.date}</div>
                {task.urgent && (
                  <div className="text-xs font-medium text-red-600 dark:text-red-500 mt-1">
                    {task.daysUntil === 0 ? "Due today" : `${task.daysUntil} day${task.daysUntil !== 1 ? "s" : ""} left`}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.label}</p>
                <p className="text-xs text-muted-foreground truncate">{task.sublabel}</p>
                <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      task.urgent ? "bg-red-500" : "bg-orange-500"
                    }`}
                    style={{
                      width: `${Math.max(10, 100 - task.daysUntil * 10)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="link" asChild className="w-full text-primary">
          <Link href="/applications">View All Applications</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
