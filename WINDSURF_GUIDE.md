# BetterForms — Windsurf / Cascade Guide

## Project Overview

**BetterForms** is an AI-powered CV/Resume matching micro SaaS.
Recruiters upload PDF CVs + a job description; the AI ranks candidates with scores and explanations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui v4 (Base UI primitives) |
| Auth + DB | Supabase (Auth, Postgres, Storage) |
| AI | OpenRouter via Vercel AI SDK |
| Deployment | Vercel |

---

## Branch Rules (CRITICAL)

| Branch | Purpose |
|---|---|
| `elcan` | Backend code only (API routes, lib/supabase, lib/ai, lib/pdf, middleware, types, validators) |
| `gulustan` | Frontend code only (pages, components, layouts, styles) |
| `main` | Stable merged branch |

**Always check the current branch before writing code.**
- Backend file → switch to `elcan` first
- Frontend file → switch to `gulustan` first
- When frontend imports backend lib files, merge `elcan` into `gulustan` first

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/             # Login, signup pages (public)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── layout.tsx      # Auth check + sidebar layout
│   │   └── dashboard/
│   │       ├── page.tsx    # Overview
│   │       └── upload/     # CV upload + analysis tool
│   ├── api/
│   │   ├── analyze/        # POST: CV matching endpoint
│   │   └── auth/callback/  # Supabase auth callback
│   ├── layout.tsx          # Root layout (ThemeProvider, Toaster)
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui auto-generated components
│   ├── auth/               # Auth-specific components
│   ├── dashboard/          # Dashboard components (sidebar, etc.)
│   ├── landing/            # Landing page sections
│   ├── upload/             # CV upload + results UI
│   └── results/            # Results display components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client (async cookies)
│   │   └── admin.ts        # Admin client (service role key)
│   ├── ai/                 # OpenRouter / AI SDK utilities
│   ├── pdf/                # PDF text extraction helpers
│   └── validators/         # Zod schemas for forms
├── middleware.ts            # Route protection (auth redirect)
└── types/
    └── index.ts            # Shared TypeScript types
```

---

## Key Conventions

### shadcn/ui v4 — Breaking Changes
This project uses shadcn/ui v4 which is built on **Base UI** (not Radix UI).

- ❌ `<Button asChild>` — **does not exist** in this version
- ✅ Use `<Link className={cn(buttonVariants())}>` for navigation buttons
- ✅ Use `render={<Link href="..." />}` for `SidebarMenuButton` and other Base UI components

### Supabase Auth (App Router)
- Browser client: `@/lib/supabase/client.ts` — use in Client Components
- Server client: `@/lib/supabase/server.ts` — use in Server Components & Route Handlers (async)
- Admin client: `@/lib/supabase/admin.ts` — use only in trusted server code (service role)
- Auth callback route: `/api/auth/callback/route.ts`

### Route Groups
- `(auth)` — public auth pages, no sidebar
- `(dashboard)` — protected pages, includes `DashboardSidebar`

### Environment Variables
Copy `.env.local.example` → `.env.local` and fill in real values.
**Never commit `.env.local`.**

---

## How to Prompt Cascade Effectively

When starting a new session, reference this file:
> "Read WINDSURF_GUIDE.md and BRANCHING.md before making changes."

Good prompts:
- "Add a results table component to `src/components/results/` on the gulustan branch"
- "Implement the `/api/analyze` route on the elcan branch using OpenRouter"
- "Merge elcan into gulustan and main, then push all branches"

Bad prompts:
- "Add a button" (too vague — specify file, branch, behavior)

---

## Pending Work

- [ ] Implement PDF text extraction (`src/lib/pdf/extract.ts`)
- [ ] Implement AI analysis logic in `/api/analyze/route.ts`
- [ ] Build results display component (`src/components/results/`)
- [ ] Add Supabase DB schema (profiles, analysis_jobs, cv_results tables)
- [ ] Connect upload tool to real API
- [ ] Add history page (`/dashboard/history`)
- [ ] Add settings page (`/dashboard/settings`)
- [ ] Set up Vercel deployment + env vars

---

## Credentials Needed (Not Yet Set Up)

1. **Supabase** — create project at https://supabase.com
2. **OpenRouter** — get API key at https://openrouter.ai/keys
3. **Vercel** — deploy at https://vercel.com

Ask the user for these before implementing any feature that requires them.
