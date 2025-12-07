import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware is running for path:", request.nextUrl.pathname);
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, block dashboard access
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    if (isDashboard) {
      return NextResponse.redirect(new URL("/auth/signup", request.url));
    }
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Get the User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Define Protected Routes
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard/admin");

  // 3. LOGIC: Kick out if accessing Dashboard without User
  if (isDashboard && !user) {
    return NextResponse.redirect(new URL("/auth/signup", request.url));
  }

  // 4. LOGIC: Protect Admin Route - Only allow users with role === 'admin'
  if (isAdminRoute && user) {
    try {
      // Fetch user's profile to check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        // Not an admin, redirect to student dashboard
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }
    } catch (error) {
      // Error fetching profile, redirect to student dashboard
      console.error("Error checking admin role:", error);
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }
  }

  // 5. LOGIC: Kick to Dashboard if already logged in and hitting Sign Up
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

