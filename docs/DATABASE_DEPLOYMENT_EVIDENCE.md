# Database Deployment Evidence & Verification — نواة كود (nawa-code)

**تاريخ التدقيق والتطبيق**: 30 يوليو 2026  
**بيئة قاعدة البيانات**: Supabase / Lovable Cloud PostgreSQL (`exbjcoocktpxeicpdoyc`)

---

## 1. المهاجرات المنفذة (Applied Migrations Log)

| Migration File | Timestamp | Description | Status | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- |
| `20260730_init_schema.sql` | 2026-07-30T19:26:08Z | الهيكل الأول للأدوار، الطلاب، الجداول، المناهج والامتحانات | **Applied** | `profiles`, `user_roles`, `invitations`, `courses`, `lessons` |
| `20260730_complete_schema.sql` | 2026-07-30T19:50:50Z | الهيكل الشامل للجداول المعمارية الـ 35+، RLS وحماية النقاط والشهادات | **Applied** | `practice_activities`, `student_notes`, `grading_records`, `certificates` |
| `seed.sql` | 2026-07-30T19:48:37Z | زرع البيانات الأولية للمناهج والدروس والأوسمة بصيغ UUID سداسية عشرية معتمدة | **Applied** | 3 كورسات منشورة، 3 وحدات أولية، 9 دروس مكتملة، 6 أوسمة |

---

## 2. جدول التحقق الجنائي من الجداول (Table Verification Matrix)

- [x] **Identity & Access**: `profiles`, `user_roles`, `invitations`, `app_settings`, `feature_flags`, `audit_logs` (جميعها تملك PK, FK, Constraints و RLS مفعّل).
- [x] **Groups & Assignments**: `groups`, `group_members`, `course_assignments`, `assessment_assignments`, `teacher_student_notes`.
- [x] **Courses & Lessons**: `courses`, `course_versions`, `modules`, `lessons`, `lesson_blocks`, `lesson_prerequisites`.
- [x] **Activity & Workspace**: `lesson_progress`, `practice_activities`, `practice_attempts`, `code_workspaces`, `bookmarks`, `student_notes`, `review_recommendations`.
- [x] **Assessment & Grading**: `questions`, `assessments`, `assessment_attempts`, `attempt_questions`, `attempt_answers`, `grading_records`.
- [x] **Gamification**: `xp_transactions`, `achievement_definitions`, `student_achievements`, `student_streaks`.
- [x] **Notifications & AI**: `announcements`, `notifications`, `ai_generation_jobs`, `ai_usage_logs`.
- [x] **Certificates Foundation**: `certificate_templates`, `certificates`.

---

## 3. التحقق من دوال ومحفزات الأمان (Security Functions Verification)
- `is_teacher_or_owner(user_id UUID)`: دالة معرفة بـ SECURITY DEFINER للتحقق الحازم من أدوار المعلم والمالك دون السماح للعميل بتزوير الدور.
- `idempotency_key` في `xp_transactions`: يضمن عدم تكرار نقاط الـ XP لنفس العملية حتى عند تكرار طلبات الشبكة.
