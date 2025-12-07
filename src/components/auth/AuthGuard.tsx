"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn("Supabase not configured. Redirecting to signup.");
          router.push("/auth/signup");
          return;
        }

        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          // No user found, redirect to signup
          router.push("/auth/signup");
          return;
        }

        // User is authenticated
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, redirect to signup for safety
        router.push("/auth/signup");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Loading...</p>
          <p className="text-gray-400 text-sm mt-2">Verifying authentication</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect, so return nothing
  }

  return <>{children}</>;
}

