# Edge Function Frontend Mapping — خريطة ربط استدعاءات Edge Functions مع الواجهة

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. خريطة الاستدعاء والانتشار (Edge Functions Mapping)

| اسم الدالة (Edge Function Name) | مكون الواجهة المستدعي | آلية الاستدعاء (Trigger Method) | التأمين والتحقق من الهوية | حالة الانتشار (Deployment Status) |
| :--- | :--- | :--- | :--- | :--- |
| `redeem-single-use-invitation` | `RegisterPage.tsx` | `supabase.functions.invoke(...)` | Atomic Single-Use Lock | `DEPLOYED_AND_ACTIVE` |
| `submit-assessment-attempt` | `ExamPage.tsx` | `supabase.functions.invoke(...)` | Server-Side Scoring & Certificate | `DEPLOYED_AND_ACTIVE` |
| `generate-ai-questions` | `AIAssistantPage.tsx` | `supabase.functions.invoke(...)` | `is_teacher_or_owner` Authorization | `DEPLOYED_AND_ACTIVE` |
