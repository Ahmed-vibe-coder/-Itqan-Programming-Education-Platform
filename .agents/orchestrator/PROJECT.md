# Project: Itqan (إتقان) Programming Education Platform

## Architecture
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Supabase DB & SQL Migrations (PostgreSQL, RLS, Triggers, RPCs)
- State & Auth: React Context / Supabase JS Client with Offline/Mock fallbacks
- Testing & Linting: Vitest, ESLint, TypeScript (tsc)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Complete System Audit & Gap Analysis | Comprehensive audit of Frontend routes/components, Supabase SQL/RLS, and Test/Lint runner | None | DONE |
| 2 | RLS Policies & Database Security Hardening | Enable RLS on all Supabase tables, audit SQL migrations, add missing policies & RPC security | Milestone 1 | DONE |
| 3 | Auth & Fallback Resilience | Fix Auth state handling for offline/mock fallbacks without infinite loading or crashes | Milestone 1 | DONE |
| 4 | Frontend Stability & Route Fixes | Resolve runtime console errors, missing components, broken routes, and error boundaries | Milestone 1 | DONE |
| 5 | Type Safety, Linting & Vitest Suite Passing | Fix all TS compilation/ESLint errors and Vitest test suite failures (0 errors) | Milestones 2, 3, 4 | DONE |
| 6 | Final Integrated Verification & Forensic Audit | End-to-end regression testing, Challenger verification, and Forensic Audit pass | Milestones 1-5 | DONE |

## Acceptance Criteria Checklist
- [x] All Supabase tables have proper Row Level Security (RLS) policies enabled.
- [x] Authentication state handles offline/mock fallbacks gracefully without infinite loading or crashes.
- [x] All React routes and feature pages render without runtime console errors or missing components.
- [x] TypeScript compilation (`npm run lint`) and Vitest test suite (`npm run test`) pass with 0 errors.

## Code Layout
- Frontend code: `src/` (components, pages, context, hooks, routes)
- Backend / DB code: `supabase/` (migrations, config, functions)
- Test files: `src/**/*.test.ts(x)`, `tests/`
