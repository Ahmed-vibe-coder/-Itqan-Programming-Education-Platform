## 2026-08-01T13:35:29Z
You are Worker Gen2 1 (Implementer). Your task is to implement the exact fix strategy for Milestone 3 (Auth & Fallback Resilience) audit remediation.

Working directory: d:\@vibcoding\ai\.agents\worker_gen2_1\
Project root: d:\@vibcoding\ai

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Objective:
Read and follow the line-by-line edit instructions in `d:\@vibcoding\ai\.agents\explorer_gen2_1\fix_strategy.md` to edit the following files:
1. `src/services/authService.ts`
   - Harmonize error message to `'كود الدعوة غير صحيح أو غير مفعّل.'`.
   - Update mock group_id to valid UUID `'00000000-0000-0000-0000-000000000001'`.
2. `src/services/teacherService.ts`
   - Add UUID regex check in `createInvitation` to sanitize `groupId` before inserting into DB or returning mock object.
3. `src/app/providers/AuthProvider.tsx`
   - Add explicit primitive JSON check `if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid session object in localStorage');` inside session loading logic so primitive JSON values trigger the catch block and execute `localStorage.removeItem('nawa_mock_session')`.
4. `src/app/guards/RoleGuard.tsx`
   - Ensure unrecognized roles (e.g. `'guest'`) unconditionally redirect to `/login`.
5. `src/tests/auth_logic.test.ts`
   - Update primitive JSON test expectation to verify `nawa_mock_session` is purged.
   - Update unrecognized role test expectation in `evaluateRoleGuard` to expect `/login`.
6. `src/tests/auth.test.ts`
   - Verify all test assertions align with updated error messages and valid UUID formats.

### Verification Steps:
1. Run `npm run lint` (`npx eslint .`).
2. Run `npm run test` (`npx vitest run`).
3. Ensure 0 lint errors and all 13 test files (38 tests) pass.
4. Document commands executed, stdout/stderr, and file changes in `d:\@vibcoding\ai\.agents\worker_gen2_1\handoff.md`.
5. Send a message to parent orchestrator upon completion.
