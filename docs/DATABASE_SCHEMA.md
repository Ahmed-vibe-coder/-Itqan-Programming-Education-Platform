# Database Schema Specification — نواة كود (nawa-code)

## 1. Domain Tables Overview

### Identity & Access
- `profiles`: `id (uuid, FK auth.users)`, `full_name`, `username`, `avatar_url`, `age`, `created_at`, `updated_at`
- `user_roles`: `id`, `user_id`, `role ('owner' | 'teacher' | 'student')`, `created_at`
- `invitations`: `id`, `code`, `group_id`, `created_by`, `max_uses`, `used_count`, `expires_at`, `is_active`, `created_at`
- `app_settings`: `key (PK)`, `value (jsonb)`, `updated_by`, `updated_at`
- `audit_logs`: `id`, `user_id`, `action`, `entity_type`, `entity_id`, `metadata (jsonb)`, `created_at`

### Students & Groups
- `groups`: `id`, `name`, `code`, `description`, `is_active`, `leaderboard_enabled`, `created_at`
- `group_members`: `id`, `group_id`, `student_id`, `joined_at`
- `course_assignments`: `id`, `course_id`, `group_id`, `student_id`, `assigned_at`
- `teacher_student_notes`: `id`, `teacher_id`, `student_id`, `note`, `created_at`

### Learning Content
- `courses`: `id`, `slug`, `title_ar`, `description_ar`, `subject ('html'|'css'|'js')`, `status ('draft'|'published'|'archived')`, `estimated_hours`, `order_index`, `created_at`
- `modules`: `id`, `course_id`, `title_ar`, `description_ar`, `order_index`, `created_at`
- `lessons`: `id`, `module_id`, `title_ar`, `slug`, `estimated_minutes`, `order_index`, `status`, `version`, `created_at`
- `lesson_blocks`: `id`, `lesson_id`, `block_type`, `content (jsonb)`, `order_index`

### Learning Activity
- `lesson_progress`: `id`, `user_id`, `lesson_id`, `status ('locked'|'available'|'in_progress'|'awaiting_mastery'|'completed')`, `reading_progress`, `mastery_passed_at`, `completed_at`, `updated_at`
- `practice_activities`: `id`, `lesson_id`, `title_ar`, `instructions_ar`, `starter_code`, `solution_code`, `validation_rules (jsonb)`
- `code_workspaces`: `id`, `user_id`, `lesson_id`, `html_code`, `css_code`, `js_code`, `updated_at`
- `bookmarks`: `id`, `user_id`, `lesson_id`, `created_at`
- `student_notes`: `id`, `user_id`, `lesson_id`, `content`, `created_at`, `updated_at`

### Assessment System
- `questions`: `id`, `type`, `prompt_ar`, `supporting_text_ar`, `code_snippet`, `options (jsonb)`, `correct_answer (jsonb)`, `explanation_ar`, `points`, `difficulty`, `status`
- `assessments`: `id`, `course_id`, `module_id`, `title_ar`, `type ('practice'|'lesson_mastery'|'module_quiz'|'course_exam'|'final_exam')`, `time_limit_minutes`, `passing_score`, `is_published`
- `assessment_questions`: `id`, `assessment_id`, `question_id`, `order_index`, `points`
- `assessment_attempts`: `id`, `assessment_id`, `user_id`, `status ('in_progress'|'submitted'|'graded')`, `score`, `max_score`, `started_at`, `submitted_at`, `graded_at`
- `attempt_answers`: `id`, `attempt_id`, `question_id`, `student_answer (jsonb)`, `is_correct`, `points_awarded`, `teacher_feedback`

### Gamification & Activity
- `xp_transactions`: `id`, `user_id`, `points`, `event_type`, `source_id`, `idempotency_key`, `created_at`
- `student_streaks`: `user_id (PK)`, `current_streak`, `longest_streak`, `last_activity_date`
- `achievement_definitions`: `id`, `code`, `title_ar`, `description_ar`, `badge_icon`, `xp_reward`
- `student_achievements`: `id`, `user_id`, `achievement_id`, `unlocked_at`

### AI & Certificates Foundation
- `ai_generation_jobs`: `id`, `teacher_id`, `job_type`, `prompt_summary`, `response_payload (jsonb)`, `status`, `created_at`
- `certificates`: `id`, `user_id`, `course_id`, `certificate_number`, `verification_code`, `status`, `issued_at`
