# PRD: Chanakya v1

**Author:** Anshuman Tewary
**Date:** 9 November 2026
**Status:** Approved for build
**Version:** v1 (first shippable slice of docs/VISION.md)

## 1. Overview
Chanakya is a personal planner that helps a person decide *when* to do each task. v1 lets users add one-time and repeating tasks, press "Plan my day", and tick tasks off. The long-term vision (AI manager for productivity, finance and health) is in docs/VISION.md.

## 2. Problem
People have too much to do and rarely know when to do it. When free time appears they feel overwhelmed and don't know where to start. Today they use scattered tools: calendars, notes apps, spreadsheets, WhatsApp messages.

## 3. Target users
- Primary: the author, a working professional at a 30-person startup.
- Secondary: students and other working professionals.

## 4. Goals and non-goals
Goals:
1. A user can capture every task with a priority, duration and deadline.
2. A user gets a realistic plan for today in under 10 seconds.
3. A user can see whether they followed their plan.

Non-goals for v1: AI features, finance tracking, health tracking, push notifications, calendar integrations, teams.

## 5. User stories
1. As a new user, I answer a short form (user type, wake and sleep times, available hours) so the planner knows my day.
2. As a user, I add a one-time task with title, priority, estimated duration and deadline.
3. As a user, I add a repeating task (daily or weekly) so I don't re-enter it.
4. As a user, I press "Plan my day" and get tasks placed in my free hours, with breaks.
5. As a user, I edit the plan if I disagree with it.
6. As a user, I mark each task done, postponed or cancelled.
7. As a user, I see today's completion rate and a 7-day streak.
8. As a user, I sign in and only ever see my own data.

## 6. Scope
MVP: login, onboarding form, task CRUD, repeat rules (daily/weekly), rule-based planner, status updates, small dashboard.
Nice-to-have: daily wisdom card, dark mode.
Out of scope (v1.1+): AI daily feedback and chat assistant (v1.1), finance tracker (v2), health tracker and notifications (v3).

## 7. Key screens and flow
Login -> Onboarding form -> Today (plan + tasks) -> Add/Edit task -> Dashboard (completion rate, streak).

## 8. Data
- profiles: user_id, user_type, wake_time, sleep_time, daily_hours
- tasks: id, user_id, title, priority, duration_minutes, deadline, repeat_rule (none/daily/weekly), active
- plan_items: id, user_id, task_id, date, start_time, end_time, status (planned/done/postponed/cancelled)
Repeating tasks store one task plus a rule. Each day's plan_items are generated when the user plans that day.

## 9. Success metrics
North Star: weekly percentage of planned tasks marked done.
Supporting: onboarding completion, "Plan my day" uses per week, 7-day return rate.
Measured with PostHog events.

## 10. Risks and open questions
- Rule-based plans may feel unrealistic: let users edit and record how often they do.
- Users may stop entering tasks: keep adding a task under 15 seconds.
- Open: whether to show the wisdom card in v1.

## 11. Security and privacy
Supabase Auth for login. Row Level Security on every table so users read and write only their own rows. No secrets in code (.env.local and Vercel environment variables). Users can delete their account data.

## 12. Launch plan and next steps
Ship Sat 14 Nov on Vercel. Give to 5 testers and collect feedback. Next: AI daily feedback (v1.1) once the AI-call skills from Bhasha AI are done.
