## 2026-08-01T11:50:27Z
You are Worker Gen2 2 (Implementer Replacement). Your task is to implement the exact changes for Milestone 4 (Frontend Stability & Route Fixes).

Working directory: d:\@vibcoding\ai\.agents\worker_gen2_2\
Project root: d:\@vibcoding\ai

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Objective:
Read and follow the line-by-line file edit instructions in `d:\@vibcoding\ai\.agents\explorer_gen2_2\plan.md`:
1. Create `src/components/shared/ErrorBoundary.tsx` (React ErrorBoundary class component).
2. Create `src/features/public/pages/NotFoundPage.tsx` (404 page component).
3. Update `src/App.tsx` to wrap `<ThemeProvider>` / `<AuthProvider>` / `<AppRouter>` with `<ErrorBoundary>`.
4. Update `src/app/router/AppRouter.tsx` to import `NotFoundPage` and set wildcard route `<Route path="*" element={<NotFoundPage />} />`.
5. Update `src/features/courses/pages/CourseCatalogPage.tsx` to handle `.catch()` errors, loading state, error UI state, and empty catalog state.
6. Update `src/features/courses/pages/CourseDetailPage.tsx` to handle `.catch()` errors, loading state, error UI state, and 404 Course Not Found UI state when `course` is null.
7. Add `.catch((err) => console.error(err))` to any async data fetches in `src/features/student/pages/MistakeNotebookPage.tsx`, `src/features/student/pages/ReviewCenterPage.tsx`, `src/features/student/pages/SkillMapPage.tsx`, and `src/features/teacher/pages/TeacherAttentionPage.tsx`.

### Verification Steps:
1. Run `npm run lint` (`npx eslint .` / `npx tsc --noEmit`).
2. Run `npm run test` (`npx vitest run`).
3. Ensure 0 lint errors and all tests pass.
4. Document all changes and build/test output in `d:\@vibcoding\ai\.agents\worker_gen2_2\handoff.md`.
5. Send a message to parent orchestrator when complete.
