import { supabase } from "./supabase";

export interface WaitlistEntry {
  email: string;
  first_name?: string;
  age_range?: string;
  relationship_goal?: string;
  frustrations?: string;
  source?: "hero" | "form";
}

export async function addToWaitlist(entry: WaitlistEntry): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    };
  }

  const { error } = await supabase.from("waitlist").insert({
    email: entry.email.trim().toLowerCase(),
    first_name: entry.first_name?.trim() || null,
    age_range: entry.age_range || null,
    relationship_goal: entry.relationship_goal || null,
    frustrations: entry.frustrations?.trim() || null,
    source: entry.source || "form"
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
