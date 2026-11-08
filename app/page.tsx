import Link from "next/link";
import { Divider, Logo, Lotus, Mandala } from "@/components/ornaments";
import { card } from "@/lib/ui";

const pillars = [
  {
    numeral: "१",
    title: "Gather",
    text: "Write down every task with its priority, how long it takes and when it's due. Repeating duties are written once.",
  },
  {
    numeral: "२",
    title: "Plan",
    text: "Press one button. Chanakya places each task in your free hours, most important first, with rest between.",
  },
  {
    numeral: "३",
    title: "Reflect",
    text: "Mark tasks done, postponed or let go. See how much of your plan you kept, and keep your streak alive.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="temple-band" />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <Link href="/login" className="text-sm font-semibold text-ink-soft hover:text-saffron">
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-hidden px-4 pt-10 pb-20 text-center">
          <Mandala className="mandala-spin pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 opacity-25" />

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">The art of the well-planned day</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight font-semibold text-ink sm:text-6xl">
            Know what to do, <span className="text-maroon">and when</span>.
          </h1>
          <p className="mt-6 max-w-xl rounded-2xl bg-paper/70 px-3 text-lg leading-8 text-ink-soft backdrop-blur-[2px]">
            Chanakya is your personal planner. Give it your tasks and your hours, and it shapes them into a day you can
            actually follow.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-saffron px-7 py-3 font-semibold text-on-accent shadow-md hover:bg-saffron-deep"
            >
              Begin planning
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-gold/60 bg-leaf/70 px-7 py-3 font-semibold text-ink hover:bg-leaf"
            >
              How it works
            </a>
          </div>
        </section>

        <section id="how" className="mx-auto w-full max-w-5xl px-4 pb-20">
          <Divider className="mb-10" />
          <h2 className="mb-10 text-center font-display text-3xl font-semibold text-ink">Three steps, every day</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.title} className={`${card} overflow-hidden pt-8 text-center`}>
                <div className="temple-band absolute inset-x-0 top-0" />
                <p className="font-display text-4xl text-gold">{p.numeral}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-maroon">{p.title}</h3>
                <p className="mt-3 leading-7 text-ink-soft">{p.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-ink-soft">
        <Lotus className="mx-auto mb-2 h-5 w-8" />
        Plan with purpose. Act with focus.
      </footer>
    </div>
  );
}
