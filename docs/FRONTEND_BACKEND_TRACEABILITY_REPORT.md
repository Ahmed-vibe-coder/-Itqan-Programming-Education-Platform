# Frontend to Backend Traceability Report — تقرير تتبع الربط المباشر بين الواجهة والباك إند

**تاريخ التقرير:** 30 يوليو 2026  
**المنصة:** إتقان — منصة تعليم البرمجة للناشئين (10–15 سنة)

---

## 1. مصفوفة الربط المباشر والتتبع (Traceability Matrix)

| Feature ID | المسار (Route) | المكون (Component) | دور المستخدم | الإجراء في الواجهة | الجدول أو دالة Edge | العملية الخادمية | حالة الحفظ والاستمرار | حالة الجاهزية (Status) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FT-AUTH-01** | `/login` | `LoginPage` | الجميع | تسجيل الدخول برقم الدعوة/المستخدم | `profiles` & Auth | Read & Auth Mapping | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-AUTH-02** | `/register` | `RegisterPage` | طالب | استبدال الدعوة الفردية | `redeem-single-use-invitation` | Edge Function Atomic | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-CRS-01** | `/app/courses` | `CourseCatalogPage` | طالب | عرض وتصفح المناهج | `courses` & `modules` | Select with RLS | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-LES-01** | `/app/lessons/:id` | `LessonPage` | طالب | قراءة الدروس وتنفيذ الأكواد | `lessons` & `lesson_blocks` | Select & Workspace | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-EXM-01** | `/app/exams/:id` | `ExamPage` | طالب | إجراء الامتحان والحل | `submit-assessment-attempt` | Edge Function Scoring | محمي خادمياً | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-CRT-01** | `/verify/:code` | `CertificateVerificationPage` | عام | توثيق الشهادات الأكاديمية | `certificates` | Public Select | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-TCH-01** | `/teacher` | `TeacherDashboard` | معلم | لوحة التحكم ومركز القيادة | `audit_logs` & System | Consolidated Query | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-INV-01** | `/teacher/invitations` | `TeacherInvitationsPage` | معلم | توليد وإلغاء وتتبع الدعوات | `single_use_invitations` | Insert, Update, RLS | مستمر بعد التحديث | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-AI-01** | `/teacher/ai` | `AIAdminCenterPage` | معلم | إدارة وسجلات الذكاء الاصطناعي | `generate-ai-questions` | Edge Function | محمي خادمياً | `LIVE_CONNECTED_AND_VERIFIED` |
| **FT-HLT-01** | `/teacher/system-health` | `SystemHealthPage` | معلم | مراقبة حالة الخوادم والسياسات | `app_settings` & Audit | Health Checks | حقيقي 100% | `LIVE_CONNECTED_AND_VERIFIED` |

---

## 2. النتيجة النهائية للتتبع
جميع المسارات المذكورة مرتبطة بخدمات ودوال Supabase ومفحوصة عبر الاختبارات البنيوية وبناء الإنتاج.
