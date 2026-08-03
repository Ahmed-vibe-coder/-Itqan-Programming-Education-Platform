## 2026-08-01T10:12:21Z
You are Worker 3 (Frontend & Auth Implementer).
Working directory: d:\@vibcoding\ai\.agents\worker_3\
Project root: d:\@vibcoding\ai

Your task is to implement Milestone 3: Auth & Fallback Resilience (Acceptance Criterion 2):
1. Read the audit findings for Auth and Guards in `d:\@vibcoding\ai\.agents\explorer_1\handoff.md` and `d:\@vibcoding\ai\.agents\orchestrator\audit_report.md`.
2. Update `src/app/providers/AuthProvider.tsx`:
   - Enclose `JSON.parse(storedUser)` in `try...catch` block. If corrupted/invalid, clear local storage item (`localStorage.removeItem('nawa_mock_session')`) and reset user to `null`.
   - Guarantee that `setLoading(false)` is called in all code paths / finally blocks, ensuring auth initialization never freezes in infinite loading.
3. Update `src/features/auth/pages/LoginPage.tsx`:
   - Fix Supabase login navigation: after successful `refreshSession()`, execute `navigate('/app')` (or `/teacher` based on user role) so users do not get stuck on `/login`.
   - Fix username login email lookup: when input is username (`!isEmailInput`), query `profiles` for `username` and retrieve user's registered email address (e.g. `.select('id, email')`) to set `authEmail` accurately before calling `supabase.auth.signInWithPassword`.
4. Update `src/app/guards/RoleGuard.tsx`:
   - Fix role fallthrough vulnerability: replace `if (role && !allowedRoles.includes(role))` with robust check `if (!role || !allowedRoles.includes(role))`, redirecting to `/login` or `/unauthorized` so `role === null` users can never bypass route protection.
5. Execute `npm run lint` and `npm run test` to verify zero build or test regressions.
6. Document all changes, files modified, and test outputs in `d:\@vibcoding\ai\.agents\worker_3\handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Output requirements:
Write `d:\@vibcoding\ai\.agents\worker_3\handoff.md` and send a message when done with a summary.
