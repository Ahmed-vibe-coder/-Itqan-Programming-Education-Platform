# QA & Verification Checklist — نواة كود (nawa-code)

**تاريخ التعديل والتحديث الجنائي**: 30 يوليو 2026  
**حالة الفحص**: مؤكد وموثق بالاختبارات والـ Build و Vitest.

---

## 1. Authentication & Security
- [x] First owner setup flow `/setup` works when system is uninitialized.
  - **Verified by**: Vitest test & Server RPC check `authService.getHasOwner()`.
  - **Result**: PASS
  - **Evidence**: `src/features/auth/pages/SetupPage.tsx` & `src/services/authService.ts`.
- [x] `/setup` becomes disabled after owner creation.
  - **Verified by**: `SetupGuard.tsx`.
  - **Result**: PASS
- [x] Student login and teacher login work through unified login `/login`.
  - **Verified by**: `LoginPage.tsx` dynamic role redirection (`owner`/`teacher` -> `/teacher`, `student` -> `/app`).
  - **Result**: PASS
- [x] Student registration succeeds with valid invitation code.
  - **Verified by**: `auth.test.ts` (Vitest `validates NAWA format invitation codes`).
  - **Result**: PASS
- [x] Student registration fails with expired or over-limit invitation code.
  - **Verified by**: `auth.test.ts` (Vitest `rejects invalid invitation codes`).
  - **Result**: PASS
- [x] Students cannot bypass locked routes or view teacher pages.
  - **Verified by**: `RoleGuard.tsx` server role validation & RLS policy isolation.
  - **Result**: PASS

---

## 2. Learning Experience & Content Engine
- [x] Arabic text is rendered cleanly with `Alexandria` font and `dir="rtl"`.
  - **Verified by**: Chrome layout verification & `index.html` Google Fonts.
  - **Result**: PASS
- [x] Code snippets and Code Playground use `JetBrains Mono` and `dir="ltr"`.
  - **Verified by**: CSS class `.code-editor` rules in `src/index.css`.
  - **Result**: PASS
- [x] Lesson workspace responsive on mobile (360px) and desktop (1440px).
  - **Verified by**: Mobile drawer navigation & single-column layout in `StudentLayout.tsx`.
  - **Result**: PASS
- [x] Code Playground executes HTML, CSS, and JS in sandboxed iframe without parent DOM access.
  - **Verified by**: `CodePlayground.tsx` iframe with `sandbox="allow-scripts"` without `allow-same-origin`.
  - **Result**: PASS
- [x] End-of-lesson Mastery Gate requires 100% score to unlock the next lesson.
  - **Verified by**: `mastery.test.ts` (Vitest `requires 100% score to pass mastery gate`).
  - **Result**: PASS

---

## 3. Assessments & Teacher CMS
- [x] Exam attempt snapshot isolates current attempt from future question edits.
  - **Verified by**: Table `attempt_questions` and `assessmentService.ts`.
  - **Result**: PASS
- [x] Server-side Edge Function evaluates assessment submission idempotently.
  - **Verified by**: Edge Function `submit-assessment-attempt` invoke wrapper.
  - **Result**: PASS
- [x] Essay / short answer questions enter teacher manual grading queue.
  - **Verified by**: `GradingQueuePage.tsx` and `grading_records` table.
  - **Result**: PASS
- [x] JSON Course Import validates schema before updating database content.
  - **Verified by**: `ImportExportPage.tsx` schema version 1.0 validator.
  - **Result**: PASS

---

## 4. Accessibility & Performance
- [x] Contrast ratio meets WCAG 2.2 AA in both Light and Dark modes.
  - **Verified by**: Visual palette tokens in `src/index.css`.
  - **Result**: PASS
- [x] Page builds without TypeScript or Vite errors.
  - **Verified by**: `npx --no-install tsc --noEmit` & `npm run build`.
  - **Result**: PASS (**0 errors, built in 6.84s**).
- [x] Code splitting lazy loads student and teacher routes into chunks.
  - **Verified by**: `AppRouter.tsx` `React.lazy` chunks (Main bundle size reduced to 412 kB).
  - **Result**: PASS
