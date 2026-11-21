# Chanakya

A personal planner that decides *when* to do each task. Add one-time and repeating tasks, press **Plan my day**, and Chanakya places them in your free hours with breaks; then tick them off and track how well you follow the plan. Built for working professionals and students who have too much to do and no clear sense of where to start. Requirements: [docs/PRD.md](docs/PRD.md).

Live: https://chanakya-seven-sigma.vercel.app

## Features

- Email and password sign-up and sign-in (Supabase Auth); a login check runs before every page
- Onboarding form: user type, wake and sleep times, available hours per day
- Tasks with title, priority, estimated duration and deadline; one-time, daily or weekly repeats
- **Plan my day**: a rule-based planner that orders tasks by priority and deadline and fits them into free time with 10-minute breaks; anything that does not fit is listed as unscheduled
- Edit the plan: move or remove items, mark each one done, postponed or cancelled
- Dashboard with today's completion rate and a streak of days with a task done
- Delete-my-account option; row-level privacy rules so users only see their own data
- Optional PostHog analytics, off until a key is set

## Tech stack

- Next.js 16 (App Router, server actions), React 19, TypeScript
- Tailwind CSS 4
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) for auth and Postgres
- PostHog (optional analytics)
- Vercel hosting (Mumbai region, `bom1`)

## Getting started

Prerequisites: Node.js 20+ and a Supabase project.

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

One-time database setup: run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `POSTHOG_KEY` | PostHog project key (optional; tracking off when empty) |
| `POSTHOG_HOST` | PostHog host (optional) |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | Run ESLint |

Deploy to production with `npx vercel@latest deploy --prod`.

## Project structure

```text
app/
  login/, onboarding/          Sign-in and first-run profile form
  (app)/                       Signed-in screens
    today/                     Today's plan and tasks
    tasks/                     Task list, add and edit
    dashboard/                 Completion rate and streak
    actions.ts                 Server actions: save task, plan day, set status, ...
  auth/callback/               Supabase auth callback
components/                    Shared UI ornaments
lib/
  planner.ts                   "Plan my day" rules (pure function)
  supabase/server.ts           Supabase server client
  analytics.ts                 PostHog events
supabase/schema.sql            Tables and row-level security
docs/                          PRD and build notes (PDF)
proxy.ts                       Login check before every page
```

## Roadmap

From the PRD: v1.1 adds AI daily feedback and a chat assistant, v2 a finance tracker, v3 health tracking and notifications.

## License

[Apache License 2.0](LICENSE)

---

Anshuman Tewary · [GitHub](https://github.com/anshumantewary-pm) · [LinkedIn](https://www.linkedin.com/in/tewary-anshuman/)
