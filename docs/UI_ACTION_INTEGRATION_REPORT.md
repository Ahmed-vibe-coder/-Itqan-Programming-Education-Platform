# UI Action Integration Report — تقرير تتبع عناصر التفاعل والأزرار والإجراءات

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. فحص وتدقيق أزرار التفاعل والإجراءات (UI Actions Audit)

| المكون / الشاشة | زر أو عنصر التفاعل | الإجراء المنفذ (Action Handler) | التأثير السيرفراتي المباشر | حالة استجابة الواجهة (Feedback) |
| :--- | :--- | :--- | :--- | :--- |
| `TeacherInvitationsPage` | **زر "توليد كود الدعوة"** | `handleCreateInvitation` | إضافة سجل في `single_use_invitations` | التحديث المباشر للقائمة مع إشعارات النجاح |
| `TeacherInvitationsPage` | **زر "نسخ الكود / رابط التفعيل"** | `handleCopy` | نسخ محلي حافظة المتصفح | تغيير أيقونة الزر مؤقتاً إلى صح خضراء |
| `TeacherInvitationsPage` | **زر "إلغاء الدعوة"** | `handleRevoke` | تحديث حالة الجدول إلى `revoked` | تحويل الشارة إلى اللون الأحمر فميلاً |
| `CertificateManagement` | **زر "إصدار/إلغاء شهادة"** | `handleIssueCertificate` | تحديث سجل جدول `certificates` | تفعيل صفحة التحقق المباشرة `/verify/:code` |
| `TeacherLayout` | **زر "البحث السريع (Ctrl+K)"** | `setCommandMenuOpen(true)` | فتح شاشة `CommandMenuModal` | نافذة منبثقة تفاعلية للبحث السريع |
| `ExamPage` | **زر "تسليم الامتحان"** | `handleSubmitExam` | استدعاء Edge Function للتصحيح | نقل الطالب فوراً إلى صفحة النتيجة وتوليد الشهادة إذا scored >= 80% |
