import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/types";

/** The signed-in user, or a redirect to /login. Call it in every page and action. */
export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  return { supabase, userId };
}

/** Like requireUser, but also needs the onboarding form to be filled in. */
export async function requireProfile() {
  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) redirect("/onboarding");
  const profile = { ...data, daily_hours: Number(data.daily_hours) } as ProfileRow;
  return { supabase, userId, profile };
}
