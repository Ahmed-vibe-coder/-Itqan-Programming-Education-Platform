# RLS Live Test Matrix — مصفوفة اختبارات سياسات أمان قاعدة البيانات RLS

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. نتائج فحص واختبار RLS لكل جدول (RLS Test Cases)

| اسم الجدول | العملية المفحوصة | الدور المستهدف | القراءة / الكتابة المتوقعة | النتيجة الحقيقية | حالة الأمان (Pass/Fail) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `single_use_invitations` | Select / Update | زائر / طالب | حظر مباشر | تم الحظر بنجاح | `PASSED` |
| `single_use_invitations` | Select / Update | معلم | سماح كامل | تم السماح | `PASSED` |
| `questions` (الإجابة النموذجية) | Select `correct_answer` | طالب | حظر واستبعاد الإجابة | تم الاستبعاد خادمياً | `PASSED` |
| `assessment_attempts` | Select | طالب A على الطالب B | حظر (0 rows returned) | تم الحجب بنجاح | `PASSED` |
| `certificates` | Select عبر الكود | عام | سماح لعرض التوثيق فقط | تم السماح للشهادة المحددة | `PASSED` |
