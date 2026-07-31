# Frontend to Backend Traceability Matrix — مصفوفة التتبع الشاملة بين الواجهة والباك إند

**تاريخ التقرير:** 31 يوليو 2026

---

## 1. مصفوفة التتبع والربط المباشر End-to-End

| Domain | Route | Frontend Component | UI Event Handler | Service / Hook | Supabase Target / Edge Function | Affected Tables | RLS Requirement | Validation | Persistence Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/register` | `RegisterPage.tsx` | `handleRegister` | `supabase.functions.invoke` | `redeem-single-use-invitation` | `single_use_invitations`, `profiles` | Name Matching & `max_uses = 1` | Server-Side Arabic normalization | `auth.test.ts` |
| **Auth** | `/login` | `LoginPage.tsx` | `handleLogin` | `AuthProvider.tsx` | Supabase Auth API | `profiles`, `user_roles` | Role Check | Username to Email Mapping | `auth.test.ts` |
| **Content** | `/app/courses` | `CourseCatalogPage.tsx` | Render / Select | `courseService.ts` | Direct DB Select | `courses`, `modules`, `lessons` | Public Published Read | JSON Schema Validation | `content:validate` script |
| **Content** | `/app/lessons/:id` | `LessonPage.tsx` | `CodePlayground.tsx` | `courseService.ts` | Client Execution / DB Progress | `lessons`, `lesson_progress` | Student Own Progress | Code Parsing | `playground.test.ts` |
| **Exams** | `/app/exams/:id` | `ExamPage.tsx` | `handleSubmitExam` | `assessmentService.ts` | `submit-assessment-attempt` | `assessment_attempts`, `certificates` | Student Own Attempt | Server-Side Scoring | `assessments.test.ts` |
| **Certificates** | `/verify/:code` | `CertificateVerificationPage.tsx` | Render / URL Param | Page Direct Fetch | Direct DB Select | `certificates` | Public Active Read | Verification Code Match | `certificates.test.ts` |
| **Teacher** | `/teacher/invitations` | `TeacherInvitationsPage.tsx` | `handleCreateInvitation` | Page Direct Insert | Direct DB Insert | `single_use_invitations` | `is_teacher_or_owner` | Full Name Required | `admin_mobile_enhancements.test.ts` |
| **Teacher** | `/teacher/questions` | `QuestionBankPage.tsx` | `QuestionEditorModal.tsx` | Page Direct Insert | Direct DB Insert | `questions` | `is_teacher_or_owner` | Correct Answer Required | `admin_mobile_enhancements.test.ts` |
| **Health** | `/teacher/system-health` | `SystemHealthPage.tsx` | `handleRunCheck` | Page Direct Check | Supabase Health Query | `app_settings`, `audit_logs` | `is_teacher_or_owner` | Live Signals | `security.test.ts` |

---

## 2. النتيجة وتأكيد الاستمرار
كل مسار في الواجهة مرتبط بشكل قاطع بخدمات ودوال Supabase السحابية وجداول Postgres ومحمي بـ RLS.
