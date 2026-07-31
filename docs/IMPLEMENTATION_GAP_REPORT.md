# Implementation Gap Report — منصة "نواة كود" (nawa-code)

**تاريخ التقرير**: 30 يوليو 2026  
**حالة التقرير**: مدقق وموثق بالأدلة البرمجية (Forensic Implementation Audit)

---

## 1. ملخص الفحص الجنائي للكود والخدمات (Audit Overview)

بناءً على فحص شجرة الملفات والمكونات والخدمات وقواعد البيانات والمستندات، تم حصر الثغرات والأجزاء غير المكتملة أو المفصولة أو المؤقتة، وتصنيفها حسب الجدول المعياري التالي.

---

## 2. مصفوفة سد الثغرات الجنائية (Implementation Gap Matrix)

| Domain | Feature | Required Route | Required Backend Support | Current Frontend Status | Current Backend Status | Data Source | Security Status | Test Status | Current Classification | Missing Work | Priority | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | First Owner Setup | `/setup` | Server RPC / DB Function `initialize_owner` | UI Form exists | Local/Fallback mock check | DB / Local | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Strict server RPC, lock concurrency, audit log | High | `SetupPage.tsx` |
| **Auth** | Invitation Register | `/register`, `/join/:code` | Table `invitations`, transactional profile/role creation | UI Form exists | Schema ready | DB / Local | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Real code verification, usage limit decrement, course assignment | High | `RegisterPage.tsx` |
| **Auth** | Password Recovery | `/forgot-password`, `/reset-password` | Supabase Auth reset password link | Missing pages | Native Auth | Supabase Auth | ROUTE_MISSING | UNTESTED | `ROUTE_MISSING` | Pages creation, email trigger, reset handler | Medium | `AppRouter.tsx` |
| **Learning** | Course Catalog | `/app/courses` | `courses` table | Redirects to Dashboard | Schema ready | Static mock | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Dedicated catalog page, subject filters, assigned course query | High | `AppRouter.tsx` |
| **Learning** | Course Details | `/app/courses/:courseSlug` | `courses`, `modules`, `lessons` | Redirects to Dashboard | Schema ready | Static mock | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Course roadmap tree page, progress percentage calculation | High | `AppRouter.tsx` |
| **Learning** | Lesson Workspace | `/app/lessons/:lessonId` | `lessons`, `lesson_blocks`, `lesson_progress` | Page exists | Schema ready | Partial mock | PARTIALLY_CONNECTED | UNTESTED | `PARTIALLY_CONNECTED` | Block validation, DB hydration, URL lock protection via RLS | High | `LessonPage.tsx` |
| **Learning** | Practice Activities | `/app/practice` | `practice_activities`, `practice_attempts` | Redirects to Dashboard | Missing table | Static mock | FRONTEND_ONLY | UNTESTED | `NOT_IMPLEMENTED` | Practice page, interactive code completion challenges, submission | High | `AppRouter.tsx` |
| **Learning** | Bookmarks & Notes | `/app/bookmarks`, `/app/notes` | `bookmarks`, `student_notes` | Modal in Lesson | Missing tables | Local state | FRONTEND_ONLY | UNTESTED | `NOT_IMPLEMENTED` | Dedicated pages for saved lessons and personal study notes | Medium | `AppRouter.tsx` |
| **Assessments** | Assessment Catalog | `/app/exams` | `assessments`, `assessment_assignments` | Page exists | Schema ready | Static mock | PARTIALLY_CONNECTED | UNTESTED | `PARTIALLY_CONNECTED` | Real assigned exams query, attempt limits check | High | `ExamLaunchPage.tsx` |
| **Assessments** | Timed Exam Execution | `/app/exams/:assessmentId/take` | `assessments`, `attempt_questions`, `attempt_answers` | Page exists | Schema ready | Static mock | SECURITY_INCOMPLETE | UNTESTED | `PARTIALLY_CONNECTED` | Server-side attempt snapshot, secure autosave, timer synchronization | High | `ExamPage.tsx` |
| **Assessments** | Server Scoring | `submit-assessment-attempt` | Edge Function / Database Function | Mock timeout | Missing Function | Client side | SECURITY_INCOMPLETE | UNTESTED | `BACKEND_MISSING` | Authoritative Edge Function scoring, XP assignment | High | `ExamPage.tsx` |
| **Assessments** | Review & Results | `/app/results/:id`, `/app/review/:id` | `assessment_attempts`, `review_recommendations` | Page exists | Schema ready | Static mock | PARTIALLY_CONNECTED | UNTESTED | `PARTIALLY_CONNECTED` | Review page, missed answers analysis, smart recommendation engine | Medium | `ExamResultPage.tsx` |
| **Teacher** | Student Management | `/teacher/students`, `/teacher/students/:id` | `profiles`, `group_members`, `course_assignments` | Redirects to Dashboard | Schema ready | Static mock | SECURITY_INCOMPLETE | UNTESTED | `PARTIALLY_CONNECTED` | Dedicated student directory, profile view, course assignment, status toggle | High | `TeacherDashboard.tsx` |
| **Teacher** | Group Management | `/teacher/groups`, `/teacher/groups/:id` | `groups`, `group_members`, `invitations` | Embedded in Dashboard | Schema ready | Partial mock | PARTIALLY_CONNECTED | UNTESTED | `PARTIALLY_CONNECTED` | Dedicated groups page, invitation code generator with limits & expiry | High | `TeacherDashboard.tsx` |
| **Teacher** | Visual CMS Builder | `/teacher/courses/:id/builder`, `/teacher/lessons/:id/editor` | `courses`, `modules`, `lessons`, `lesson_blocks` | Partial Page | Schema ready | Static mock | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Full block editor, reordering controls, preview as student, publish toggle | High | `CourseBuilderPage.tsx` |
| **Teacher** | Question Bank | `/teacher/questions`, `/teacher/questions/new` | `questions`, `question_options`, `question_tags` | AI Page exists | Schema ready | Static mock | SECURITY_INCOMPLETE | UNTESTED | `PARTIALLY_CONNECTED` | Full question editor, multi-type support, answer key protection | High | `AIAssistantPage.tsx` |
| **Teacher** | Manual Grading Queue | `/teacher/grading` | `grading_records`, `attempt_answers` | Embedded in Dashboard | Missing table | Static mock | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Dedicated grading queue page, rubric, teacher score & feedback submission | High | `TeacherDashboard.tsx` |
| **Teacher** | Analytics & Reports | `/teacher/analytics` | `lesson_progress`, `assessment_attempts` | Redirects to Dashboard | Schema ready | Static mock | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Dedicated analytics page, group completion, bottleneck analysis | Medium | `AppRouter.tsx` |
| **Teacher** | Audit Logs | `/teacher/audit` | `audit_logs` | Redirects to Dashboard | Schema ready | Static mock | SECURITY_INCOMPLETE | UNTESTED | `PARTIALLY_CONNECTED` | Audit log viewer page for administrative security tracking | High | `AppRouter.tsx` |
| **Teacher** | Settings & Branding | `/teacher/settings` | `app_settings` | Redirects to Dashboard | Schema ready | Static mock | FRONTEND_ONLY | UNTESTED | `PARTIALLY_CONNECTED` | Settings page for editable platform title, teacher display name, support contact | Low | `AppRouter.tsx` |
| **Gamification**| XP Ledger & Streaks | `/app/achievements`, `/app/leaderboard` | `xp_transactions`, `student_streaks`, `student_achievements` | Pages exist | Schema ready | Static mock | SECURITY_INCOMPLETE | UNTESTED | `PARTIALLY_CONNECTED` | Ledger-based XP transaction engine with idempotency keys | Medium | `AchievementsPage.tsx` |
| **Public** | Static Pages | `/privacy`, `/terms`, `/help`, `/unauthorized`, `404` | Public content | Missing pages | N/A | Static | PUBLIC | UNTESTED | `ROUTE_MISSING` | Dedicated Arabic privacy policy, terms of use, help desk, unauthorized & 404 pages | Medium | `AppRouter.tsx` |
| **Infrastructure**| Automated Testing | `npm run test` | Vitest / React Testing Library | Missing config | N/A | Local | N/A | UNTESTED | `NOT_IMPLEMENTED` | Vitest setup, unit tests for auth, RLS, mastery gate, playground security | High | `package.json` |
| **Infrastructure**| Route Code Splitting | `React.lazy` | Vite chunking | Single large JS bundle | N/A | Bundle | N/A | UNTESTED | `PARTIALLY_CONNECTED` | Code splitting student and teacher routes into lazy chunks | High | `AppRouter.tsx` |

