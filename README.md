# Chanakya

A personal planner that decides *when* to do each task. Add one-time and repeating tasks, press **Plan my day**, and tick tasks off. Requirements: [docs/PRD.md](docs/PRD.md).

Live: https://chanakya-seven-sigma.vercel.app

## Run it on your computer

```powershell
npm install
npm run dev
```

Then open http://localhost:3000. The app needs the keys in `.env.local` (see `.env.example`).

## Publish changes to the live site

```powershell
npx vercel@latest deploy --prod
```

## How it's built

| Part | Where |
|---|---|
| Pages | `app/`: `login`, `onboarding`, and the signed-in screens in `app/(app)/` (`today`, `tasks`, `dashboard`) |
| Button actions (save task, plan day, mark done…) | `app/(app)/actions.ts` |
| "Plan my day" rules | `lib/planner.ts` |
| Database tables and privacy rules | `supabase/schema.sql` (run in Supabase SQL Editor) |
| Login check before every page | `proxy.ts` |
| Analytics (PostHog) | `lib/analytics.ts`: off until `POSTHOG_KEY` is set |

Services: [Supabase](https://supabase.com) (login and database, Mumbai), [Vercel](https://vercel.com) (hosting, Mumbai), [PostHog](https://posthog.com) (analytics).
