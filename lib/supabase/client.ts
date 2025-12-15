import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: {
          getItem: (key) => {
            try {
              return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
            } catch {
              return null
            }
          },
          setItem: (key, value) => {
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value)
              }
            } catch {
              // Silently fail if storage is not available
            }
          },
          removeItem: (key) => {
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key)
              }
            } catch {
              // Silently fail if storage is not available
            }
          },
        },
      },
    }
  )

  return supabaseClient
}
