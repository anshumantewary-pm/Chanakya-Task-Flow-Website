import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function supabaseKeys() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** Supabase client for Server Components, Server Actions and Route Handlers. */
export async function createClient() {
  // Read cookies first: this marks the page as "per visitor", so the build never runs the code below.
  const cookieStore = await cookies();
  const keys = supabaseKeys();
  if (!keys) {
    throw new Error(
      "Supabase keys are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, then restart npm run dev.",
    );
  }
  return createServerClient(keys.url, keys.key, {
    cookies: {
      async getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called while rendering a page, where cookies can't be set. proxy.ts refreshes them instead.
        }
      },
    },
  });
}
