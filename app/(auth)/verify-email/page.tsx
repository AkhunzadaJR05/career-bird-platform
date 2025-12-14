"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailIcon, ArrowLeftIcon } from "lucide-react"
import { useState, useEffect } from "react"

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("")
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    // Get email from URL params or localStorage
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const handleResendEmail = async () => {
    if (!email) return

    setResending(true)
    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResent(true)
        setTimeout(() => setResent(false), 5000)
      } else {
        console.error("Error resending email:", data.error)
      }
    } catch (error) {
      console.error("Error resending email:", error)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <MailIcon className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
            <p className="text-muted-foreground">
              We've sent a confirmation link to <strong className="text-foreground">{email || "your email"}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-6 space-y-4 text-left">
          <h3 className="font-semibold text-sm">Next steps:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Open your email inbox</li>
            <li>Look for an email from The Career Bird</li>
            <li>Click the confirmation link in the email</li>
            <li>You'll be redirected to your dashboard</li>
          </ol>
        </div>

        <div className="space-y-4">
          {email && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={resending || resent}
                className="w-full"
              >
                {resending ? "Sending..." : resent ? "Email sent! Check your inbox" : "Resend confirmation email"}
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          The confirmation link will expire in 24 hours. If you need help,{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

