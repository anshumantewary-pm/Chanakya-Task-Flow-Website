import { Suspense } from "react";
import { OnboardingForm } from "./onboarding-form";
import { requireUser } from "@/lib/session";
import { card, muted } from "@/lib/ui";
import type { ProfileRow } from "@/lib/types";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Tell Chanakya about your day</h1>
        <p className="text-zinc-600 dark:text-zinc-400">This helps it place tasks in hours that work for you.</p>
      </div>
      <div className={card}>
        <Suspense fallback={<p className={muted}>Loading…</p>}>
          <ProfileLoader />
        </Suspense>
      </div>
    </main>
  );
}

async function ProfileLoader() {
  const { supabase, userId } = await requireUser();
  const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  return <OnboardingForm profile={data as ProfileRow | null} />;
}
