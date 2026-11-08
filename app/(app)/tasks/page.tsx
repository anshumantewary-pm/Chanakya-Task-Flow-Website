import Link from "next/link";
import { Suspense } from "react";
import { addTask, deleteTask } from "../actions";
import { TaskForm } from "./task-form";
import { requireUser } from "@/lib/session";
import { prettyDate, weekdayName } from "@/lib/time";
import { card, muted, priorityBadge, secondaryButton, heading } from "@/lib/ui";
import type { TaskRow } from "@/lib/types";

export default function TasksPage() {
  return (
    <>
      <h1 className={heading}>Tasks</h1>
      <section className={card}>
        <h2 className="mb-4 font-display text-lg font-semibold text-maroon">Add a task</h2>
        <TaskForm action={addTask} submitLabel="Add task" />
      </section>
      <Suspense fallback={<p className={muted}>Loading your tasks…</p>}>
        <TaskList />
      </Suspense>
    </>
  );
}

function repeatText(t: TaskRow) {
  if (t.repeat_rule === "daily") return "Every day";
  if (t.repeat_rule === "weekly" && t.deadline) return `Every ${weekdayName(t.deadline)}`;
  return t.deadline ? `Due ${prettyDate(t.deadline, "short")}` : "No deadline";
}

async function TaskList() {
  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const tasks = data as TaskRow[];

  if (tasks.length === 0) {
    return <p className={muted}>No tasks yet. Add your first one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((t) => (
        <li key={t.id} className={`${card} flex items-center gap-3 !p-4`}>
          <div className="flex-1">
            <p className="font-medium">{t.title}</p>
            <p className={muted}>
              {t.duration_minutes} min · {repeatText(t)}
            </p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[t.priority]}`}>{t.priority}</span>
          <Link href={`/tasks/${t.id}`} className={secondaryButton}>
            Edit
          </Link>
          <form action={deleteTask.bind(null, t.id)}>
            <button className={secondaryButton}>Delete</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
