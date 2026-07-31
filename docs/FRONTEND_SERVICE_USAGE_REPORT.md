# Frontend Service Usage Report — تقرير استخدام وتقسيم خدمات الواجهة

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. حصر وتتبع خدمات الواجهة (Services & Hooks Traceability)

| ملف الخدمة (Service File) | الدوال المصدرة (Exported Functions) | المكونات المستهلكة | الجداول والـ Edge Functions المربوطة | المعالجة والأخطاء |
| :--- | :--- | :--- | :--- | :--- |
| `src/lib/supabase.ts` | `supabase`, `isSupabaseConfigured` | جميع مكونات التطبيق | Supabase Client JS SDK | المعالجة والاستعادة عند الانقطاع |
| `src/app/providers/AuthProvider.tsx` | `useAuth`, `logout`, `refreshSession` | `AppRouter`, `LoginPage`, `RegisterPage` | `profiles`, `user_roles`, Supabase Auth | إدارة الجلسات وحظر الأدوار غير المصرحة |
| `src/services/courseService.ts` | `getCourses`, `getLessonById` | `CourseCatalogPage`, `LessonPage` | `courses`, `modules`, `lessons` | التجليد المباشر من الحزم وقواعد البيانات |
| `src/services/assessmentService.ts` | `startAttempt`, `submitAttempt` | `ExamPage`, `ExamResultPage` | `submit-assessment-attempt` Edge Function | التصحيح السيرفراتي السحابي المحمي |
