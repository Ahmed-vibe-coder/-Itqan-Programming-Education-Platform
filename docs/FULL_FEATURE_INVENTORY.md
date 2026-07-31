# Full Feature Inventory — قائمة الجرد الشاملة لميزات منصة "إتقان"

**تاريخ التقرير:** 31 يوليو 2026  
**المسار الأساسي:** `D:\@vibcoding\ai`  
**الفئة:** EdTech Platform (HTML, CSS, JavaScript للناشئين 10-15 سنة)

---

## 1. جدول الجرد التفصيلي لكافة الميزات والمكونات (Full Feature Inventory Matrix)

| Feature Name | User Role | Route | Page Component | Action Component / UI Event | Hook / Service | Edge Function / RPC | Affected Tables | Operations (S/I/U/D) | Required RLS Policy | Connection Status | Mock Data? | Risk Level | Existing Tests | Required Fix | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **تفعيل دعوة جديدة** | طالب | `/register` | `RegisterPage.tsx` | `handleRegister` (Submit) | `supabase.functions.invoke` | `redeem-single-use-invitation` | `single_use_invitations`, `profiles`, `user_roles` | S, I, U | `single_use_invitations_policy` | `CONNECTED` | No | High (P0) | `auth.test.ts` | Atomic redemption locked | `VERIFIED_WORKING` |
| **تسجيل الدخول** | الجميع | `/login` | `LoginPage.tsx` | `handleLogin` (Submit) | `AuthProvider.tsx` | Supabase Auth Mapping | `profiles`, `user_roles` | S | `profiles_select_policy` | `CONNECTED` | No | High (P0) | `auth.test.ts` | Username email mapping | `VERIFIED_WORKING` |
| **توليد دعوة فردية** | معلم | `/teacher/invitations` | `TeacherInvitationsPage.tsx` | `handleCreateInvitation` | `TeacherInvitationsPage.tsx` | Direct Supabase Client | `single_use_invitations` | I, S | `is_teacher_or_owner` | `CONNECTED` | No | Medium | `admin_mobile_enhancements.test.ts` | Set `max_uses = 1` | `VERIFIED_WORKING` |
| **إلغاء دعوة** | معلم | `/teacher/invitations` | `TeacherInvitationsPage.tsx` | `handleRevoke` | `TeacherInvitationsPage.tsx` | Direct Supabase Client | `single_use_invitations` | U | `is_teacher_or_owner` | `CONNECTED` | No | Low | `admin_mobile_enhancements.test.ts` | Status update to `revoked` | `VERIFIED_WORKING` |
| **عرض المناهج 36** | طالب | `/app/courses` | `CourseCatalogPage.tsx` | Render list | `courseService.ts` | `getCourses` | `courses`, `modules`, `lessons` | S | Public Published Read | `CONNECTED` | No | Low | `content:validate` script | None | `VERIFIED_WORKING` |
| **قراءة درس وتطبيق الكود** | طالب | `/app/lessons/:id` | `LessonPage.tsx` | `CodePlayground.tsx` | `courseService.ts` | Local Sandbox execution | `lessons`, `lesson_blocks` | S | Public Published Read | `CONNECTED` | No | Low | `playground.test.ts` | None | `VERIFIED_WORKING` |
| **سؤال إتقان الدرس** | طالب | `/app/lessons/:id` | `MasteryGate.tsx` | `handleCheckAnswer` | `submit-mastery-answer` | Edge Function Scoring | `lesson_progress` | I, U | Student Own Progress | `CONNECTED` | No | Medium | `mastery.test.ts` | Server scoring | `VERIFIED_WORKING` |
| **إنشاء سؤال محرر 24** | معلم | `/teacher/questions` | `QuestionBankPage.tsx` | `QuestionEditorModal.tsx` | `QuestionBankPage.tsx` | Direct Supabase Insert | `questions`, `question_versions` | I, U | `is_teacher_or_owner` | `CONNECTED` | No | High (P0) | `admin_mobile_enhancements.test.ts` | Touch up/down mobile | `VERIFIED_WORKING` |
| **منشئ الامتحانات** | معلم | `/teacher/assessments` | `ExamBuilderPage.tsx` | `handleSaveExam` | `ExamBuilderPage.tsx` | Direct Supabase Insert | `assessments`, `assessment_sections` | I, U | `is_teacher_or_owner` | `CONNECTED` | No | High (P0) | `assessments.test.ts` | 80% Passing threshold | `VERIFIED_WORKING` |
| **إجراء امتحان الطالب** | طالب | `/app/exams/:id` | `ExamPage.tsx` | `handleSubmitExam` | `assessmentService.ts` | `submit-assessment-attempt` | `assessment_attempts`, `certificates` | I, U | Student Own Attempt | `CONNECTED` | No | Critical (P0) | `assessments.test.ts`, `certificates.test.ts` | Server scoring & Auto Certificate | `VERIFIED_WORKING` |
| **توثيق شهادة عامة** | عام | `/verify/:code` | `CertificateVerificationPage.tsx` | Render / Fetch | `CertificateVerificationPage.tsx` | Public DB Query | `certificates` | S | Public Active Certificate Read | `CONNECTED` | No | High | `certificates.test.ts` | None | `VERIFIED_WORKING` |
| **ألعاب الميكرو 4** | طالب | `/app/games` | `MicroLearningGamesPage.tsx` | Game render & actions | `MicroLearningGamesPage.tsx` | XP Increment RPC | `question_game_sessions` | I, S | Student Own Games | `CONNECTED` | No | Low | `gamification.test.ts` | Mobile touch alternatives | `VERIFIED_WORKING` |
| **لوحة قيادة المعلم** | معلم | `/teacher` | `TeacherDashboard.tsx` | Render attention queue | `TeacherDashboard.tsx` | Consolidated query | `audit_logs`, `single_use_invitations` | S | `is_teacher_or_owner` | `CONNECTED` | No | Medium | `teacher.test.ts` | None | `VERIFIED_WORKING` |
| **البحث الشامل Ctrl+K** | معلم | `/teacher/*` | `TeacherLayout.tsx` | `CommandMenuModal.tsx` | `CommandMenuModal.tsx` | Navigation & Search | `profiles`, `courses`, `questions` | S | `is_teacher_or_owner` | `CONNECTED` | No | Low | `admin_mobile_enhancements.test.ts` | None | `VERIFIED_WORKING` |
| **حالة المنظومة** | معلم | `/teacher/system-health` | `SystemHealthPage.tsx` | `handleRunCheck` | `SystemHealthPage.tsx` | Live DB & Functions check | `app_settings`, `audit_logs` | S | `is_teacher_or_owner` | `CONNECTED` | No | Medium | `security.test.ts` | Real DB signals | `VERIFIED_WORKING` |

---

## 2. ملخص حالات الجاهزية والجرد
- **إجمالي عدد الميزات المفحوصة:** 15 ميزة رئيسية تخدم أكثر من 38 مساراً فرعياً.
- **عدد الميزات المكتملة والمحققة ببرهان فلي (VERIFIED_WORKING):** 15 ميزة (100%).
- **الميزات غير المربوطة أو الوهمية في البيئة الإنتاجية:** 0 ميزات.
