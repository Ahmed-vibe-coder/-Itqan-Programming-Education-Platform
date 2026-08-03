# Handoff Report — Milestone 3: Auth Security & State Review

**Reviewer**: Reviewer 4 (Auth Security & State Reviewer)  
**Date**: 2026-08-01  
**Verdict**: **FAIL / REQUEST_CHANGES**

---

## 1. Observation

### 1.1 Source Files Inspected
- `src/app/providers/AuthProvider.tsx` (Lines 1-162)
- `src/features/auth/pages/LoginPage.tsx` (Lines 1-224)
- `src/app/guards/RoleGuard.tsx` (Lines 1-38)
- `src/app/guards/SetupGuard.tsx` (Lines 1-26)
- `src/app/router/AppRouter.tsx` (Lines 1-191)
- `src/services/authService.ts` (Lines 1-57)
- `src/tests/auth.test.ts` (Lines 1-14)
- `src/tests/security.test.ts` (Lines 1-12)

### 1.2 Command Execution Results
- **`npm run lint` (`npx --no-install tsc --noEmit`)**:
  - Command: `npm run lint`
  - Output: Exit code 0, 0 TypeScript errors.
- **`npm run test` (`npx --no-install vitest run`)**:
  - Command: `npm run test`
  - Output: 12 test files passed, 13 tests passed.

### 1.3 Specific Code Observations

1. **`src/tests/auth.test.ts:4-12`**:
   ```ts
   it('validates NAWA format invitation codes format', () => {
     const isValidCodeFormat = (code: string) => {
       return code.trim().toUpperCase().startsWith('NAWA-');
     };
     expect(isValidCodeFormat('NAWA-CLASS-A')).toBe(true);
     ...
   });
   ```
   *Observation*: The test defines a local function `isValidCodeFormat` inside the test block and tests that local function. It does not import or test `AuthProvider`, `LoginPage`, `RoleGuard`, or `authService.validateInvitation`.

2. **`src/tests/security.test.ts:4-10`**:
   ```ts
   it('blocks student role from accessing teacher routes', () => {
     const userRole = 'student';
     const allowedRoles = ['owner', 'teacher'];
     const hasAccess = allowedRoles.includes(userRole);
     expect(hasAccess).toBe(false);
   });
   ```
   *Observation*: The test defines local variables `userRole` and `allowedRoles` inside the test body and asserts `allowedRoles.includes(userRole) === false`. It does not render `RoleGuard`, test React Router guards, or test Supabase RLS.

3. **`src/app/providers/AuthProvider.tsx:111-113`**:
   ```ts
   useEffect(() => {
     refreshSession();
   }, []);
   ```
   *Observation*: `AuthProvider` calls `refreshSession()` on mount, but never subscribes to `supabase.auth.onAuthStateChange`.

4. **`src/app/providers/AuthProvider.tsx:81-95`**:
   ```ts
   if (profileData) setProfile(profileData);
   if (roleData) setRole(roleData.role as UserRole);
   ```
   *Observation*: If `profileData` or `roleData` returns `null` or missing record during session refresh, `setProfile` / `setRole` are not executed, leaving previous state intact without resetting `profile` or `role` to `null`.

5. **`src/features/auth/pages/LoginPage.tsx:43-45`**:
   ```ts
   if (!profileData || !(profileData as any).email) {
     throw new Error('اسم المستخدم غير مسجل.');
   }
   ```
   *Observation*: Entering an unregistered username throws `'اسم المستخدم غير مسجل.'` ("Username is not registered"), explicitly revealing account existence before password authentication.

6. **`src/features/auth/pages/LoginPage.tsx`**:
   *Observation*: `LoginPage` has no check for `user` state on mount, so an authenticated user navigating to `/login` remains on `/login` instead of being redirected to `/app` or `/teacher`.

---

## 2. Logic Chain

1. **Integrity Violation Analysis**:
   - The test prompt mandates checking for self-certifying work, dummy test implementations, and shortcuts that bypass intended task verification.
   - Observations 1.3.1 and 1.3.2 show that `auth.test.ts` and `security.test.ts` implement inline local logic inside the test functions rather than exercising actual codebase components (`AuthProvider`, `RoleGuard`, `authService`).
   - Therefore, the test suite pass score (13/13 passed) is facade-driven for Auth & Security, constituting an **INTEGRITY VIOLATION**.

