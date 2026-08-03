## 2026-08-01T10:05:03Z
You are Worker 1 (Backend & Database Implementer).
Working directory: d:\@vibcoding\ai\.agents\worker_1\
Project root: d:\@vibcoding\ai

Your task is to implement Milestone 2: RLS Policies & Database Security Hardening (Acceptance Criterion 1):
1. Read the audit report and SQL remediation plan at `d:\@vibcoding\ai\.agents\explorer_2\handoff.md` and `d:\@vibcoding\ai\.agents\orchestrator\audit_report.md`.
2. Create new SQL migration file `supabase/migrations/20260801_fix_rls_and_security_hardening.sql`.
3. In this migration file:
   - Harden RPC functions `is_teacher_or_owner` and `normalize_arabic_text` with `SECURITY DEFINER SET search_path = public, pg_temp;`.
   - Enable RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) on all 12 unprotected tables (`student_streaks`, `achievement_definitions`, `student_achievements`, `course_versions`, `lesson_prerequisites`, `learning_activity_events`, `attempt_questions`, `ai_generation_jobs`, `ai_usage_logs`, `help_replies`, `student_mission_progress`, `focus_sessions`).
   - Define complete RLS policies (SELECT, INSERT, UPDATE, DELETE) across all 53 tables for student, teacher, owner, and public roles.
   - Add essential B-tree performance indexes for foreign key lookups.
   - Add automatic `updated_at` trigger function `public.set_updated_at()` and triggers for `profiles`, `lesson_progress`, `code_workspaces`, `student_notes`.
4. Execute `npm run lint` and `npm run test` to verify zero build or test regressions.
5. Document all actions taken, files created, and test outputs in `d:\@vibcoding\ai\.agents\worker_1\handoff.md`.
