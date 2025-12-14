import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"

export function PremiumCard() {
  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-transparent">
      <CardContent className="p-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
          <Crown className="h-4 w-4" />
          Go Premium
        </div>
        <h3 className="mb-2 text-lg font-bold">
          Get unlimited access to mentor contacts and verified scholarship reviews.
        </h3>
        <Button asChild className="mt-4 w-full bg-orange-600 hover:bg-orange-700">
          <Link href="/premium">Upgrade Now</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
