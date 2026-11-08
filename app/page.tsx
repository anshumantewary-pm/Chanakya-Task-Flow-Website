export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-4 py-32 px-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome to Chanakya
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Your personal planner.
        </p>
      </main>
    </div>
  );
}