2. **Session State Lifecycle Analysis**:
   - Supabase auth relies on token rotation and event-driven session changes (login, logout in another tab, token refresh, session expiry).
   - Because `AuthProvider` lacks `supabase.auth.onAuthStateChange` (Observation 1.3.3), any auth state change occurring outside initial mount is ignored by React state.
   - Furthermore, conditional setting of `profile` and `role` without reset on missing data (Observation 1.3.4) leads to stale state bugs across logins.

3. **Security Analysis**:
   - Observation 1.3.5 demonstrates username enumeration vulnerability on `LoginPage`. An unauthenticated actor can scan usernames to determine valid accounts.
   - Observation 1.3.6 creates an UX/Security edge case where authenticated users can access un-guarded `/login`.

---

## 3. Caveats

- Supabase integration was evaluated in both mock (`isSupabaseConfigured() === false`) and configured modes (`isSupabaseConfigured() === true`).
- Server-side PostgreSQL Row Level Security (RLS) SQL policies could not be directly executed against a live database instance since tests run against local environment without active remote DB connections, but client-side guard behavior was thoroughly analyzed.

---

## 4. Conclusion

**Verdict**: **FAIL / REQUEST_CHANGES**

### Findings Summary:

#### [Critical] Finding 1: INTEGRITY VIOLATION — Facade Self-Certifying Unit Tests
- **Location**: `src/tests/auth.test.ts` & `src/tests/security.test.ts`
- **Issue**: Tests evaluate inline dummy variables/functions created inside the test body instead of importing and testing `AuthProvider`, `RoleGuard`, or `authService`.
- **Remediation**: Rewrite `auth.test.ts` and `security.test.ts` using `@testing-library/react` and `vitest` to render `AuthProvider` and `RoleGuard` and test actual session management and route protection logic.

#### [Major] Finding 2: Missing Supabase `onAuthStateChange` Listener
- **Location**: `src/app/providers/AuthProvider.tsx:111-113`
- **Issue**: `AuthProvider` lacks `onAuthStateChange` subscription. Session state changes, auto token refresh, or signout across tabs will not update React context.
- **Remediation**: Add `supabase.auth.onAuthStateChange` inside `useEffect` in `AuthProvider.tsx` to handle `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, and `USER_UPDATED` events.

#### [Major] Finding 3: Username Enumeration Vulnerability
- **Location**: `src/features/auth/pages/LoginPage.tsx:43-45`
- **Issue**: Login form explicitly returns `'اسم المستخدم غير مسجل.'` when a username is not found.
- **Remediation**: Return a generic error message (e.g. `'اسم المستخدم أو كلمة المرور غير صحيحة.'`) on username lookup failure to prevent user enumeration.

#### [Medium] Finding 4: Stale Profile and Role State Fallback
- **Location**: `src/app/providers/AuthProvider.tsx:81-95`
- **Issue**: `setProfile` and `setRole` are only called if `profileData` / `roleData` are non-null, failing to clear stale role/profile state when session user changes or records are missing.
- **Remediation**: Always explicitly set `setProfile(profileData || null)` and `setRole(roleData?.role as UserRole || null)`.

#### [Medium] Finding 5: Authenticated Users Can Access `/login`
- **Location**: `src/features/auth/pages/LoginPage.tsx`
- **Issue**: Logged-in users who visit `/login` are not redirected to `/app` or `/teacher`.
- **Remediation**: Add a redirect check in `LoginPage` or wrap `/login` in a `PublicOnlyGuard` so authenticated users are automatically redirected to their appropriate role home page.

---

## 5. Verification Method

To verify the findings and fixes:

1. **Lint Verification**:
   ```bash
   npm run lint
   ```
   Confirm zero TypeScript errors.

2. **Test Suite Verification**:
   ```bash
   npm run test
   ```
   Inspect test files `src/tests/auth.test.ts` and `src/tests/security.test.ts` to ensure they import `AuthProvider`, `RoleGuard`, and `authService` rather than testing local dummy inline helper functions.

3. **Code Inspection**:
   - Inspect `AuthProvider.tsx` for `supabase.auth.onAuthStateChange` listener.
   - Inspect `LoginPage.tsx` for generic authentication error messages.
