# Supabase Table Usage Report — تقرير استخدام وحالة جداول قاعدة البيانات

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. جداول قاعدة البيانات المفعلة والمستخدمة (Active Tables Inventory)

| اسم الجدول (Table Name) | الهدف والوصف | مكونات الواجهة المستخدمة | السياسات المفعلة (RLS) | التصنيف (Status) |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | ملفات الطلاب والمعلمين | AuthProvider, StudentDirectory | RLS Enabled (Read Own / Teacher All) | `ACTIVELY_USED` |
| `user_roles` | أدوار وصلاحيات النظام | AuthProvider, AuthorizationGuard | RLS Enabled (Admin Read/Write) | `ACTIVELY_USED` |
| `single_use_invitations` | الدعوات أحادية الاستخدام | TeacherInvitationsPage, RegisterPage | RLS Enabled (Max Uses = 1 Enforced) | `ACTIVELY_USED` |
| `courses` | الكورسات والمناهج | CourseCatalogPage, CourseBuilderPage | RLS Enabled (Public Read / Teacher Write) | `ACTIVELY_USED` |
| `modules` | الوحدات والموديلات | CourseCatalogPage, CourseBuilderPage | RLS Enabled (Public Read / Teacher Write) | `ACTIVELY_USED` |
| `lessons` | الدروس المنشورة (36 درساً) | LessonPage, CourseBuilderPage | RLS Enabled (Public Read / Teacher Write) | `ACTIVELY_USED` |
| `lesson_blocks` | كتل الدروس التفاعلية | LessonPage, Visual Block Editor | RLS Enabled (Public Read / Teacher Write) | `ACTIVELY_USED` |
| `questions` | بنك الأسئلة المركزي | QuestionBankPage, ExamBuilderPage | RLS Enabled (Hide Answer Key for Students) | `ACTIVELY_USED` |
| `assessments` | الامتحانات الرسمية والاختبارات | ExamBuilderPage, ExamLaunchPage | RLS Enabled | `ACTIVELY_USED` |
| `assessment_attempts` | محاولات الطلاب والتصحيح | ExamPage, ExamResultPage | RLS Enabled (Student Read Own / Teacher All) | `ACTIVELY_USED` |
| `certificates` | الشهادات المعتمدة بنسبة %80 | CertificateManagement, Verification | RLS Enabled (Public Verification via Code) | `ACTIVELY_USED` |
| `audit_logs` | سجلات العمليات والأمان | SystemHealthPage, AuditLogsPage | RLS Enabled (Teacher/Owner Only) | `ACTIVELY_USED` |
| `app_settings` | إعدادات النظام وتخصيص المنظومة | SystemHealthPage, PlatformSettings | RLS Enabled (Owner Only) | `ACTIVELY_USED` |
