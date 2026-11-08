import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Logo, Mandala } from "@/components/ornaments";
import { card } from "@/lib/ui";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="temple-band" />
      <main className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 overflow-visible px-4 py-16">
        <Mandala className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-20" />
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
          <p className="text-ink-soft">Sign in to plan your day.</p>
        </div>
        <div className={`${card} overflow-hidden pt-7`}>
          <div className="temple-band absolute inset-x-0 top-0" />
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
