# LifeSpring Admin — Developer Blueprint

This directory contains developer documentation for the **LifeSpring Admin** panel. Read these docs before touching the codebase to avoid repeating past bugs and to follow established patterns.

---

## Documents in This Blueprint

| File | What it covers |
|------|---------------|
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Full directory map, route groups, folder conventions |
| [AUTH_FLOW.md](./AUTH_FLOW.md) | Login, token storage, refresh, protected routes |
| [API_PATTERNS.md](./API_PATTERNS.md) | How to call the backend, server actions, headers |
| [FEATURE_MODULES.md](./FEATURE_MODULES.md) | Every feature module — routes, components, actions |
| [COMPONENTS.md](./COMPONENTS.md) | Shared/reusable components catalog |
| [CONVENTIONS.md](./CONVENTIONS.md) | Naming, file structure, coding rules |
| [TIMEZONE_HANDLING.md](./TIMEZONE_HANDLING.md) | **Critical** — how datetimes are stored and displayed |
| [RESCHEDULE_APPOINTMENT.md](./RESCHEDULE_APPOINTMENT.md) | Deep-dive on the reschedule feature (good reference) |

---

## Tech Stack at a Glance

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI Library | Ant Design (antd) + Tailwind CSS |
| State | React Context API (no Redux/Zustand) |
| Forms | React Hook Form + `useFormState` |
| HTTP | Custom `ApiClient` (fetch wrapper) |
| Auth | JWT via cookies (`next-client-cookies`) |
| Charts | Apache ECharts |
| Date | moment.js + day.js + date-fns |

---

## Quick Start for a New Developer

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# Fill in API_BASE_URL, ADMIN_PUBLIC_URL

# 3. Start dev server (runs on port 3008)
npm run dev
```

Default login goes to `/login`. On success it redirects to `/dashboard`.

---

## Backend Counterpart

The backend codebase lives at `../lifespring-backend` (NestJS + TypeORM + MySQL).  
API base URL is configured via `API_BASE_URL` in `.env`.  
All API calls go through `src/api/ApiClient.ts` — **never call `fetch()` directly**.

---

## Key Rules (Do Not Skip)

1. **All API calls must go through `ApiClient`** — it handles auth tokens automatically.
2. **All data-fetching functions must have `"use server"`** at the top.
3. **Never use `setHours()` to build schedule datetimes** — use `Date.UTC()`. See [TIMEZONE_HANDLING.md](./TIMEZONE_HANDLING.md).
4. **Check `statusChangelog` for audit info** — the backend tracks every change.
5. **Use existing shared components** from `src/app/components/` before creating new ones.
