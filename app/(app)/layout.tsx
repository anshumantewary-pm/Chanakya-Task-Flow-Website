import Link from "next/link";
import { signOut } from "./actions";

const links = [
  { href: "/today", label: "Today" },
  { href: "/tasks", label: "Tasks" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <nav className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-3">
          <Link href="/today" className="font-semibold">
            Chanakya
          </Link>
          <div className="flex flex-1 gap-3 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
          <form action={signOut}>
            <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">{children}</main>
    </div>
  );
}
