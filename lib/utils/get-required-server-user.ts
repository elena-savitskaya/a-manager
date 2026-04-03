"use server";

/**
 * Common helper to get the authenticated user in server-side context.
 * Useful for server actions and routes.
 */
export async function getRequiredServerUser() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return { user, supabase };
}
