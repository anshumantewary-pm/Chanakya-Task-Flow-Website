"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { authenticate } from "./actions";
import { errorText, input, label, muted, primaryButton, secondaryButton } from "@/lib/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(authenticate, null);
  const confirmFailed = useSearchParams().get("error") === "confirm";

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className={label}>
        Email
        <input name="email" type="email" autoComplete="email" required className={input} />
      </label>
      <label className={label}>
        Password
        <input name="password" type="password" autoComplete="current-password" minLength={6} required className={input} />
      </label>

      {confirmFailed && !state && (
        <p className={errorText}>That confirmation link didn&apos;t work. Try signing in, or sign up again.</p>
      )}
      {state?.error && <p className={errorText}>{state.error}</p>}
      {state?.info && <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.info}</p>}

      <div className="flex gap-3">
        <button name="mode" value="signin" disabled={pending} className={`${primaryButton} flex-1`}>
          Sign in
        </button>
        <button name="mode" value="signup" disabled={pending} className={`${secondaryButton} flex-1`}>
          Create account
        </button>
      </div>
      <p className={muted}>New here? Type an email and password, then press Create account.</p>
    </form>
  );
}
