import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { updateTask } from "../../actions";
import { TaskForm } from "../task-form";
import { requireUser } from "@/lib/session";
import { card, muted, heading } from "@/lib/ui";
import type { TaskRow } from "@/lib/types";

export default function EditTaskPage({ params }: PageProps<"/tasks/[id]">) {
  return (
    <>
      <Link href="/tasks" className={muted}>
        ← Back to tasks
      </Link>
      <h1 className={heading}>Edit task</h1>
      <section className={card}>
        <Suspense fallback={<p className={muted}>Loading…</p>}>
          <EditTask params={params} />
        </Suspense>
      </section>
    </>
  );
}

async function EditTask({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, userId } = await requireUser();
  const { data } = await supabase.from("tasks").select("*").eq("id", id).eq("user_id", userId).eq("active", true).maybeSingle();
  if (!data) notFound();
  return <TaskForm action={updateTask.bind(null, id)} task={data as TaskRow} submitLabel="Save changes" />;
}
