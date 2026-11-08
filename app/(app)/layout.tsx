import Link from "next/link";
import { signOut } from "./actions";
import { Logo } from "@/components/ornaments";

const links = [
  { href: "/today", label: "Today" },
  { href: "/tasks", label: "Tasks" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="temple-band" />
      <header className="border-b border-line bg-leaf/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-2xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/today">
            <Logo />
          </Link>
          <div className="flex flex-1 gap-4 text-sm font-semibold">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink-soft hover:text-saffron">
                {l.label}
              </Link>
            ))}
          </div>
          <form action={signOut}>
            <button className="text-sm text-ink-soft hover:text-maroon">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">{children}</main>
    </div>
  );
}
