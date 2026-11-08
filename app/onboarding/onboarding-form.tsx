"use client";

import { useActionState } from "react";
import { saveProfile } from "./actions";
import { errorText, input, label, primaryButton } from "@/lib/ui";
import type { ProfileRow } from "@/lib/types";

export function OnboardingForm({ profile }: { profile: ProfileRow | null }) {
  const [state, action, pending] = useActionState(saveProfile, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className={label}>
        I am a
        <select name="user_type" defaultValue={profile?.user_type ?? "professional"} className={input}>
          <option value="professional">Working professional</option>
          <option value="student">Student</option>
          <option value="other">Other</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className={label}>
          I wake up at
          <input name="wake_time" type="time" required defaultValue={profile?.wake_time.slice(0, 5) ?? "07:00"} className={input} />
        </label>
        <label className={label}>
          I go to sleep at
          <input name="sleep_time" type="time" required defaultValue={profile?.sleep_time.slice(0, 5) ?? "23:00"} className={input} />
        </label>
      </div>
      <label className={label}>
        Hours I can give to tasks each day
        <input
          name="daily_hours"
          type="number"
          min={0.5}
          max={24}
          step={0.5}
          required
          defaultValue={profile?.daily_hours ?? 4}
          className={input}
        />
      </label>
      {/* Filled in by the browser so "today" matches where you are. */}
      <input
        type="hidden"
        name="timezone"
        defaultValue={profile?.timezone ?? "UTC"}
        ref={(el) => {
          if (el) el.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }}
      />

      {state?.error && <p className={errorText}>{state.error}</p>}
      <button disabled={pending} className={primaryButton}>
        {pending ? "Saving…" : "Save and continue"}
      </button>
    </form>
  );
}
