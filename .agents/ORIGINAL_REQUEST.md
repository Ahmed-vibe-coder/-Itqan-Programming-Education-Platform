# Original User Request

## 2026-08-01T09:55:53Z

إتقان (Itqan) هي منصة تعليم برمجة تفاعلية (Frontend: React + Vite + TypeScript + Tailwind, Backend: Supabase DB & SQL Migrations).

Working directory: d:\@vibcoding\ai
Integrity mode: development

## Requirements

### R1. Complete System Audit & Gap Analysis (Front & Back)
- Audit authentication, state fallback (Mock vs Supabase), error boundaries, route guards, and UI responsiveness.
- Review Supabase SQL migrations, RLS policies, triggers, and RPC procedures.

### R2. Core Engineering & Feature Fixes
- Fix any broken paths, unhandled mock states, edge cases, and missing error UI fallbacks.
- Strengthen DB security policies (RLS), real-time syncing, and complete test suite coverage.

## Acceptance Criteria

### Security & Database Integrity
- [ ] All Supabase tables have proper Row Level Security (RLS) policies enabled.
- [ ] Authentication state handles offline/mock fallbacks gracefully without infinite loading or crashes.

### Frontend & UI Stability
- [ ] All React routes and feature pages render without runtime console errors or missing components.
- [ ] TypeScript compilation (`npm run lint`) and Vitest test suite (`npm run test`) pass with 0 errors.
