import { Card, CardContent } from "@/components/ui/card"
import { SendIcon, FileTextIcon, CalendarIcon } from "lucide-react"

interface DashboardStatsProps {
  applicationsSent: number
  pendingReview: number
  interviewsScheduled: number
}

export function DashboardStats({ applicationsSent, pendingReview, interviewsScheduled }: DashboardStatsProps) {
  const stats = [
    {
      label: "Applications Sent",
      value: applicationsSent,
      icon: SendIcon,
      color: "blue",
      progress: applicationsSent > 0 ? Math.min(100, (applicationsSent / 10) * 100) : 0,
    },
    {
      label: "Pending Review",
      value: pendingReview,
      icon: FileTextIcon,
      color: "orange",
      progress: pendingReview > 0 ? Math.min(100, (pendingReview / 5) * 100) : 0,
    },
    {
      label: "Interviews Scheduled",
      value: interviewsScheduled,
      icon: CalendarIcon,
      color: "green",
      progress: interviewsScheduled > 0 ? Math.min(100, (interviewsScheduled / 3) * 100) : 0,
    },
  ]

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-950"
                      : stat.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-950"
                        : "bg-green-100 dark:bg-green-950"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      stat.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : stat.color === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-green-600 dark:text-green-400"
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stat.color === "blue"
                        ? "bg-blue-500"
                        : stat.color === "orange"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
