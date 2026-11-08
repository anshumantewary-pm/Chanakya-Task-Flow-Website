"use client";

import { useActionState, useState } from "react";
import type { TaskState } from "../actions";
import { errorText, input, label, primaryButton } from "@/lib/ui";
import type { TaskRow } from "@/lib/types";

type Props = {
  action: (prev: TaskState, formData: FormData) => Promise<TaskState>;
  task?: TaskRow;
  submitLabel: string;
};

export function TaskForm({ action, task, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const [repeat, setRepeat] = useState(task?.repeat_rule ?? "none");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className={label}>
        Task
        <input name="title" required autoFocus={!task} defaultValue={task?.title} placeholder="e.g. Finish weekly report" className={input} />
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className={label}>
          Priority
          <select name="priority" defaultValue={task?.priority ?? "medium"} className={input}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label className={label}>
          Minutes
          <input
            name="duration_minutes"
            type="number"
            min={5}
            max={720}
            step={5}
            required
            defaultValue={task?.duration_minutes ?? 30}
            className={input}
          />
        </label>
        <label className={label}>
          Repeats
          <select
            name="repeat_rule"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as typeof repeat)}
            className={input}
          >
            <option value="none">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
        {repeat !== "daily" && (
          <label className={label}>
            {repeat === "weekly" ? "Repeats on" : "Deadline"}
            <input name="deadline" type="date" required={repeat === "weekly"} defaultValue={task?.deadline ?? ""} className={input} />
          </label>
        )}
      </div>
      {state?.error && <p className={errorText}>{state.error}</p>}
      <button disabled={pending} className={`${primaryButton} self-start`}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
