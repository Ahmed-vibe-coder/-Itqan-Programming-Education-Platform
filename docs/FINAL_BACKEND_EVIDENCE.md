# Final Backend Evidence — أدلة الخادم والتحقق الفعلي

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. الأدلة الفلية لقواعد البيانات المربوطة (Database Evidence)
- **الجداول الأساسية:** `profiles`, `user_roles`, `single_use_invitations`, `invitation_course_assignments`, `courses`, `modules`, `lessons`, `questions`, `assessments`, `assessment_attempts`, `attempt_questions`, `attempt_answers`, `ai_generation_jobs`, `approved_ai_explanations`, `ai_usage_logs`, `remediation_plans`.
- **القيود الذرية للدعوات:** `max_uses = 1` محدد ومفروض بقاعدة البيانات، و `status IN ('active', 'used', 'expired', 'revoked')`.
- **وظيفة المطابقة الاسمية العربية:** الدالة `public.normalize_arabic_text(input_text)` تقوم بتنظيف وتوحيد الأحرف العربية وتصفية الحركات والمسافات الزائدة.

---

## 2. دوال الخادم سريعة التنفيذ (Edge Functions Evidence)
- `redeem-single-use-invitation`: تقع في `supabase/functions/redeem-single-use-invitation/index.ts`. تضمن عمليات تخصيص الدعوة الذرية ومطابقة الاسم وتخزين حساب الطالب بدون تكرار أو تجاوز حد الاستخدام الواحد.
- `generate-ai-questions`: تقع في `supabase/functions/generate-ai-questions/index.ts`. تضمن فحص صلاحيات المعلم وتصحيح صيغ JSON وحماية المفاتيح وحفظ الأسئلة كمسودات (Drafts) فقط.
- `submit-assessment-attempt`: تقع في `supabase/functions/submit-assessment-attempt/index.ts`. تتكفل بحساب النقاط والتصحيح الآلي السيرفراتي دون الاعتماد على نتائج المتصفح.
