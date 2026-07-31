# Edge Functions Audit — تقرير تدقيق واختبار دوال الـ Edge السحابية

**تاريخ التقرير:** 31 يوليو 2026

---

## 1. حصر وتأمين دوال الخادم السحابي (Edge Functions Audit)

| Edge Function Name | Source Path | Target Purpose | Auth Requirement | Validation | Idempotency | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `redeem-single-use-invitation` | `supabase/functions/redeem-single-use-invitation/index.ts` | تفعيل الدعوات وتخصيص الحسابات ذرياً | Public with Invitation Code & Name Match | Full Name & Code | Enforced (`max_uses = 1`) | `DEPLOYED_AND_VERIFIED` |
| `submit-assessment-attempt` | `supabase/functions/submit-assessment-attempt/index.ts` | التصحيح الآلي السيرفراتي وإصدار الشهادات | Authenticated Student | Answer Format & Time Check | Enforced (Single Attempt Submission) | `DEPLOYED_AND_VERIFIED` |
| `generate-ai-questions` | `supabase/functions/generate-ai-questions/index.ts` | توليد مسودات الأسئلة بالذكاء الاصطناعي | Authenticated Teacher (`is_teacher_or_owner`) | JSON Schema Strict Parse | Draft-Only Output | `DEPLOYED_AND_VERIFIED` |

---

## 2. النتيجة وتأكيد المعالجة السيرفرية
جميع الدوال السحابية مفحوصة ومؤمنة وتعمل على خادم Deno السحابي لتأمين المنظومة.
