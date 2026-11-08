import Link from "next/link";
import { Suspense } from "react";
import { moveItem, planMyDay, removeItem, setStatus } from "../actions";
import { VisitTracker } from "./visit-tracker";
import { requireProfile } from "@/lib/session";
import { hhmm, localDate, prettyDate } from "@/lib/time";
import { dayMinutes, isDueOn } from "@/lib/planner";
import { card, muted, primaryButton, priorityBadge, secondaryButton, heading } from "@/lib/ui";
import type { PlanItemRow, PlanStatus, TaskRow } from "@/lib/types";

export default function TodayPage() {
  return (
    <>
      <VisitTracker />
      <Suspense fallback={<p className={muted}>Loading your day…</p>}>
        <Today />
      </Suspense>
    </>
  );
}

const statusLabel: Record<PlanStatus, string> = {
  planned: "",
  done: "Done",
  postponed: "Postponed",
  cancelled: "Cancelled",
};

async function Today() {
  const { supabase, userId, profile } = await requireProfile();
  const date = localDate(profile.timezone);

  const [itemsRes, tasksRes] = await Promise.all([
    supabase.from("plan_items").select("*, tasks(title, priority, duration_minutes)").eq("user_id", userId).eq("date", date),
    supabase.from("tasks").select("*").eq("user_id", userId).eq("active", true),
  ]);
  if (itemsRes.error) throw new Error(itemsRes.error.message);
  if (tasksRes.error) throw new Error(tasksRes.error.message);

  const items = (itemsRes.data as PlanItemRow[]).sort(
    (a, b) => dayMinutes(a.start_time, profile.wake_time) - dayMinutes(b.start_time, profile.wake_time),
  );
  const tasks = tasksRes.data as TaskRow[];
  const plannedIds = new Set(items.map((i) => i.task_id));

  // One-time tasks already finished on another day aren't "left over".
  const oneTimeIds = tasks.filter((t) => t.repeat_rule === "none" && !plannedIds.has(t.id)).map((t) => t.id);
  const doneOnce = new Set<string>();
  if (oneTimeIds.length > 0) {
    const { data } = await supabase.from("plan_items").select("task_id").eq("status", "done").in("task_id", oneTimeIds);
    data?.forEach((r) => doneOnce.add(r.task_id));
  }
  const leftOver = tasks.filter((t) => !plannedIds.has(t.id) && !doneOnce.has(t.id) && isDueOn(t, date));

  const done = items.filter((i) => i.status === "done").length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={muted}>{prettyDate(date)}</p>
          <h1 className={heading}>Today</h1>
          {items.length > 0 && (
            <p className={muted}>
              {done} of {items.length} done
            </p>
          )}
        </div>
        {tasks.length > 0 && (
          <form action={planMyDay}>
            <button className={primaryButton}>{items.length > 0 ? "Re-plan my day" : "Plan my day"}</button>
          </form>
        )}
      </div>

      {tasks.length === 0 && (
        <div className={card}>
          <p>You have no tasks yet.</p>
          <Link href="/tasks" className="mt-2 inline-block font-medium underline">
            Add your first task
          </Link>
        </div>
      )}

      {tasks.length > 0 && items.length === 0 && (
        <p className={muted}>Press &ldquo;Plan my day&rdquo; and Chanakya will fit your tasks into today&apos;s free hours.</p>
      )}

      {items.length > 0 && (
        <ol className="flex flex-col gap-2">
          {items.map((item) => (
            <PlanItem key={item.id} item={item} />
          ))}
        </ol>
      )}

      {leftOver.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold text-maroon">Not in today&apos;s plan</h2>
          <p className={muted}>
            {items.length > 0
              ? "These didn't fit in your hours today, or were added after you planned."
              : "These tasks are waiting to be planned."}
          </p>
          <ul className="flex flex-col gap-1">
            {leftOver.map((t) => (
              <li key={t.id} className="text-sm">
                {t.title} <span className={muted}>· {t.duration_minutes} min</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function PlanItem({ item }: { item: PlanItemRow }) {
  const finished = item.status !== "planned";
  return (
    <li className={`${card} flex flex-col gap-3 !p-4 ${finished ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <p className="w-28 shrink-0 font-display text-sm font-semibold text-gold tabular-nums">
          {hhmm(item.start_time)}–{hhmm(item.end_time)}
        </p>
        <p className={`flex-1 font-medium ${item.status === "done" ? "line-through" : ""}`}>
          {item.tasks?.title ?? "Deleted task"}
        </p>
        {item.tasks && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[item.tasks.priority]}`}>
            {item.tasks.priority}
          </span>
        )}
      </div>

      {finished ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{statusLabel[item.status]}</span>
          <form action={setStatus.bind(null, item.id, "planned")}>
            <button className={secondaryButton}>Undo</button>
          </form>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <form action={setStatus.bind(null, item.id, "done")}>
            <button className={primaryButton}>Done</button>
          </form>
          <form action={setStatus.bind(null, item.id, "postponed")}>
            <button className={secondaryButton}>Postpone</button>
          </form>
          <form action={setStatus.bind(null, item.id, "cancelled")}>
            <button className={secondaryButton}>Cancel</button>
          </form>
          <details className="ml-auto text-sm">
            <summary className="cursor-pointer text-ink-soft hover:text-saffron">Change</summary>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <form action={moveItem.bind(null, item.id)} className="flex items-center gap-2">
                <input
                  type="time"
                  name="start_time"
                  defaultValue={hhmm(item.start_time)}
                  required
                  className="rounded-lg border border-line bg-paper/60 px-2 py-1 text-ink"
                />
                <button className={secondaryButton}>Move</button>
              </form>
              <form action={removeItem.bind(null, item.id)}>
                <button className={secondaryButton}>Remove from today</button>
              </form>
            </div>
          </details>
        </div>
      )}
    </li>
  );
}
