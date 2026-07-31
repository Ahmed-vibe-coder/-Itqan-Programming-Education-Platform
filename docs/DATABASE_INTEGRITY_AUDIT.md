# Database Integrity Audit — تقرير سلامة وقيود قاعدة البيانات PostgreSQL

**تاريخ التقرير:** 31 يوليو 2026

---

## 1. قيود السلامة والعلاقات (Database Constraints & Foreign Keys)

| Table Name | Primary Key | Foreign Keys & Cascade Rules | Check Constraints | Unique Constraints | Indexes | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `single_use_invitations` | `id` (UUID) | `used_by` -> `profiles(id)` ON DELETE SET NULL | `used_count <= max_uses`, `max_uses = 1` | `code` UNIQUE | `idx_inv_code`, `idx_inv_status` | `VERIFIED` |
| `profiles` | `id` (UUID) | `id` -> `auth.users(id)` ON DELETE CASCADE | `age >= 6 AND age <= 99` | `username` UNIQUE | `idx_profiles_username` | `VERIFIED` |
| `certificates` | `id` (UUID) | `student_id` -> `profiles(id)`, `course_id` -> `courses(id)` | `final_score >= 80` | `verification_code` UNIQUE, `certificate_number` UNIQUE | `idx_cert_verify_code` | `VERIFIED` |
| `assessment_attempts` | `id` (UUID) | `student_id` -> `profiles(id)`, `assessment_id` -> `assessments(id)` | `score_percentage >= 0 AND score_percentage <= 100` | None | `idx_attempts_student_exam` | `VERIFIED` |

---

## 2. النتيجة وتأكيد السلامة
جميع القيود مسجلة على مستوى قاعدة البيانات PostgreSQL لضمان سلامة البيانات ومنع إدخال أي قيم تالفة أو مكررة.
