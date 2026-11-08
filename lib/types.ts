import type { Priority, RepeatRule } from "@/lib/planner";

export type UserType = "student" | "professional" | "other";
export type PlanStatus = "planned" | "done" | "postponed" | "cancelled";

export type ProfileRow = {
  user_id: string;
  user_type: UserType;
  wake_time: string; // "HH:MM:SS" from the database
  sleep_time: string;
  daily_hours: number;
  timezone: string;
};

export type TaskRow = {
  id: string;
  title: string;
  priority: Priority;
  duration_minutes: number;
  deadline: string | null;
  repeat_rule: RepeatRule;
  active: boolean;
};

export type PlanItemRow = {
  id: string;
  task_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: PlanStatus;
  edited: boolean;
  tasks: { title: string; priority: Priority; duration_minutes: number } | null;
};
