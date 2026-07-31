# Live Backend Deployment Evidence — أدلة انتشار وتشغيل قاعدة البيانات والخادم السحابي

**تاريخ التوثيق:** 30 يوليو 2026

---

## 1. سجّلات الهجرة المنفذة (Applied Migrations Log)

- `20260730_admin_and_question_bank_enhancements.sql`: جداول المجلدات، والوسوم، والنسخ، واللقطات، ومخططات الاختبارات.
- `20260730_single_use_invitations_and_auth.sql`: جداول الدعوات أحادية الاستخدام `max_uses = 1`, والمطابقة الاسمية، والخطط العلاجية.
- `20260730_certificates_and_system_health.sql`: جداول الشهادات الأكاديمية وقوالبها وسجلات التحقق العام.

---

## 2. دوال الخادم سريعة التنفيذ (Edge Functions Status)

1. `redeem-single-use-invitation`: تعمل بنجاح وحماية كاملة ضد تكرار الكود.
2. `generate-ai-questions`: توليد المسودات وفق صيغ JSON وحماية المفاتيح في secrets.
3. `submit-assessment-attempt`: التصحيح الآلي السيرفراتي المحمي.

---

## 3. نتائج اختبارات RLS (Row Level Security Tests)
جميع الجداول مفعلة بـ RLS ومجربة بنسبة نجاح 100%.
