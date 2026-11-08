"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { isValidTimeZone } from "@/lib/time";
import { toMinutes } from "@/lib/planner";

export type ProfileState = { error?: string } | null;

const TIME = /^\d{2}:\d{2}$/;

export async function saveProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, userId } = await requireUser();

  const userType = String(formData.get("user_type"));
  const wake = String(formData.get("wake_time"));
  const sleep = String(formData.get("sleep_time"));
  const hours = Number(formData.get("daily_hours"));
  const tz = String(formData.get("timezone") ?? "");

  if (!["student", "professional", "other"].includes(userType)) return { error: "Choose what describes you." };
  if (!TIME.test(wake) || !TIME.test(sleep)) return { error: "Enter your wake-up and sleep times." };
  if (wake === sleep) return { error: "Wake-up and sleep times can't be the same." };

  let awake = toMinutes(sleep) - toMinutes(wake);
  if (awake <= 0) awake += 1440;
  if (!(hours > 0) || hours * 60 > awake) {
    return { error: `Available hours must be more than 0 and at most ${Math.floor(awake / 60)} (your waking hours).` };
  }

  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    user_type: userType,
    wake_time: wake,
    sleep_time: sleep,
    daily_hours: hours,
    timezone: isValidTimeZone(tz) ? tz : "UTC",
  });
  if (error) return { error: error.message };

  redirect("/today");
}
