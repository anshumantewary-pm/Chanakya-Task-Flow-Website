// Rule-based "Plan my day" (PRD user story 4).
// Pure function: no database or browser code, so it is easy to test.

export type Priority = "high" | "medium" | "low";
export type RepeatRule = "none" | "daily" | "weekly";

export type Profile = {
  wake_time: string; // "HH:MM"
  sleep_time: string; // "HH:MM" (may be after midnight, e.g. "01:00")
  daily_hours: number; // max hours of task time per day
};

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  duration_minutes: number;
  deadline: string | null; // "YYYY-MM-DD"
  repeat_rule: RepeatRule;
  active: boolean;
};

export type PlannedItem = {
  task_id: string;
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
};

export type Plan = {
  items: PlannedItem[];
  unscheduled: Task[]; // wanted today but did not fit
};

export const BREAK_MINUTES = 10;
const SLOT_MINUTES = 5;
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/**
 * Should this task appear on `date`?
 * - one-time: until it is done (caller passes only unfinished ones), overdue included
 * - daily: every day
 * - weekly: on the same weekday as its deadline (the add-task form will require one)
 */
export function isDueOn(task: Task, date: string): boolean {
  if (!task.active) return false;
  if (task.repeat_rule === "daily") return true;
  if (task.repeat_rule === "weekly") {
    return task.deadline !== null && weekday(task.deadline) === weekday(date);
  }
  return true;
}

// Only one-time tasks have a real deadline; for weekly tasks the date just picks the weekday.
function realDeadline(task: Task): string | null {
  return task.repeat_rule === "none" ? task.deadline : null;
}

function compareTasks(a: Task, b: Task, date: string): number {
  const deadlineA = realDeadline(a);
  const deadlineB = realDeadline(b);
  // 1. Due today or overdue first
  const urgentA = deadlineA !== null && deadlineA <= date ? 0 : 1;
  const urgentB = deadlineB !== null && deadlineB <= date ? 0 : 1;
  if (urgentA !== urgentB) return urgentA - urgentB;
  // 2. Higher priority first
  if (a.priority !== b.priority) return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  // 3. Earlier deadline first (no deadline last)
  if (deadlineA !== deadlineB) {
    if (deadlineA === null) return 1;
    if (deadlineB === null) return -1;
    return deadlineA < deadlineB ? -1 : 1;
  }
  // 4. Shorter first, to build momentum
  return a.duration_minutes - b.duration_minutes;
}

export type PlanOptions = {
  nowHHMM?: string; // start no earlier than this
  busy?: { start_time: string; end_time: string }[]; // time already taken (kept plan items)
  usedMinutes?: number; // task minutes already spent today (counts against daily_hours)
};

/** Minutes since the user's wake-up day began, so times after midnight sort after evening times. */
export function dayMinutes(hhmm: string, wakeHHMM: string): number {
  const m = toMinutes(hhmm);
  return m < toMinutes(wakeHHMM) ? m + 1440 : m;
}

/**
 * Places tasks one after another from wake time (or from `nowHHMM` if later),
 * with a short break after each, until sleep time or the daily-hours budget runs out.
 * A task that does not fit is skipped and smaller tasks after it may still be placed.
 */
export function planDay(profile: Profile, tasks: Task[], date: string, options: PlanOptions = {}): Plan {
  const wake = toMinutes(profile.wake_time);
  let sleep = toMinutes(profile.sleep_time);
  if (sleep <= wake) sleep += 1440; // sleeping after midnight

  let cursor = wake;
  if (options.nowHHMM !== undefined) {
    const now = dayMinutes(options.nowHHMM, profile.wake_time);
    if (now < sleep) {
      cursor = Math.max(cursor, Math.ceil(now / SLOT_MINUTES) * SLOT_MINUTES);
    } else if (toMinutes(options.nowHHMM) >= wake) {
      cursor = sleep; // already past bedtime today: nothing more fits
    } // otherwise it's the small hours before waking: start at wake time
  }

  const busy = (options.busy ?? []).map((b) => {
    const start = dayMinutes(b.start_time, profile.wake_time);
    let end = dayMinutes(b.end_time, profile.wake_time);
    if (end < start) end += 1440;
    return { start, end: end + BREAK_MINUTES };
  });

  let budget = Math.round(profile.daily_hours * 60) - (options.usedMinutes ?? 0);
  const items: PlannedItem[] = [];
  const unscheduled: Task[] = [];

  const due = tasks.filter((t) => isDueOn(t, date)).sort((a, b) => compareTasks(a, b, date));

  for (const task of due) {
    // Earliest start at or after the cursor that doesn't overlap busy time.
    let start = cursor;
    for (let moved = true; moved; ) {
      moved = false;
      for (const b of busy) {
        if (start < b.end && start + task.duration_minutes > b.start) {
          start = b.end;
          moved = true;
        }
      }
    }
    const end = start + task.duration_minutes;
    if (task.duration_minutes > budget || end > sleep) {
      unscheduled.push(task);
      continue;
    }
    items.push({ task_id: task.id, start_time: toHHMM(start), end_time: toHHMM(end) });
    budget -= task.duration_minutes;
    cursor = end + BREAK_MINUTES;
  }

  return { items, unscheduled };
}
