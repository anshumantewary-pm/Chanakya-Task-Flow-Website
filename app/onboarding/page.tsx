import { Suspense } from "react";
import { OnboardingForm } from "./onboarding-form";
import { requireUser } from "@/lib/session";
import { Divider, Logo } from "@/components/ornaments";
import { card, muted } from "@/lib/ui";
import type { ProfileRow } from "@/lib/types";

export default function OnboardingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="temple-band" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
          <h1 className="font-display text-2xl font-semibold text-ink">Tell Chanakya about your day</h1>
          <p className="text-ink-soft">This helps it place tasks in hours that work for you.</p>
        </div>
        <Divider />
        <div className={`${card} overflow-hidden pt-7`}>
          <div className="temple-band absolute inset-x-0 top-0" />
          <Suspense fallback={<p className={muted}>Loading…</p>}>
            <ProfileLoader />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function ProfileLoader() {
  const { supabase, userId } = await requireUser();
  const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  return <OnboardingForm profile={data as ProfileRow | null} />;
}
