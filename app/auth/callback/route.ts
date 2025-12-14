import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // If there's an error, redirect to login with error message
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // If this is an email confirmation (signup), redirect to confirmation success page
    if (type === "signup") {
      return NextResponse.redirect(`${origin}/confirm-email`)
    }
  }

  // Default redirect to dashboard for OAuth or other flows
  return NextResponse.redirect(`${origin}/dashboard`)
}
