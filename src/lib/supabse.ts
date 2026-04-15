import { createClient } from "@supabase/supabase-js"

// Added storageKey because application was using jwt of some other supabase application running in the browser
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storageKey: "greenmist-auth-token",
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
