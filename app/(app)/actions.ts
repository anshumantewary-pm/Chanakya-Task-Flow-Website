"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, requireUser } from "@/lib/session";
import { localDate, localTime } from "@/lib/time";
import { planDay, toHHMM, toMinutes, type Priority, type RepeatRule } from "@/lib/planner";
import type { PlanItemRow, PlanStatus, TaskRow } from "@/lib/types";

// ---------- Tasks ----------

export type TaskState = { error?: string; ok?: boolean } | null;

function readTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority")) as Priority;
  const duration = Number(formData.get("duration_minutes"));
  const repeat = String(formData.get("repeat_rule")) as RepeatRule;
  const deadline = String(formData.get("deadline") ?? "") || null;

  if (!title) return { error: "Give the task a name." };
  if (!["high", "medium", "low"].includes(priority)) return { error: "Choose a priority." };
  if (!Number.isInteger(duration) || duration < 5 || duration > 720) {
    return { error: "Duration must be between 5 and 720 minutes." };
  }
  if (!["none", "daily", "weekly"].includes(repeat)) return { error: "Choose how often it repeats." };
  if (repeat === "weekly" && !deadline) return { error: "Weekly tasks need a date: they repeat on that weekday." };

  return {
    task: { title, priority, duration_minutes: duration, repeat_rule: repeat, deadline: repeat === "daily" ? null : deadline },
  };
}

export async function addTask(_prev: TaskState, formData: FormData): Promise<TaskState> {
  const { supabase } = await requireUser();
  const parsed = readTask(formData);
  if (!parsed.task) return { error: parsed.error };
  const { error } = await supabase.from("tasks").insert(parsed.task);
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function updateTask(id: string, _prev: TaskState, formData: FormData): Promise<TaskState> {
  const { supabase, userId } = await requireUser();
  const parsed = readTask(formData);
  if (!parsed.task) return { error: parsed.error };
  const { error } = await supabase.from("tasks").update(parsed.task).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  redirect("/tasks");
}

/** Hides the task but keeps its history, so the dashboard stays accurate. */
export async function deleteTask(id: string) {
  const { supabase, userId } = await requireUser();
  await supabase.from("tasks").update({ active: false }).eq("id", id).eq("user_id", userId);
  await supabase.from("plan_items").delete().eq("task_id", id).eq("status", "planned");
  refresh();
}

// ---------- Plan my day ----------

export async function planMyDay() {
  const { supabase, userId, profile } = await requireProfile();
  const date = localDate(profile.timezone);
  const now = localTime(profile.timezone);

  const [tasksRes, todayRes] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", userId).eq("active", true),
    supabase.from("plan_items").select("*").eq("user_id", userId).eq("date", date),
  ]);
  if (tasksRes.error) throw new Error(tasksRes.error.message);
  if (todayRes.error) throw new Error(todayRes.error.message);
  const tasks = tasksRes.data as TaskRow[];
  const todays = todayRes.data as Omit<PlanItemRow, "tasks">[];

  // Keep what the user already acted on or moved by hand; re-plan the rest.
  const kept = todays.filter((i) => i.status !== "planned" || i.edited);
  const keptTaskIds = new Set(kept.map((i) => i.task_id));
  const busy = kept.filter((i) => i.status === "planned" || i.status === "done");
  const usedMinutes = busy.reduce((sum, i) => {
    const length = toMinutes(i.end_time) - toMinutes(i.start_time);
    return sum + (length < 0 ? length + 1440 : length);
  }, 0);

  // One-time tasks finished on an earlier day don't come back.
  const oneTimeIds = tasks.filter((t) => t.repeat_rule === "none").map((t) => t.id);
  const doneOnce = new Set<string>();
  if (oneTimeIds.length > 0) {
    const { data } = await supabase.from("plan_items").select("task_id").eq("status", "done").in("task_id", oneTimeIds);
    data?.forEach((r) => doneOnce.add(r.task_id));
  }
  const candidates = tasks.filter((t) => !keptTaskIds.has(t.id) && !doneOnce.has(t.id));

  const plan = planDay(profile, candidates, date, { nowHHMM: now, busy, usedMinutes });

  const del = await supabase
    .from("plan_items")
    .delete()
    .eq("user_id", userId)
    .eq("date", date)
    .eq("status", "planned")
    .eq("edited", false);
  if (del.error) throw new Error(del.error.message);

  if (plan.items.length > 0) {
    const { error } = await supabase.from("plan_items").insert(plan.items.map((i) => ({ ...i, date })));
    if (error) throw new Error(error.message);
  }
  refresh();
}

// ---------- Editing today's plan ----------

export async function setStatus(id: string, status: PlanStatus) {
  const { supabase, userId } = await requireUser();
  await supabase.from("plan_items").update({ status }).eq("id", id).eq("user_id", userId);
  refresh();
}

export async function moveItem(id: string, formData: FormData) {
  const { supabase, userId } = await requireUser();
  const start = String(formData.get("start_time") ?? "");
  if (!/^\d{2}:\d{2}$/.test(start)) return;
  const { data: item } = await supabase.from("plan_items").select("start_time, end_time").eq("id", id).maybeSingle();
  if (!item) return;
  let length = toMinutes(item.end_time) - toMinutes(item.start_time);
  if (length < 0) length += 1440;
  await supabase
    .from("plan_items")
    .update({ start_time: start, end_time: toHHMM(toMinutes(start) + length), edited: true })
    .eq("id", id)
    .eq("user_id", userId);
  refresh();
}

export async function removeItem(id: string) {
  const { supabase, userId } = await requireUser();
  await supabase.from("plan_items").delete().eq("id", id).eq("user_id", userId);
  refresh();
}

// ---------- Account ----------

export async function signOut() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteMyAccount(formData: FormData) {
  if (formData.get("confirm") !== "yes") return;
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw new Error(error.message);
  await supabase.auth.signOut();
  redirect("/login");
}
