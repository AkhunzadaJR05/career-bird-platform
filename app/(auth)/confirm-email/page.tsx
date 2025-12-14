"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2Icon, MailIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2Icon className="h-10 w-10 text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Email confirmed!</h1>
            <p className="text-muted-foreground">
              Your email has been successfully verified. Your account is now active and ready to use.
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-6 space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MailIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Account activated</p>
              <p className="text-sm text-muted-foreground">You can now access all features</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={() => router.push("/dashboard")} className="w-full" size="lg">
            Go to Dashboard
          </Button>

          <p className="text-sm text-muted-foreground">
            Redirecting automatically in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  )
}

