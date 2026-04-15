import { supabase } from "./supabse"

export async function getUserData() {
  /**
   * Step 1 - Check user from auth DB if they exist.
   * Step 2 - If user doesn't exist then return null so that loader function on App.tsx can redirect user to /login.
   * Step 3 - Check user from profiles table and check role of user, if role is customer then immediately signout otherwise return the appropriate data.
   * NOTE - throw error when required so GlobalError.tsx error boundary can show appropriate erros
   */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (
    authError &&
    (authError.name === "AuthSessionMissingError" ||
      authError.status === 401 ||
      authError.status === 400)
  ) {
    return null
  }

  if (authError) throw authError

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  if (profileError) throw profileError

  if (profile.role === "customer") {
    await supabase.auth.signOut()
    return null
  }

  return {
    user: user,
    role: profile.role,
  }
}
