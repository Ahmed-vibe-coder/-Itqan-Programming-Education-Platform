# Plan: Itqan Platform Development & Compliance

## Objective
Achieve 100% compliance with R1, R2, and all Acceptance Criteria for the Itqan programming education platform.

## Milestone Breakdown & Strategy

### Milestone 1: Complete System Audit & Gap Analysis (R1)
- Dispatch 3 parallel Explorers:
  - **Explorer 1 (Frontend & Routes)**: Audit all React routes, pages, auth flow, mock/supabase state fallbacks, missing components, error boundaries.
  - **Explorer 2 (Backend & Supabase SQL/RLS)**: Audit `supabase/` migrations, table schemas, missing RLS policies, triggers, RPC procedures.
  - **Explorer 3 (Testing & Code Quality)**: Inspect test files, `package.json`, vitest config, ESLint/TS build configuration, identify failing tests/lint issues.
- Synthesize exploration handoff reports into comprehensive Gap Analysis report in `d:\@vibcoding\ai\.agents\orchestrator\audit_report.md`.

### Milestone 2: RLS Policies & Database Security Hardening (AC1)
- Worker creates/updates SQL migrations in `supabase/migrations/` to enable RLS on every table and define SELECT/INSERT/UPDATE/DELETE policies.
- Reviewer & Challenger verify migration files and SQL logic.
- Forensic Auditor verifies DB integrity and policy authenticity.

### Milestone 3: Auth & Fallback Resilience (AC2)
- Worker updates AuthContext / hooks to handle offline/mock fallbacks gracefully without infinite loops or crashes.
- Reviewer & Challenger test auth states, mock mode, and network drop recovery.
- Forensic Auditor verifies auth fallback logic.

### Milestone 4: Frontend Stability & Route Fixes (AC3)
- Worker resolves console errors, missing components, unhandled state transitions, and error boundary fallbacks across all React routes.
- Reviewer & Challenger check route rendering, console logs, and component stability.
- Forensic Auditor verifies UI stability.

### Milestone 5: Type Safety, Linting & Vitest Suite Passing (AC4)
- Worker fixes all TypeScript compilation errors, ESLint linting warnings/errors (`npm run lint`), and Vitest test suite failures (`npm run test`).
- Reviewer & Challenger execute lint and test commands to verify 0 errors.
- Forensic Auditor verifies no dummy tests or test skipping was introduced.

### Milestone 6: Final Integrated Verification & Forensic Audit
- Final Challenger execution across full app.
- Final Forensic Audit verification (MUST be CLEAN).
- Human report generation and delivery.
