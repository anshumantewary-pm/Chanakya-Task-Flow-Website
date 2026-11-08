import { after } from "next/server";

// PostHog events (PRD section 9), sent from the server so ad blockers can't drop them.
// Does nothing until POSTHOG_KEY is set. Only the user's id is sent: never emails or task names.

export type EventName =
  | "signed up"
  | "signed in"
  | "onboarding completed"
  | "settings updated"
  | "task added"
  | "task edited"
  | "task deleted"
  | "plan my day pressed"
  | "task done"
  | "task postponed"
  | "task cancelled"
  | "task undone"
  | "plan item moved"
  | "plan item removed"
  | "app opened"
  | "account deleted";

export function track(userId: string, event: EventName, properties: Record<string, unknown> = {}) {
  const key = process.env.POSTHOG_KEY;
  if (!key) return;
  const host = (process.env.POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");

  // Runs after the response is sent, so tracking never slows the app down.
  after(async () => {
    try {
      await fetch(`${host}/i/v0/e/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          event,
          distinct_id: userId,
          properties: { ...properties, $process_person_profile: true },
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Analytics must never break the app.
    }
  });
}
