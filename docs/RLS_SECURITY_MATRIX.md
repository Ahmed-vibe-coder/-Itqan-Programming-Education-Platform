# RLS Security Matrix — مصفوفة سياسات الأمان وتحديد أدوار قاعدة البيانات

**تاريخ التقرير:** 31 يوليو 2026

---

## 1. جدول سياسات RLS واختبارات الأمان (RLS Policies & Tests)

| اسم الجدول (Table) | Select Policy | Insert Policy | Update Policy | Delete Policy | Cross-Tenant Isolation | Test Case | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `single_use_invitations` | Admin Only | Admin Only | Admin or Edge Function Atomic | Admin Only | Yes | Re-use attempt blocked | `VERIFIED` |
| `profiles` | Own Profile or Admin | Own Profile (Sign up) | Own Profile | Admin Only | Yes | Student A cannot edit Student B | `VERIFIED` |
| `user_roles` | Admin or Own Role | System / Admin | Admin Only | Admin Only | Yes | Student cannot escalate to teacher | `VERIFIED` |
| `questions` | Public (Answer Key Excluded) | Admin Only | Admin Only | Admin Only | Yes | Student query strips `correct_answer` | `VERIFIED` |
| `assessments` | Assigned Student or Admin | Admin Only | Admin Only | Admin Only | Yes | Unassigned student blocked | `VERIFIED` |
| `assessment_attempts` | Own Attempt or Admin | Own Attempt | Own Attempt (Active Only) | Admin Only | Yes | Student A cannot view Student B attempts | `VERIFIED` |
| `certificates` | Public Verification by Code | Edge Function Only | Admin Only (Revoke) | Admin Only | Yes | Public verification shows minimal safe data | `VERIFIED` |

---

## 2. النتيجة وتأكيد الأمان
جميع الجداول مفعلة بـ RLS ومجربة بالاختبارات الآلية لمنع الثغرات وحماية أمان النظام.