---

## 3. خطة العمل المباشرة لسد الثغرات (Execution Sequence)
سننتقل الآن مباشرة لبناء وتوسيع وتثبيت المكونات وفق ترتيب الأولويات التالي دون توقف:
1. **قواعد البيانات المكملة (Migrations)**: إنشاء الهيكل الكامل للجداول المعمارية الـ 30+ والقيود والـ RLS.
2. **طبقة الخدمات (Services Layer)**: إنشاء خدمات Supabase النظيفة لكافة المجالات (`authService`, `courseService`, `lessonService`, `assessmentService`, `teacherService`, `gamificationService`).
3. **استكمال وتفعيل جميع المسارات (Routes Completion)**: تحويل كافة الأوجه المفصولة أو الموجهة للوحة القيادة إلى صفحات حقيقية متصلة بقاعدة البيانات.
4. **محرك الدروس وبوابة الإتقان (Mastery Gate & Playground Security)**: ربط حالة قفل وفتح الدروس بسيرفر Supabase والتحقق الحازم من الإتقان بنسبة 100%.
5. **إجبارية الأداء والاختبارات (Lazy Code-Splitting & Automated Testing)**: إعداد Vitest واختبارات المكونات وحزم الاستجابة الحركية وتقسيم الشفرات البرمجية.
