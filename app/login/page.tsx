import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { card } from "@/lib/ui";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Chanakya</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Sign in to plan your day.</p>
      </div>
      <div className={card}>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
