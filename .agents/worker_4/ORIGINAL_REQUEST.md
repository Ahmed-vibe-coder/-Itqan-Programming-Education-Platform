## 2026-08-01T13:26:00Z
<USER_REQUEST>
You are Worker 4 (Auth Resilience & Testing Refiner).
Working directory: d:\@vibcoding\ai\.agents\worker_4\
Project root: d:\@vibcoding\ai

Your task is to refine Milestone 3 Auth state and test suite per Reviewer 4 feedback:
1. Open `src/app/providers/AuthProvider.tsx`:
   - Add a `useEffect` hook that subscribes to `supabase.auth.onAuthStateChange((_event, session) => { ... })` when Supabase is configured.
   - Update `user`, `profile`, and `role` reactively on auth state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED). Ensure cleanup on unmount (`subscription.unsubscribe()`).
   - Reset `profile` and `role` to `null` when `session?.user` is `null` in `refreshSession()`.
2. Open `src/features/auth/pages/LoginPage.tsx`:
   - Replace specific username lookup exception message `'اسم المستخدم غير مسجل.'` with generic message `'اسم المستخدم/البريد الإلكتروني أو كلمة المرور غير صحيحة.'` to prevent username enumeration.
   - Add redirect for already authenticated users (`user != null`): if a user with active session visits `/login`, automatically redirect to `/app` or `/teacher`.
3. Open `src/tests/auth.test.ts`:
   - Refactor test file to import real application modules from `src/services/` (e.g. `invitationService` / `authService`) and test real functions instead of inline dummy strings.
4. Open `src/tests/security.test.ts`:
   - Refactor test file to import real role types / guards from `src/app/guards/RoleGuard.tsx` or `src/types/` and test real role validation logic.
5. Execute `npm run lint` and `npm run test` to verify 0 errors.
6. Document all changes in `d:\@vibcoding\ai\.agents\worker_4\handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Output requirements:
Write `d:\@vibcoding\ai\.agents\worker_4\handoff.md` and send a message when done with a summary.
</USER_REQUEST>

## 2026-08-01T10:26:32Z
[Message] timestamp=2026-08-01T10:26:32Z sender=880c67f2-c9f7-47dc-b34d-3d3850aa879c priority=MESSAGE_PRIORITY_HIGH content=**Context**: RoleGuard unknown role redirect fix from Challenger 3.
**Content**: Please also ensure in `src/app/guards/RoleGuard.tsx` that any unrecognized role or unauthorized role (`!role || !allowedRoles.includes(role)`) redirects cleanly to `/login` (or `/unauthorized`), rather than defaulting to `/teacher`.
**Action**: Incorporate this check into your edits for RoleGuard.tsx.
