import Link from "next/link";
import { Suspense } from "react";
import { deleteMyAccount } from "../actions";
import { requireProfile } from "@/lib/session";
import { addDays, localDate, prettyDate } from "@/lib/time";
import { card, muted, secondaryButton } from "@/lib/ui";

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p className={muted}>Loading your progress…</p>}>
        <Stats />
      </Suspense>
      <Settings />
    </>
  );
}

function percent(done: number, total: number) {
  return total === 0 ? "–" : `${Math.round((done / total) * 100)}%`;
}

async function Stats() {
  const { supabase, userId, profile } = await requireProfile();
  const today = localDate(profile.timezone);
  const since = addDays(today, -59); // enough history for a long streak

  const { data, error } = await supabase
    .from("plan_items")
    .select("date, status")
    .eq("user_id", userId)
    .gte("date", since)
    .lte("date", today);
  if (error) throw new Error(error.message);

  const byDate = new Map<string, { done: number; total: number }>();
  for (const row of data as { date: string; status: string }[]) {
    const day = byDate.get(row.date) ?? { done: 0, total: 0 };
    day.total += 1;
    if (row.status === "done") day.done += 1;
    byDate.set(row.date, day);
  }

  const todayStats = byDate.get(today) ?? { done: 0, total: 0 };
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const weekDone = week.reduce((s, d) => s + (byDate.get(d)?.done ?? 0), 0);
  const weekTotal = week.reduce((s, d) => s + (byDate.get(d)?.total ?? 0), 0);

  // Streak: days in a row with at least one task done. Today only counts once something is done.
  let streak = 0;
  let day = (byDate.get(today)?.done ?? 0) > 0 ? today : addDays(today, -1);
  while ((byDate.get(day)?.done ?? 0) > 0) {
    streak += 1;
    day = addDays(day, -1);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Done today" value={percent(todayStats.done, todayStats.total)} note={`${todayStats.done} of ${todayStats.total} tasks`} />
        <Stat label="Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} note="days in a row with a task done" />
        <Stat label="Last 7 days" value={percent(weekDone, weekTotal)} note={`${weekDone} of ${weekTotal} planned tasks done`} />
      </div>

      <section className={card}>
        <h2 className="mb-4 font-semibold">Your last 7 days</h2>
        <ul className="flex flex-col gap-2">
          {week.map((d) => {
            const s = byDate.get(d) ?? { done: 0, total: 0 };
            const width = s.total === 0 ? 0 : (s.done / s.total) * 100;
            return (
              <li key={d} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0">{prettyDate(d, "short")}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${width}%` }} />
                </span>
                <span className="w-12 shrink-0 text-right text-zinc-500">
                  {s.done}/{s.total}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className={card}>
      <p className={muted}>{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      <p className={muted}>{note}</p>
    </div>
  );
}

function Settings() {
  return (
    <section className={`${card} flex flex-col gap-4`}>
      <h2 className="font-semibold">Settings</h2>
      <Link href="/onboarding" className={`${secondaryButton} self-start`}>
        Change wake, sleep and available hours
      </Link>
      <form action={deleteMyAccount} className="flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <p className="text-sm font-medium">Delete my account</p>
        <p className={muted}>This permanently removes your account, tasks and plans. It can&apos;t be undone.</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="confirm" value="yes" required /> I understand, delete everything
        </label>
        <button className="self-start rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Delete my account
        </button>
      </form>
    </section>
  );
}
