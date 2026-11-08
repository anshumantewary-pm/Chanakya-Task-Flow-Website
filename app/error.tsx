"use client";

export default function ErrorPage({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{error.message}</p>
      <button onClick={retry}className="self-start rounded-lg border border-zinc-300 px-3 py-1.5 text-sm">
        Try again
      </button>
    </main>
  );
}
