-- WARNING: DESTRUCTIVE RESET. Run only on a new/throwaway project or after a backup.
BEGIN;

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT CREATE ON SCHEMA public TO postgres;

-- ==========================================
-- FILE: 20260730_init_schema.sql
-- ==========================================

-- Enable UUID extension
-- PostgreSQL/Supabase provides built-in gen_random_uuid(); no UUID extension is required.

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  age INT CHECK (age >= 8 AND age <= 99),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE public.user_role_enum AS ENUM ('owner', 'teacher', 'student');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role_enum NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 2. GROUPS & INVITATIONS
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  leaderboard_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES & LESSONS
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.course_subject AS ENUM ('html', 'css', 'js');

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  subject public.course_subject NOT NULL,
  status public.content_status DEFAULT 'draft',
  estimated_hours INT DEFAULT 5,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  estimated_minutes INT DEFAULT 15,
  order_index INT NOT NULL,
  status public.content_status DEFAULT 'draft',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

CREATE TABLE public.lesson_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INT NOT NULL
);

-- 4. PROGRESS & WORKSPACES
CREATE TYPE public.progress_status AS ENUM ('locked', 'available', 'in_progress', 'awaiting_mastery', 'completed');

CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status public.progress_status DEFAULT 'locked',
  reading_progress INT DEFAULT 0,
  mastery_passed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE public.code_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  html_code TEXT DEFAULT '',
  css_code TEXT DEFAULT '',
  js_code TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 5. ASSESSMENT SYSTEM
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  prompt_ar TEXT NOT NULL,
  supporting_text_ar TEXT,
  code_snippet TEXT,
  options JSONB,
  correct_answer JSONB NOT NULL, -- Sensitive: restricted via RLS
  explanation_ar TEXT,
  points INT DEFAULT 10,
  difficulty TEXT DEFAULT 'medium',
  status public.content_status DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  type TEXT NOT NULL,
  time_limit_minutes INT,
  passing_score INT DEFAULT 70,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  section_id UUID,
  order_index INT NOT NULL DEFAULT 1 CHECK (order_index > 0),
  points_override INT CHECK (points_override IS NULL OR points_override > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assessment_id, question_id)
);

CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress',
  score INT,
  max_score INT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ
);

-- 6. GAMIFICATION
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT NOT NULL,
  event_type TEXT NOT NULL,
  source_id TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.student_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 1,
  longest_streak INT DEFAULT 1,
  last_activity_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  xp_reward INT DEFAULT 50
);

CREATE TABLE public.student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- RLS POLICIES ENABLED ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- Helper RLS Check
CREATE OR REPLACE FUNCTION public.is_teacher_or_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role IN ('owner', 'teacher')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- FILE: 20260730_complete_schema.sql
-- ==========================================

-- COMPLETE DATABASE MIGRATION FOR NAWA-CODE PLATFORM
-- Covers all 35+ domain tables, constraints, indexes, RLS policies and Edge RPC triggers.

-- 1. EXTENSIONS
-- PostgreSQL/Supabase provides built-in gen_random_uuid(); no UUID extension is required.

-- 2. APP SETTINGS & FEATURE FLAGS
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.feature_flags (key, is_enabled, description) VALUES
('certificates_enabled', false, 'Enable student certificate eligibility and issuance'),
('ai_tools_enabled', true, 'Enable AI-assisted question draft generation for teachers')
ON CONFLICT (key) DO NOTHING;

-- 3. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADDITIONAL STUDENT & TEACHER TABLES
CREATE TABLE IF NOT EXISTS public.teacher_student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSE & LESSON VERSIONS AND PREREQUISITES
CREATE TABLE IF NOT EXISTS public.course_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  prerequisite_lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  UNIQUE(lesson_id, prerequisite_lesson_id)
);

-- 6. PRACTICE ACTIVITIES & ATTEMPTS
CREATE TABLE IF NOT EXISTS public.practice_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  instructions_ar TEXT NOT NULL,
  starter_html TEXT DEFAULT '',
  starter_css TEXT DEFAULT '',
  starter_js TEXT DEFAULT '',
  solution_code TEXT,
  validation_rules JSONB,
  points INT DEFAULT 10,
  order_index INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.practice_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES public.practice_activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  html_submitted TEXT,
  css_submitted TEXT,
  js_submitted TEXT,
  is_passed BOOLEAN DEFAULT FALSE,
  attempts_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BOOKMARKS & STUDENT NOTES
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 8. LEARNING ACTIVITY & SMART REVIEW RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.learning_activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  reason_ar TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ASSESSMENT QUESTION SNAPSHOTS & GRADING RECORDS
CREATE TABLE IF NOT EXISTS public.attempt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  type_snapshot TEXT NOT NULL DEFAULT 'mcq',
  prompt_snapshot TEXT NOT NULL DEFAULT '',
  supporting_text_snapshot TEXT,
  code_snippet_snapshot TEXT,
  options_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  points INT NOT NULL DEFAULT 10 CHECK (points > 0),
  UNIQUE (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  student_answer JSONB NOT NULL,
  is_correct BOOLEAN,
  points_awarded INT DEFAULT 0,
  teacher_feedback TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.grading_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score_given INT NOT NULL,
  max_score INT NOT NULL,
  rubric_feedback TEXT,
  ai_suggestion JSONB,
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- 10. ANNOUNCEMENTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  body_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  body_ar TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI GENERATION JOBS & USAGE LOGS
CREATE TABLE IF NOT EXISTS public.ai_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  prompt_summary TEXT NOT NULL,
  response_payload JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INT DEFAULT 0,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CERTIFICATES FOUNDATION (unified schema; fixes duplicate incompatible definitions)
CREATE TABLE IF NOT EXISTS public.certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  header_ar TEXT NOT NULL,
  body_template_ar TEXT NOT NULL,
  background_image_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Legacy alias retained for older frontend queries.
  user_id UUID GENERATED ALWAYS AS (student_id) STORED,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.certificate_templates(id) ON DELETE SET NULL,
  student_full_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  final_score INT NOT NULL DEFAULT 100 CHECK (final_score BETWEEN 0 AND 100),
  -- Legacy alias retained for older frontend queries.
  score_snapshot INT GENERATED ALWAYS AS (final_score) STORED,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  revoked_reason TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ENABLE RLS ON ALL NEW TABLES
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 13. RLS SECURITY POLICIES FOR STUDENT DATA ISOLATION
CREATE POLICY "Students read own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students write own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Students read own notes" ON public.student_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students write own notes" ON public.student_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students update own notes" ON public.student_notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public read feature flags" ON public.feature_flags FOR SELECT USING (true);


-- ==========================================
-- FILE: 20260730_enhancements_schema.sql
-- ==========================================

-- ENHANCEMENT SCHEMA MIGRATION FOR NAWA-CODE PLATFORM
-- Adds Onboarding, Placement, Skill Maps, Mistake Notebook, Spaced Review, Projects, Help Requests, Missions

-- 1. STUDENT ONBOARDING & PLACEMENT
CREATE TABLE IF NOT EXISTS public.student_onboarding (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  prior_experience TEXT DEFAULT 'none',
  selected_goal TEXT,
  placement_status TEXT DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.placement_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  score INT NOT NULL,
  detected_skills JSONB NOT NULL,
  recommendation_ar TEXT NOT NULL,
  recommended_starting_module_id UUID REFERENCES public.modules(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILL MAP & MASTERY ENGINE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  order_index INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.student_skill_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, learning, needs_review, mastered
  mastery_percentage INT DEFAULT 0,
  last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- 3. MISTAKE NOTEBOOK & SPACED REVIEW
CREATE TABLE IF NOT EXISTS public.mistake_notebook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_ar TEXT NOT NULL,
  source_type TEXT NOT NULL, -- mastery, exam, practice
  source_id TEXT,
  question_prompt TEXT NOT NULL,
  student_answer TEXT,
  explanation_ar TEXT NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id),
  repetitions INT DEFAULT 1,
  review_status TEXT DEFAULT 'unreviewed', -- unreviewed, reviewing, mastered, needs_help
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  concept_code TEXT NOT NULL,
  interval_days INT DEFAULT 1,
  due_date DATE NOT NULL,
  repetition_count INT DEFAULT 0,
  ease_factor FLOAT DEFAULT 2.5,
  status TEXT DEFAULT 'due', -- due, completed, overdue
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS & PORTFOLIO
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  starter_code JSONB,
  milestones JSONB NOT NULL,
  rubric JSONB,
  order_index INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submitted_html TEXT,
  submitted_css TEXT,
  submitted_js TEXT,
  status TEXT DEFAULT 'in_progress', -- in_progress, submitted, needs_changes, approved
  teacher_feedback TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_submission_id UUID REFERENCES public.project_submissions(id),
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  is_approved_by_teacher BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HELP REQUESTS ("ASK THE TEACHER")
CREATE TABLE IF NOT EXISTS public.help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id),
  code_snapshot JSONB,
  message_text TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- new, viewed, answered, resolved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.help_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  attached_lesson_id UUID REFERENCES public.lessons(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEEKLY MISSIONS & FOCUS SESSIONS
CREATE TABLE IF NOT EXISTS public.weekly_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  target_count INT DEFAULT 3,
  xp_reward INT DEFAULT 50,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.weekly_missions(id) ON DELETE CASCADE,
  current_count INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, mission_id)
);

CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS POLICIES FOR NEW TABLES
ALTER TABLE public.student_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_notebook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own onboarding" ON public.student_onboarding FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Students read own placement" ON public.placement_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students read own skill mastery" ON public.student_skill_mastery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students manage own mistake notebook" ON public.mistake_notebook_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Students manage own review schedules" ON public.review_schedules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Students manage own project submissions" ON public.project_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Students manage own help requests" ON public.help_requests FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- FILE: 20260730_admin_and_question_bank_enhancements.sql
-- ==========================================

-- ADMIN, QUESTION BANK, EXAM BLUEPRINTS & CONTENT CMS MIGRATION
-- Adds tables, indexes, constraints, RLS policies for complete question bank, exam builder, and CMS.

-- 1. QUESTION FOLDERS & TAGS
CREATE TABLE IF NOT EXISTS public.question_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  parent_id UUID REFERENCES public.question_folders(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.question_tags(id) ON DELETE CASCADE,
  UNIQUE(question_id, tag_id)
);

-- 2. QUESTION VERSIONS & STATISTICS
CREATE TABLE IF NOT EXISTS public.question_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.question_statistics (
  question_id UUID PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  attempts_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  incorrect_count INT DEFAULT 0,
  skip_count INT DEFAULT 0,
  avg_time_seconds INT DEFAULT 0,
  most_common_wrong_option JSONB,
  hint_usage_count INT DEFAULT 0,
  last_evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI GENERATION & SIMILARITY MATCHES
CREATE TABLE IF NOT EXISTS public.question_similarity_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  matched_question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  similarity_score FLOAT NOT NULL,
  match_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXAM BLUEPRINTS & SECTIONS & POOLS
CREATE TABLE IF NOT EXISTS public.exam_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  description_ar TEXT,
  total_questions INT NOT NULL DEFAULT 10,
  total_points INT NOT NULL DEFAULT 100,
  estimated_minutes INT DEFAULT 30,
  difficulty_distribution JSONB NOT NULL, -- e.g. {"easy": 40, "medium": 40, "hard": 20}
  type_distribution JSONB NOT NULL,
  topic_distribution JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  instructions_ar TEXT,
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Connect manual assessment questions to optional sections after sections are created.
ALTER TABLE public.assessment_questions
  ADD CONSTRAINT assessment_questions_section_id_fkey
  FOREIGN KEY (section_id) REFERENCES public.assessment_sections(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.assessment_question_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.assessment_sections(id) ON DELETE SET NULL,
  pool_name_ar TEXT NOT NULL,
  select_count INT NOT NULL DEFAULT 1,
  filter_criteria JSONB NOT NULL, -- e.g. {"module_id": "...", "difficulty": "easy"}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTENT SCHEDULES & VALIDATION REPORTS
CREATE TABLE IF NOT EXISTS public.content_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'lesson', 'assessment', 'project'
  entity_id UUID NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  scheduled_publish_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'published', 'cancelled'
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_validation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE,
  errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  validated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR NEW TABLES
ALTER TABLE public.question_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_similarity_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_question_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_validation_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read question tags" ON public.question_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teacher full access question folders" ON public.question_folders FOR ALL USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teacher full access question tags" ON public.question_tags FOR ALL USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teacher full access blueprints" ON public.exam_blueprints FOR ALL USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teacher full access schedules" ON public.content_schedules FOR ALL USING (public.is_teacher_or_owner(auth.uid()));


-- ==========================================
-- FILE: 20260730_single_use_invitations_and_auth.sql
-- ==========================================

-- SINGLE-USE INVITATION & USERNAME AUTH MIGRATION
-- Enforces max_uses = 1, atomic redemption, name normalization, and security constraints.

-- 1. ARABIC TEXT NORMALIZATION FUNCTION
CREATE OR REPLACE FUNCTION public.normalize_arabic_text(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  IF input_text IS NULL THEN
    RETURN '';
  END IF;

  result := LOWER(TRIM(input_text));
  -- Normalize Arabic letters: Alif variants to Alif, Ya/Alef Maqsura, Ta Marbouta to Ha
  result := REGEXP_REPLACE(result, '[أإآآ]', 'ا', 'g');
  result := REGEXP_REPLACE(result, '[ى]', 'ي', 'g');
  result := REGEXP_REPLACE(result, '[ة]', 'ه', 'g');
  -- Remove diacritics (Tashkeel)
  result := REGEXP_REPLACE(result, '[ً-ْـ]', '', 'g');
  -- Collapse multiple spaces
  result := REGEXP_REPLACE(result, '\s+', ' ', 'g');

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. ENHANCE INVITATIONS TABLE WITH SINGLE-USE GUARANTEES
CREATE TABLE IF NOT EXISTS public.single_use_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  expected_full_name TEXT NOT NULL,
  normalized_expected_name TEXT NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  max_uses INT NOT NULL DEFAULT 1 CHECK (max_uses = 1),
  used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0 AND used_count <= 1),
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'revoked')),
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invitation_course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.single_use_invitations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  UNIQUE(invitation_id, course_id)
);

-- 3. APPROVED AI EXPLANATIONS & REMEDIATION PLANS
CREATE TABLE IF NOT EXISTS public.approved_ai_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_code TEXT NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  explanation_ar TEXT NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.remediation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  weak_concepts JSONB NOT NULL,
  recommended_lesson_ids JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR INVITATIONS & REMEDIATION
ALTER TABLE public.single_use_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_ai_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remediation_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers full access invitations" ON public.single_use_invitations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Students read own remediation" ON public.remediation_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read approved explanations" ON public.approved_ai_explanations FOR SELECT TO authenticated USING (is_approved = true OR public.is_teacher_or_owner(auth.uid()));


-- ==========================================
-- FILE: 20260730_certificates_and_system_health.sql
-- ==========================================

-- CERTIFICATES AND SYSTEM HEALTH MIGRATION

-- 1. CERTIFICATE VERIFICATION LOGS (certificate tables already created above)
CREATE TABLE IF NOT EXISTS public.certificate_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- RLS POLICIES FOR CERTIFICATES
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own active certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers full access certificates" ON public.certificates FOR ALL USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage templates" ON public.certificate_templates FOR ALL USING (public.is_teacher_or_owner(auth.uid()));


-- ==========================================
-- FILE: 20260801_fix_rls_and_security_hardening.sql
-- ==========================================

-- MIGRATION: 20260801_fix_rls_and_security_hardening.sql
-- Milestone 2: RLS Policies & Database Security Hardening (Acceptance Criterion 1)
-- Fixes RPC function security, enables RLS on all 12 unprotected tables, defines complete RLS policies across all 53 tables, adds B-tree performance indexes, and configures automatic updated_at triggers.

-- ==========================================
-- 1. HARDEN RPC PROCEDURES
-- ==========================================
CREATE OR REPLACE FUNCTION public.is_teacher_or_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role IN ('owner', 'teacher')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.group_members WHERE group_id = p_group_id AND student_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.normalize_arabic_text(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  IF input_text IS NULL THEN
    RETURN '';
  END IF;

  result := LOWER(TRIM(input_text));
  result := REGEXP_REPLACE(result, '[أإآآ]', 'ا', 'g');
  result := REGEXP_REPLACE(result, '[ى]', 'ي', 'g');
  result := REGEXP_REPLACE(result, '[ة]', 'ه', 'g');
  result := REGEXP_REPLACE(result, '[ً-ْـ]', '', 'g');
  result := REGEXP_REPLACE(result, '\s+', ' ', 'g');

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- ==========================================
-- 2. ENABLE RLS ON ALL 12 UNPROTECTED TABLES
-- ==========================================
ALTER TABLE public.student_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. DEFINE COMPLETE RLS POLICIES ACROSS ALL TABLES
-- ==========================================

-- Profiles & User Roles
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Teachers manage profiles" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage profiles" ON public.profiles FOR DELETE USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Users read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Teachers/Owners manage roles" ON public.user_roles;
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers/Owners manage roles" ON public.user_roles FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Groups, Members, Invitations
DROP POLICY IF EXISTS "Public read active groups" ON public.groups;
DROP POLICY IF EXISTS "Teachers manage groups" ON public.groups;
CREATE POLICY "Public read active groups" ON public.groups FOR SELECT TO authenticated USING (is_active = true OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage groups" ON public.groups FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Members/Teachers read group members" ON public.group_members;
DROP POLICY IF EXISTS "Students join group" ON public.group_members;
DROP POLICY IF EXISTS "Teachers manage group members" ON public.group_members;
CREATE POLICY "Members/Teachers read group members" ON public.group_members FOR SELECT USING (
  student_id = auth.uid() OR public.is_teacher_or_owner(auth.uid()) OR 
  public.is_group_member(group_id, auth.uid())
);
CREATE POLICY "Students join group" ON public.group_members FOR INSERT WITH CHECK (student_id = auth.uid() OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage group members" ON public.group_members FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read active invitations" ON public.invitations;
DROP POLICY IF EXISTS "Teachers read invitations" ON public.invitations;
DROP POLICY IF EXISTS "Teachers manage invitations" ON public.invitations;
CREATE POLICY "Teachers read invitations" ON public.invitations FOR SELECT TO authenticated USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage invitations" ON public.invitations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Courses, Modules, Lessons, Lesson Blocks
DROP POLICY IF EXISTS "Public read published courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers manage courses" ON public.courses;
CREATE POLICY "Public read published courses" ON public.courses FOR SELECT TO authenticated USING (status = 'published' OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage courses" ON public.courses FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read modules" ON public.modules;
DROP POLICY IF EXISTS "Teachers manage modules" ON public.modules;
CREATE POLICY "Public read modules" ON public.modules FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = modules.course_id AND c.status = 'published')
  OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage modules" ON public.modules FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers manage lessons" ON public.lessons;
CREATE POLICY "Public read published lessons" ON public.lessons FOR SELECT TO authenticated USING (
  (status = 'published' AND EXISTS (
    SELECT 1 FROM public.modules m JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = lessons.module_id AND c.status = 'published'
  )) OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage lessons" ON public.lessons FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read lesson blocks" ON public.lesson_blocks;
DROP POLICY IF EXISTS "Teachers manage lesson blocks" ON public.lesson_blocks;
CREATE POLICY "Public read lesson blocks" ON public.lesson_blocks FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    JOIN public.courses c ON c.id = m.course_id
    WHERE l.id = lesson_blocks.lesson_id AND l.status = 'published' AND c.status = 'published'
  ) OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage lesson blocks" ON public.lesson_blocks FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Lesson Progress & Code Workspaces
DROP POLICY IF EXISTS "Students manage own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Teachers read student progress" ON public.lesson_progress;
CREATE POLICY "Students manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage own workspaces" ON public.code_workspaces;
DROP POLICY IF EXISTS "Teachers read student workspaces" ON public.code_workspaces;
CREATE POLICY "Students manage own workspaces" ON public.code_workspaces FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Questions & Assessments & Attempts
DROP POLICY IF EXISTS "Students read published questions" ON public.questions;
DROP POLICY IF EXISTS "Teachers manage questions" ON public.questions;
CREATE POLICY "Teachers manage questions" ON public.questions FOR ALL TO authenticated USING (public.is_teacher_or_owner(auth.uid())) WITH CHECK (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read published assessments" ON public.assessments;
DROP POLICY IF EXISTS "Teachers manage assessments" ON public.assessments;
CREATE POLICY "Students read published assessments" ON public.assessments FOR SELECT TO authenticated USING (is_published = true OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage assessments" ON public.assessments FOR ALL USING (public.is_teacher_or_owner(auth.uid())) WITH CHECK (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read assessment questions" ON public.assessment_questions;
DROP POLICY IF EXISTS "Teachers manage assessment questions" ON public.assessment_questions;
CREATE POLICY "Students read assessment questions" ON public.assessment_questions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.assessments a WHERE a.id = assessment_questions.assessment_id AND a.is_published = true)
  OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage assessment questions" ON public.assessment_questions FOR ALL TO authenticated USING (public.is_teacher_or_owner(auth.uid())) WITH CHECK (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage own attempts" ON public.assessment_attempts;
DROP POLICY IF EXISTS "Teachers read all attempts" ON public.assessment_attempts;
CREATE POLICY "Students manage own attempts" ON public.assessment_attempts FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage own attempt answers" ON public.attempt_answers;
DROP POLICY IF EXISTS "Teachers read attempt answers" ON public.attempt_answers;
CREATE POLICY "Students manage own attempt answers" ON public.attempt_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.assessment_attempts a WHERE a.id = attempt_answers.attempt_id AND a.user_id = auth.uid()) OR 
  public.is_teacher_or_owner(auth.uid())
);

DROP POLICY IF EXISTS "Students read attempt questions" ON public.attempt_questions;
DROP POLICY IF EXISTS "Teachers manage attempt questions" ON public.attempt_questions;
CREATE POLICY "Students read attempt questions" ON public.attempt_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assessment_attempts a WHERE a.id = attempt_questions.attempt_id AND a.user_id = auth.uid()) OR
  public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage attempt questions" ON public.attempt_questions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Gamification (XP, Streaks, Achievements)
DROP POLICY IF EXISTS "Students read own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Students manage XP transactions" ON public.xp_transactions;
CREATE POLICY "Students manage XP transactions" ON public.xp_transactions FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read/update own streak" ON public.student_streaks;
CREATE POLICY "Students read/update own streak" ON public.student_streaks FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read achievement definitions" ON public.achievement_definitions;
DROP POLICY IF EXISTS "Teachers manage achievement definitions" ON public.achievement_definitions;
CREATE POLICY "Public read achievement definitions" ON public.achievement_definitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers manage achievement definitions" ON public.achievement_definitions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own achievements" ON public.student_achievements;
DROP POLICY IF EXISTS "Students manage achievements" ON public.student_achievements;
CREATE POLICY "Students manage achievements" ON public.student_achievements FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- App Settings, Feature Flags, Audit Logs
DROP POLICY IF EXISTS "Public read app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Authenticated read app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Teachers manage app settings" ON public.app_settings;
CREATE POLICY "Authenticated read app settings" ON public.app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers manage app settings" ON public.app_settings FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Teachers manage feature flags" ON public.feature_flags;
CREATE POLICY "Public read feature flags" ON public.feature_flags FOR SELECT USING (true);
CREATE POLICY "Teachers manage feature flags" ON public.feature_flags FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Users view own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Teachers view audit logs" ON public.audit_logs;
CREATE POLICY "Users view own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers view audit logs" ON public.audit_logs FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Teacher Notes & Assignments
DROP POLICY IF EXISTS "Teachers manage teacher student notes" ON public.teacher_student_notes;
CREATE POLICY "Teachers manage teacher student notes" ON public.teacher_student_notes FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read course assignments" ON public.course_assignments;
DROP POLICY IF EXISTS "Teachers manage course assignments" ON public.course_assignments;
CREATE POLICY "Students read course assignments" ON public.course_assignments FOR SELECT USING (student_id = auth.uid() OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage course assignments" ON public.course_assignments FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read assessment assignments" ON public.assessment_assignments;
DROP POLICY IF EXISTS "Teachers manage assessment assignments" ON public.assessment_assignments;
CREATE POLICY "Students read assessment assignments" ON public.assessment_assignments FOR SELECT USING (student_id = auth.uid() OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage assessment assignments" ON public.assessment_assignments FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Course Versions & Lesson Prerequisites
DROP POLICY IF EXISTS "Teachers manage course versions" ON public.course_versions;
CREATE POLICY "Teachers manage course versions" ON public.course_versions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read lesson prerequisites" ON public.lesson_prerequisites;
DROP POLICY IF EXISTS "Teachers manage lesson prerequisites" ON public.lesson_prerequisites;
CREATE POLICY "Public read lesson prerequisites" ON public.lesson_prerequisites FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_prerequisites.lesson_id AND l.status = 'published')
  OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage lesson prerequisites" ON public.lesson_prerequisites FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Practice Activities & Practice Attempts
DROP POLICY IF EXISTS "Public read practice activities" ON public.practice_activities;
DROP POLICY IF EXISTS "Teachers manage practice activities" ON public.practice_activities;
CREATE POLICY "Public read practice activities" ON public.practice_activities FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = practice_activities.lesson_id AND l.status = 'published')
  OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage practice activities" ON public.practice_activities FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage practice attempts" ON public.practice_attempts;
CREATE POLICY "Students manage practice attempts" ON public.practice_attempts FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Bookmarks & Student Notes
DROP POLICY IF EXISTS "Students read own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Students write own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Students delete own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Students manage bookmarks" ON public.bookmarks;
CREATE POLICY "Students manage bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own notes" ON public.student_notes;
DROP POLICY IF EXISTS "Students write own notes" ON public.student_notes;
DROP POLICY IF EXISTS "Students update own notes" ON public.student_notes;
DROP POLICY IF EXISTS "Students manage notes" ON public.student_notes;
CREATE POLICY "Students manage notes" ON public.student_notes FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Learning Activity Events & Review Recommendations
DROP POLICY IF EXISTS "Students manage learning activity events" ON public.learning_activity_events;
CREATE POLICY "Students manage learning activity events" ON public.learning_activity_events FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage review recommendations" ON public.review_recommendations;
CREATE POLICY "Students manage review recommendations" ON public.review_recommendations FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Grading Records & Announcements & Notifications
DROP POLICY IF EXISTS "Teachers manage grading records" ON public.grading_records;
CREATE POLICY "Teachers manage grading records" ON public.grading_records FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read announcements" ON public.announcements;
DROP POLICY IF EXISTS "Teachers manage announcements" ON public.announcements;
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT TO authenticated USING (
  group_id IS NULL OR public.is_group_member(group_id, auth.uid()) OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage announcements" ON public.announcements FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Students update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Students manage notifications" ON public.notifications;
CREATE POLICY "Students manage notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- AI Jobs & Usage Logs
DROP POLICY IF EXISTS "Teachers manage AI generation jobs" ON public.ai_generation_jobs;
CREATE POLICY "Teachers manage AI generation jobs" ON public.ai_generation_jobs FOR ALL USING (auth.uid() = teacher_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage AI usage logs" ON public.ai_usage_logs;
CREATE POLICY "Teachers manage AI usage logs" ON public.ai_usage_logs FOR ALL USING (auth.uid() = teacher_id OR public.is_teacher_or_owner(auth.uid()));

-- Certificates, Templates, Verification Logs
DROP POLICY IF EXISTS "Public read certificate templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Teachers manage templates" ON public.certificate_templates;
CREATE POLICY "Public read certificate templates" ON public.certificate_templates FOR SELECT TO authenticated USING (is_active = true OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage templates" ON public.certificate_templates FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public verify active certificates" ON public.certificates;
DROP POLICY IF EXISTS "Students read own active certificates" ON public.certificates;
DROP POLICY IF EXISTS "Teachers full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "Students read own certificates" ON public.certificates;
CREATE POLICY "Students read own certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers full access certificates" ON public.certificates FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers view verification logs" ON public.certificate_verification_logs;
CREATE POLICY "Teachers view verification logs" ON public.certificate_verification_logs FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Onboarding, Placement, Skills, Skill Mastery
DROP POLICY IF EXISTS "Students manage own onboarding" ON public.student_onboarding;
CREATE POLICY "Students manage own onboarding" ON public.student_onboarding FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own placement" ON public.placement_results;
DROP POLICY IF EXISTS "Students manage placement results" ON public.placement_results;
CREATE POLICY "Students manage placement results" ON public.placement_results FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read skills" ON public.skills;
DROP POLICY IF EXISTS "Teachers manage skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers manage skills" ON public.skills FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own skill mastery" ON public.student_skill_mastery;
DROP POLICY IF EXISTS "Students manage skill mastery" ON public.student_skill_mastery;
CREATE POLICY "Students manage skill mastery" ON public.student_skill_mastery FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Mistake Notebook & Review Schedules
DROP POLICY IF EXISTS "Students manage own mistake notebook" ON public.mistake_notebook_entries;
CREATE POLICY "Students manage own mistake notebook" ON public.mistake_notebook_entries FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage own review schedules" ON public.review_schedules;
CREATE POLICY "Students manage own review schedules" ON public.review_schedules FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Projects, Submissions, Portfolio
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Teachers manage projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = projects.course_id AND c.status = 'published')
  OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage projects" ON public.projects FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Teachers view/grade project submissions" ON public.project_submissions;
CREATE POLICY "Teachers view/grade project submissions" ON public.project_submissions FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage portfolio" ON public.portfolio_items;
CREATE POLICY "Students manage portfolio" ON public.portfolio_items FOR ALL USING (auth.uid() = user_id OR is_approved_by_teacher = true OR public.is_teacher_or_owner(auth.uid()));

-- Help Requests & Replies
DROP POLICY IF EXISTS "Students manage own help requests" ON public.help_requests;
DROP POLICY IF EXISTS "Teachers view/answer help requests" ON public.help_requests;
CREATE POLICY "Teachers view/answer help requests" ON public.help_requests FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students/Teachers read help replies" ON public.help_replies;
DROP POLICY IF EXISTS "Teachers insert help replies" ON public.help_replies;
CREATE POLICY "Students/Teachers read help replies" ON public.help_replies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.help_requests hr WHERE hr.id = help_replies.request_id AND (hr.user_id = auth.uid() OR public.is_teacher_or_owner(auth.uid())))
);
CREATE POLICY "Teachers insert help replies" ON public.help_replies FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Weekly Missions, Progress, Focus Sessions
DROP POLICY IF EXISTS "Public read weekly missions" ON public.weekly_missions;
DROP POLICY IF EXISTS "Teachers manage weekly missions" ON public.weekly_missions;
CREATE POLICY "Public read weekly missions" ON public.weekly_missions FOR SELECT TO authenticated USING (
  group_id IS NULL OR public.is_group_member(group_id, auth.uid()) OR public.is_teacher_or_owner(auth.uid())
);
CREATE POLICY "Teachers manage weekly missions" ON public.weekly_missions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage mission progress" ON public.student_mission_progress;
CREATE POLICY "Students manage mission progress" ON public.student_mission_progress FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students manage focus sessions" ON public.focus_sessions;
CREATE POLICY "Students manage focus sessions" ON public.focus_sessions FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- Question Bank & Exam Blueprints
DROP POLICY IF EXISTS "Teacher full access question folders" ON public.question_folders;
CREATE POLICY "Teacher full access question folders" ON public.question_folders FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read question tags" ON public.question_tags;
DROP POLICY IF EXISTS "Teacher full access question tags" ON public.question_tags;
CREATE POLICY "Public read question tags" ON public.question_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teacher full access question tags" ON public.question_tags FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage question tag relations" ON public.question_tag_relations;
CREATE POLICY "Teachers manage question tag relations" ON public.question_tag_relations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage question versions" ON public.question_versions;
CREATE POLICY "Teachers manage question versions" ON public.question_versions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage question statistics" ON public.question_statistics;
CREATE POLICY "Teachers manage question statistics" ON public.question_statistics FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage question similarity matches" ON public.question_similarity_matches;
CREATE POLICY "Teachers manage question similarity matches" ON public.question_similarity_matches FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teacher full access blueprints" ON public.exam_blueprints;
CREATE POLICY "Teacher full access blueprints" ON public.exam_blueprints FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage assessment sections" ON public.assessment_sections;
CREATE POLICY "Teachers manage assessment sections" ON public.assessment_sections FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage assessment question pools" ON public.assessment_question_pools;
CREATE POLICY "Teachers manage assessment question pools" ON public.assessment_question_pools FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teacher full access schedules" ON public.content_schedules;
CREATE POLICY "Teacher full access schedules" ON public.content_schedules FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage content validation reports" ON public.content_validation_reports;
CREATE POLICY "Teachers manage content validation reports" ON public.content_validation_reports FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Single Use Invitations, Course Assignments, AI Explanations & Remediation Plans
DROP POLICY IF EXISTS "Teachers full access invitations" ON public.single_use_invitations;
DROP POLICY IF EXISTS "Public read active invitations for redemption" ON public.single_use_invitations;
DROP POLICY IF EXISTS "Teachers read single use invitations" ON public.single_use_invitations;
CREATE POLICY "Teachers read single use invitations" ON public.single_use_invitations FOR SELECT TO authenticated USING (public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers full access invitations" ON public.single_use_invitations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage invitation course assignments" ON public.invitation_course_assignments;
CREATE POLICY "Teachers manage invitation course assignments" ON public.invitation_course_assignments FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read approved explanations" ON public.approved_ai_explanations;
DROP POLICY IF EXISTS "Teachers manage approved explanations" ON public.approved_ai_explanations;
CREATE POLICY "Public read approved explanations" ON public.approved_ai_explanations FOR SELECT TO authenticated USING (is_approved = true OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage approved explanations" ON public.approved_ai_explanations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own remediation" ON public.remediation_plans;
DROP POLICY IF EXISTS "Students manage remediation plans" ON public.remediation_plans;
CREATE POLICY "Students manage remediation plans" ON public.remediation_plans FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- ==========================================
-- 4. ESSENTIAL INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_student ON public.group_members(student_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_blocks_lesson ON public.lesson_blocks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON public.lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_code_workspaces_user_lesson ON public.code_workspaces(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON public.assessment_questions(assessment_id, order_index);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_question ON public.assessment_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON public.attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_single_use_invitations_code ON public.single_use_invitations(code);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON public.certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_help_requests_user ON public.help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_replies_request ON public.help_replies(request_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_module ON public.assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_practice_activities_lesson ON public.practice_activities(lesson_id);
CREATE INDEX IF NOT EXISTS idx_remediation_plans_user ON public.remediation_plans(user_id);

-- ==========================================
-- 5. UPDATED_AT TRIGGER FUNCTION & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress;
CREATE TRIGGER set_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_code_workspaces_updated_at ON public.code_workspaces;
CREATE TRIGGER set_code_workspaces_updated_at BEFORE UPDATE ON public.code_workspaces FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_student_notes_updated_at ON public.student_notes;
CREATE TRIGGER set_student_notes_updated_at BEFORE UPDATE ON public.student_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==========================================
-- FILE: 20260803_runtime_helpers_and_seed.sql
-- ==========================================

-- Additional integrity constraints omitted by the source migration.
ALTER TABLE public.courses
  ADD CONSTRAINT courses_estimated_hours_check CHECK (estimated_hours > 0),
  ADD CONSTRAINT courses_order_index_check CHECK (order_index > 0);
ALTER TABLE public.modules
  ADD CONSTRAINT modules_order_index_check CHECK (order_index > 0),
  ADD CONSTRAINT modules_course_order_unique UNIQUE (course_id, order_index);
ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_estimated_minutes_check CHECK (estimated_minutes > 0),
  ADD CONSTRAINT lessons_order_index_check CHECK (order_index > 0),
  ADD CONSTRAINT lessons_module_order_unique UNIQUE (module_id, order_index);
ALTER TABLE public.questions
  ADD CONSTRAINT questions_points_check CHECK (points > 0),
  ADD CONSTRAINT questions_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard'));
ALTER TABLE public.assessments
  ADD CONSTRAINT assessments_passing_score_check CHECK (passing_score BETWEEN 0 AND 100),
  ADD CONSTRAINT assessments_time_limit_check CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0);
ALTER TABLE public.assessment_attempts
  ADD CONSTRAINT assessment_attempts_status_check CHECK (status IN ('in_progress', 'submitted', 'graded', 'cancelled')),
  ADD CONSTRAINT assessment_attempts_score_check CHECK (score IS NULL OR score >= 0),
  ADD CONSTRAINT assessment_attempts_max_score_check CHECK (max_score IS NULL OR max_score >= 0),
  ADD CONSTRAINT assessment_attempts_score_lte_max_check CHECK (score IS NULL OR max_score IS NULL OR score <= max_score);
ALTER TABLE public.student_skill_mastery
  ADD CONSTRAINT student_skill_mastery_percentage_check CHECK (mastery_percentage BETWEEN 0 AND 100);
ALTER TABLE public.review_schedules
  ADD CONSTRAINT review_schedules_interval_check CHECK (interval_days > 0),
  ADD CONSTRAINT review_schedules_ease_factor_check CHECK (ease_factor > 0);
ALTER TABLE public.weekly_missions
  ADD CONSTRAINT weekly_missions_dates_check CHECK (end_date >= start_date),
  ADD CONSTRAINT weekly_missions_target_check CHECK (target_count > 0);
ALTER TABLE public.focus_sessions
  ADD CONSTRAINT focus_sessions_duration_check CHECK (duration_minutes > 0);
ALTER TABLE public.question_similarity_matches
  ADD CONSTRAINT question_similarity_score_check CHECK (similarity_score BETWEEN 0 AND 1),
  ADD CONSTRAINT question_similarity_distinct_check CHECK (source_question_id <> matched_question_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_course_assignments_unique_target
  ON public.course_assignments(course_id, COALESCE(group_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(student_id, '00000000-0000-0000-0000-000000000000'::uuid));
CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_assignments_unique_target
  ON public.assessment_assignments(assessment_id, COALESCE(group_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(student_id, '00000000-0000-0000-0000-000000000000'::uuid));


-- 1. AUTH PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
  v_age INT;
BEGIN
  v_username := COALESCE(
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'username'), ''),
    NULLIF(SPLIT_PART(COALESCE(NEW.email, ''), '@', 1), ''),
    'student'
  );
  v_username := LEFT(REGEXP_REPLACE(LOWER(v_username), '[^a-z0-9_]+', '_', 'g'), 30)
                || '_' || LEFT(REPLACE(NEW.id::TEXT, '-', ''), 8);

  v_full_name := COALESCE(
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'name'), ''),
    'طالب جديد'
  );

  IF COALESCE(NEW.raw_user_meta_data ->> 'age', '') ~ '^[0-9]{1,3}$' THEN
    v_age := (NEW.raw_user_meta_data ->> 'age')::INT;
    IF v_age < 8 OR v_age > 99 THEN
      v_age := NULL;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, full_name, username, age)
  VALUES (NEW.id, v_full_name, v_username, v_age)
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        age = COALESCE(EXCLUDED.age, public.profiles.age),
        updated_at = NOW();

  -- Never trust user-editable metadata for authorization: every signup starts as student.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- One-time owner bootstrap. Run from SQL Editor/service role after creating the owner in Auth:
-- SELECT public.bootstrap_owner('AUTH-USER-UUID-HERE'::uuid);
CREATE OR REPLACE FUNCTION public.bootstrap_owner(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Auth user % does not exist', p_user_id;
  END IF;

  DELETE FROM public.user_roles WHERE user_id = p_user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'owner');
END;
$$;

-- 2. ATOMIC SINGLE-USE INVITATION REDEMPTION
CREATE OR REPLACE FUNCTION public.redeem_single_use_invitation(
  p_code TEXT,
  p_full_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_inv public.single_use_invitations%ROWTYPE;
  v_course_count INT := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;

  SELECT * INTO v_inv
  FROM public.single_use_invitations
  WHERE UPPER(BTRIM(code)) = UPPER(BTRIM(p_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid invitation code';
  END IF;
  IF NOT v_inv.is_active OR v_inv.status <> 'active' OR v_inv.used_count <> 0 THEN
    RAISE EXCEPTION 'Invitation is no longer available';
  END IF;
  IF v_inv.expires_at IS NOT NULL AND v_inv.expires_at <= NOW() THEN
    UPDATE public.single_use_invitations
      SET status = 'expired', is_active = FALSE
      WHERE id = v_inv.id;
    RAISE EXCEPTION 'Invitation has expired';
  END IF;
  IF public.normalize_arabic_text(p_full_name) <> v_inv.normalized_expected_name THEN
    RAISE EXCEPTION 'The full name does not match the invitation';
  END IF;

  UPDATE public.profiles
  SET full_name = BTRIM(p_full_name), updated_at = NOW()
  WHERE id = v_user_id;

  UPDATE public.single_use_invitations
  SET used_count = 1,
      is_active = FALSE,
      status = 'used',
      used_by = v_user_id,
      used_at = NOW()
  WHERE id = v_inv.id;

  IF v_inv.group_id IS NOT NULL THEN
    INSERT INTO public.group_members (group_id, student_id)
    VALUES (v_inv.group_id, v_user_id)
    ON CONFLICT (group_id, student_id) DO NOTHING;
  END IF;

  INSERT INTO public.course_assignments (course_id, student_id)
  SELECT ica.course_id, v_user_id
  FROM public.invitation_course_assignments ica
  WHERE ica.invitation_id = v_inv.id
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS v_course_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', TRUE,
    'invitation_id', v_inv.id,
    'group_id', v_inv.group_id,
    'assigned_courses', v_course_count
  );
END;
$$;

-- Keep normalized name consistent for invitations created by teachers.
CREATE OR REPLACE FUNCTION public.set_invitation_normalized_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.normalized_expected_name := public.normalize_arabic_text(NEW.expected_full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_single_use_invitation_normalized_name ON public.single_use_invitations;
CREATE TRIGGER set_single_use_invitation_normalized_name
BEFORE INSERT OR UPDATE OF expected_full_name ON public.single_use_invitations
FOR EACH ROW EXECUTE FUNCTION public.set_invitation_normalized_name();

-- 3. SAFE QUESTION DELIVERY (correct_answer is never returned)
CREATE OR REPLACE FUNCTION public.get_assessment_questions(p_assessment_id UUID)
RETURNS TABLE (
  question_id UUID,
  order_index INT,
  question_type TEXT,
  prompt_ar TEXT,
  supporting_text_ar TEXT,
  code_snippet TEXT,
  options JSONB,
  points INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    q.id,
    aq.order_index,
    q.type,
    q.prompt_ar,
    q.supporting_text_ar,
    q.code_snippet,
    q.options,
    COALESCE(aq.points_override, q.points)
  FROM public.assessment_questions aq
  JOIN public.assessments a ON a.id = aq.assessment_id
  JOIN public.questions q ON q.id = aq.question_id
  WHERE aq.assessment_id = p_assessment_id
    AND a.is_published = TRUE
    AND q.status = 'published'
    AND auth.uid() IS NOT NULL
  ORDER BY aq.order_index, q.id;
$$;

-- 4. PUBLIC CERTIFICATE VERIFICATION WITHOUT EXPOSING THE WHOLE TABLE
CREATE OR REPLACE FUNCTION public.verify_certificate(p_verification_code TEXT)
RETURNS TABLE (
  certificate_number TEXT,
  student_full_name TEXT,
  course_name TEXT,
  final_score INT,
  issued_at TIMESTAMPTZ,
  status TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    c.certificate_number,
    c.student_full_name,
    c.course_name,
    c.final_score,
    c.issued_at,
    c.status
  FROM public.certificates c
  WHERE UPPER(c.verification_code) = UPPER(BTRIM(p_verification_code))
    AND c.status = 'active'
  LIMIT 1;
$$;

-- 5. ATTEMPT INTEGRITY: students may submit work but cannot assign their own scores.
CREATE OR REPLACE FUNCTION public.enforce_assessment_attempt_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_privileged BOOLEAN := current_user IN ('postgres', 'service_role', 'supabase_admin')
                          OR public.is_teacher_or_owner(v_uid);
BEGIN
  IF v_privileged THEN
    RETURN NEW;
  END IF;

  IF v_uid IS NULL OR NEW.user_id <> v_uid THEN
    RAISE EXCEPTION 'You can only manage your own assessment attempt';
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'in_progress';
    NEW.score := NULL;
    NEW.max_score := NULL;
    NEW.submitted_at := NULL;
    NEW.graded_at := NULL;
  ELSE
    IF NEW.user_id IS DISTINCT FROM OLD.user_id
       OR NEW.assessment_id IS DISTINCT FROM OLD.assessment_id
       OR NEW.score IS DISTINCT FROM OLD.score
       OR NEW.max_score IS DISTINCT FROM OLD.max_score
       OR NEW.graded_at IS DISTINCT FROM OLD.graded_at THEN
      RAISE EXCEPTION 'Students cannot modify ownership or grading fields';
    END IF;

    IF NEW.status NOT IN ('in_progress', 'submitted') THEN
      RAISE EXCEPTION 'Invalid student attempt status';
    END IF;

    IF NEW.status = 'submitted' AND OLD.status <> 'submitted' THEN
      NEW.submitted_at := COALESCE(NEW.submitted_at, NOW());
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_assessment_attempt_integrity ON public.assessment_attempts;
CREATE TRIGGER enforce_assessment_attempt_integrity
BEFORE INSERT OR UPDATE ON public.assessment_attempts
FOR EACH ROW EXECUTE FUNCTION public.enforce_assessment_attempt_integrity();

CREATE OR REPLACE FUNCTION public.enforce_attempt_answer_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_owner UUID;
  v_privileged BOOLEAN := current_user IN ('postgres', 'service_role', 'supabase_admin')
                          OR public.is_teacher_or_owner(v_uid);
BEGIN
  IF v_privileged THEN
    RETURN NEW;
  END IF;

  SELECT a.user_id INTO v_owner
  FROM public.assessment_attempts a
  WHERE a.id = NEW.attempt_id;

  IF v_uid IS NULL OR v_owner IS DISTINCT FROM v_uid THEN
    RAISE EXCEPTION 'You can only answer questions in your own attempt';
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_correct := NULL;
    NEW.points_awarded := 0;
    NEW.teacher_feedback := NULL;
  ELSE
    IF NEW.attempt_id IS DISTINCT FROM OLD.attempt_id
       OR NEW.question_id IS DISTINCT FROM OLD.question_id
       OR NEW.is_correct IS DISTINCT FROM OLD.is_correct
       OR NEW.points_awarded IS DISTINCT FROM OLD.points_awarded
       OR NEW.teacher_feedback IS DISTINCT FROM OLD.teacher_feedback THEN
      RAISE EXCEPTION 'Students cannot modify grading fields';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_attempt_answer_integrity ON public.attempt_answers;
CREATE TRIGGER enforce_attempt_answer_integrity
BEFORE INSERT OR UPDATE ON public.attempt_answers
FOR EACH ROW EXECUTE FUNCTION public.enforce_attempt_answer_integrity();

-- 6. AUTOMATIC UPDATED_AT TRIGGERS FOR ALL TABLES THAT HAVE THE COLUMN
DO $$
DECLARE
  r RECORD;
  v_trigger_name TEXT;
BEGIN
  FOR r IN
    SELECT c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND c.column_name = 'updated_at'
  LOOP
    v_trigger_name := 'set_' || r.table_name || '_updated_at';
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', v_trigger_name, r.table_name);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      v_trigger_name,
      r.table_name
    );
  END LOOP;
END;
$$;

-- 7. SUPABASE API PRIVILEGES (RLS remains the authorization layer)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON public.feature_flags TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;

-- Sensitive functions are explicitly controlled.
REVOKE ALL ON FUNCTION public.bootstrap_owner(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_owner(UUID) TO service_role;

REVOKE ALL ON FUNCTION public.redeem_single_use_invitation(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_single_use_invitation(TEXT, TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_assessment_questions(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_assessment_questions(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.verify_certificate(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(TEXT) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_teacher_or_owner(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_teacher_or_owner(UUID) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.is_group_member(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_group_member(UUID, UUID) TO authenticated, service_role;

-- Direct question reads are denied to normal clients; use get_assessment_questions().
REVOKE SELECT ON public.questions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO service_role;
-- Teachers still need question-bank access through the API. Grant column/table access;
-- the RLS policy limits it to owner/teacher users.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;

-- 8. DEMO/STARTER DATA (no fake auth users are inserted)
INSERT INTO public.app_settings (key, value) VALUES
  ('platform_identity', '{"name_ar":"إتقان","name_en":"Itqan","default_locale":"ar-EG"}'::jsonb),
  ('learning_rules', '{"lesson_unlock_requires_mastery":true,"default_passing_score":70,"max_attempts":3}'::jsonb),
  ('gamification', '{"xp_enabled":true,"leaderboard_enabled":true,"streaks_enabled":true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

INSERT INTO public.feature_flags (key, is_enabled, description) VALUES
  ('certificates_enabled', TRUE, 'Enable student certificate eligibility and issuance'),
  ('ai_tools_enabled', TRUE, 'Enable AI-assisted question draft generation for teachers'),
  ('projects_enabled', TRUE, 'Enable projects and student portfolio'),
  ('weekly_missions_enabled', TRUE, 'Enable weekly learning missions'),
  ('placement_test_enabled', TRUE, 'Enable onboarding placement assessment')
ON CONFLICT (key) DO UPDATE
SET is_enabled = EXCLUDED.is_enabled,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO public.groups (id, name, code, description, is_active, leaderboard_enabled) VALUES
  ('90000000-0000-0000-0000-000000000001', 'مجموعة البداية', 'ITQAN-START', 'مجموعة تجريبية جاهزة لإسناد الطلاب', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.courses (id, slug, title_ar, description_ar, subject, status, estimated_hours, order_index) VALUES
  ('10000000-0000-0000-0000-000000000001', 'html-foundations', 'أساسيات HTML', 'ابدأ من الصفر وتعلم بناء صفحات ويب صحيحة ومنظمة.', 'html', 'published', 8, 1),
  ('10000000-0000-0000-0000-000000000002', 'css-foundations', 'أساسيات CSS', 'تعلم تنسيق الصفحات وبناء واجهات جميلة ومتجاوبة.', 'css', 'published', 10, 2),
  ('10000000-0000-0000-0000-000000000003', 'javascript-foundations', 'أساسيات JavaScript', 'تعلم البرمجة والتفاعل مع عناصر صفحات الويب.', 'js', 'published', 12, 3)
ON CONFLICT (id) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  description_ar = EXCLUDED.description_ar,
  status = EXCLUDED.status,
  estimated_hours = EXCLUDED.estimated_hours,
  order_index = EXCLUDED.order_index;

INSERT INTO public.modules (id, course_id, title_ar, description_ar, order_index) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'مقدمة HTML', 'هيكل الصفحة والعناصر الأساسية.', 1),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'النصوص والروابط والصور', 'إنشاء محتوى صفحة حقيقي.', 2),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'مقدمة CSS', 'طرق إضافة CSS والمحددات الأساسية.', 1),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'مقدمة JavaScript', 'المتغيرات والقيم والتعامل مع الصفحة.', 1)
ON CONFLICT (id) DO UPDATE SET title_ar = EXCLUDED.title_ar, description_ar = EXCLUDED.description_ar, order_index = EXCLUDED.order_index;

INSERT INTO public.lessons (id, module_id, title_ar, slug, estimated_minutes, order_index, status, version) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'ما هي HTML؟', 'what-is-html', 15, 1, 'published', 1),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'هيكل صفحة HTML', 'html-document-structure', 20, 2, 'published', 1),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'العناوين والفقرات', 'headings-and-paragraphs', 20, 1, 'published', 1),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 'إضافة CSS للصفحة', 'adding-css', 20, 1, 'published', 1),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 'المتغيرات في JavaScript', 'javascript-variables', 25, 1, 'published', 1)
ON CONFLICT (id) DO UPDATE SET title_ar = EXCLUDED.title_ar, estimated_minutes = EXCLUDED.estimated_minutes, status = EXCLUDED.status;

INSERT INTO public.lesson_blocks (id, lesson_id, block_type, content, order_index) VALUES
  ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'explanation', '{"title":"HTML هي لغة بناء المحتوى","body":"نستخدم HTML لتحديد العناوين والفقرات والصور والروابط داخل الصفحة."}'::jsonb, 1),
  ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'code', '{"language":"html","code":"<h1>مرحباً بك في إتقان</h1>\n<p>هذه أول صفحة لي.</p>"}'::jsonb, 2),
  ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'code', '{"language":"html","code":"<!doctype html>\n<html lang=\"ar\" dir=\"rtl\">\n<head><meta charset=\"UTF-8\"><title>صفحتي</title></head>\n<body><h1>مرحباً</h1></body>\n</html>"}'::jsonb, 1),
  ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 'code', '{"language":"css","code":"h1 { color: navy; text-align: center; }"}'::jsonb, 1),
  ('31000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', 'code', '{"language":"javascript","code":"const studentName = \"Ahmed\";\nconsole.log(studentName);"}'::jsonb, 1)
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, order_index = EXCLUDED.order_index;

INSERT INTO public.practice_activities (
  id, lesson_id, title_ar, instructions_ar, starter_html, starter_css, starter_js,
  solution_code, validation_rules, points, order_index
) VALUES
  (
    '32000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'أنشئ عنواناً وفقرة',
    'اكتب عنوان h1 وفقرة p داخل الصفحة.',
    '<h1></h1>\n<p></p>', '', '',
    '<h1>أنا أتعلم HTML</h1>\n<p>هذه أول فقرة لي.</p>',
    '{"required_tags":["h1","p"]}'::jsonb,
    20, 1
  ),
  (
    '32000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000004',
    'نسّق بطاقة بسيطة',
    'غيّر الخلفية والحواف والمسافات الداخلية للبطاقة.',
    '<div class="card">بطاقتي</div>', '.card {\n\n}', '',
    '.card { background: #ffffff; border: 1px solid #ddd; padding: 16px; border-radius: 12px; }',
    '{"required_css_properties":["background","padding","border-radius"]}'::jsonb,
    25, 1
  )
ON CONFLICT (id) DO UPDATE SET instructions_ar = EXCLUDED.instructions_ar, validation_rules = EXCLUDED.validation_rules;

INSERT INTO public.question_folders (id, name_ar, course_id) VALUES
  ('40000000-0000-0000-0000-000000000001', 'أسئلة HTML الأساسية', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'أسئلة CSS الأساسية', '10000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO UPDATE SET name_ar = EXCLUDED.name_ar;

-- Add useful ownership columns to questions only when the clean schema is used.
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.question_folders(id) ON DELETE SET NULL;

INSERT INTO public.questions (
  id, type, prompt_ar, supporting_text_ar, code_snippet, options, correct_answer,
  explanation_ar, points, difficulty, status, course_id, module_id, lesson_id, folder_id
) VALUES
  (
    '41000000-0000-0000-0000-000000000001', 'mcq',
    'ما الوسم المستخدم لإنشاء أكبر عنوان في HTML؟', NULL, NULL,
    '[{"id":"a","text":"<h1>"},{"id":"b","text":"<p>"},{"id":"c","text":"<div>"},{"id":"d","text":"<img>"}]'::jsonb,
    '{"option_id":"a"}'::jsonb,
    'الوسم <h1> يمثل العنوان الأعلى مستوى.', 10, 'easy', 'published',
    '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001'
  ),
  (
    '41000000-0000-0000-0000-000000000002', 'true_false',
    'يجب وضع محتوى الصفحة المرئي داخل وسم body.', NULL, NULL,
    '[{"id":"true","text":"صح"},{"id":"false","text":"خطأ"}]'::jsonb,
    '{"value":true}'::jsonb,
    'كل المحتوى الظاهر للمستخدم يوضع داخل body.', 10, 'easy', 'published',
    '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001'
  ),
  (
    '41000000-0000-0000-0000-000000000003', 'ordering',
    'رتّب أجزاء مستند HTML من الخارج إلى الداخل.', NULL, NULL,
    '[{"id":"1","text":"html"},{"id":"2","text":"body"},{"id":"3","text":"h1"}]'::jsonb,
    '{"order":["1","2","3"]}'::jsonb,
    'عنصر html يحتوي body، وbody يحتوي العناصر المرئية مثل h1.', 15, 'medium', 'published',
    '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001'
  ),
  (
    '41000000-0000-0000-0000-000000000004', 'mcq',
    'أي خاصية CSS تغيّر لون النص؟', NULL, 'p { ____: red; }',
    '[{"id":"a","text":"background"},{"id":"b","text":"color"},{"id":"c","text":"font-size"},{"id":"d","text":"margin"}]'::jsonb,
    '{"option_id":"b"}'::jsonb,
    'خاصية color تتحكم في لون النص.', 10, 'easy', 'published',
    '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002'
  )
ON CONFLICT (id) DO UPDATE SET
  prompt_ar = EXCLUDED.prompt_ar,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation_ar = EXCLUDED.explanation_ar,
  status = EXCLUDED.status;

INSERT INTO public.assessments (
  id, course_id, module_id, title_ar, type, time_limit_minutes, passing_score, is_published
) VALUES
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', NULL, 'اختبار HTML التمهيدي', 'quiz', 15, 70, TRUE),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', NULL, 'اختبار CSS التمهيدي', 'quiz', 10, 70, TRUE)
ON CONFLICT (id) DO UPDATE SET title_ar = EXCLUDED.title_ar, is_published = EXCLUDED.is_published;

INSERT INTO public.assessment_sections (id, assessment_id, title_ar, instructions_ar, order_index) VALUES
  ('51000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'الأساسيات', 'أجب عن جميع الأسئلة.', 1),
  ('51000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'أساسيات التنسيق', 'اختر الإجابة الصحيحة.', 1)
ON CONFLICT (id) DO UPDATE SET title_ar = EXCLUDED.title_ar;

INSERT INTO public.assessment_questions (
  id, assessment_id, question_id, section_id, order_index, points_override
) VALUES
  ('52000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000001', 1, 10),
  ('52000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000002', '51000000-0000-0000-0000-000000000001', 2, 10),
  ('52000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000003', '51000000-0000-0000-0000-000000000001', 3, 15),
  ('52000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', '41000000-0000-0000-0000-000000000004', '51000000-0000-0000-0000-000000000002', 1, 10)
ON CONFLICT (id) DO UPDATE SET order_index = EXCLUDED.order_index, points_override = EXCLUDED.points_override;

INSERT INTO public.achievement_definitions (id, code, title_ar, description_ar, badge_icon, xp_reward) VALUES
  ('60000000-0000-0000-0000-000000000001', 'FIRST_LESSON', 'أول خطوة', 'أكملت أول درس لك.', 'sparkles', 50),
  ('60000000-0000-0000-0000-000000000002', 'PERFECT_SCORE', 'العلامة الكاملة', 'حصلت على 100% في اختبار.', 'trophy', 150),
  ('60000000-0000-0000-0000-000000000003', 'FIVE_DAY_STREAK', 'مواظب', 'تعلمت لمدة خمسة أيام متتالية.', 'flame', 100),
  ('60000000-0000-0000-0000-000000000004', 'FIRST_PROJECT', 'صانع المشاريع', 'أنهيت أول مشروع عملي.', 'code-2', 200)
ON CONFLICT (code) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  description_ar = EXCLUDED.description_ar,
  badge_icon = EXCLUDED.badge_icon,
  xp_reward = EXCLUDED.xp_reward;

INSERT INTO public.skills (id, subject, code, title_ar, category_ar, order_index) VALUES
  ('70000000-0000-0000-0000-000000000001', 'html', 'HTML_STRUCTURE', 'هيكل مستند HTML', 'الأساسيات', 1),
  ('70000000-0000-0000-0000-000000000002', 'html', 'HTML_TEXT', 'العناوين والفقرات', 'المحتوى', 2),
  ('70000000-0000-0000-0000-000000000003', 'css', 'CSS_SELECTORS', 'محددات CSS', 'الأساسيات', 1),
  ('70000000-0000-0000-0000-000000000004', 'js', 'JS_VARIABLES', 'المتغيرات والقيم', 'الأساسيات', 1)
ON CONFLICT (code) DO UPDATE SET title_ar = EXCLUDED.title_ar, category_ar = EXCLUDED.category_ar, order_index = EXCLUDED.order_index;

INSERT INTO public.certificate_templates (
  id, title, title_ar, header_ar, body_template_ar, background_image_url, is_default, is_active
) VALUES (
  '80000000-0000-0000-0000-000000000001',
  'Itqan Modern Certificate',
  'شهادة إتقان الحديثة',
  'شهادة إتمام',
  'تشهد منصة إتقان بأن {{student_name}} قد أتم دورة {{course_name}} بنجاح وبدرجة {{score}}%.',
  NULL,
  TRUE,
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  header_ar = EXCLUDED.header_ar,
  body_template_ar = EXCLUDED.body_template_ar,
  is_default = EXCLUDED.is_default,
  is_active = EXCLUDED.is_active;

-- 9. FINAL SELF-CHECKS: fail the transaction if the core schema is incomplete.
DO $$
DECLARE
  v_missing TEXT[];
BEGIN
  SELECT array_agg(required_table)
  INTO v_missing
  FROM unnest(ARRAY[
    'profiles','user_roles','courses','modules','lessons','lesson_blocks',
    'questions','assessments','assessment_questions','assessment_attempts',
    'attempt_questions','attempt_answers','groups','single_use_invitations',
    'certificates','certificate_templates'
  ]) AS required_table
  WHERE to_regclass('public.' || required_table) IS NULL;

  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'Missing required tables: %', array_to_string(v_missing, ', ');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'certificates'
      AND column_name = 'student_id'
  ) THEN
    RAISE EXCEPTION 'certificates.student_id is missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.courses) THEN
    RAISE EXCEPTION 'Seed data was not inserted';
  END IF;
END;
$$;

COMMIT;

-- Helpful completion message in SQL Editor results.
SELECT
  'ITQAN_SCHEMA_READY' AS status,
  (SELECT COUNT(*) FROM public.courses) AS courses_count,
  (SELECT COUNT(*) FROM public.lessons) AS lessons_count,
  (SELECT COUNT(*) FROM public.questions) AS questions_count,
  (SELECT COUNT(*) FROM public.assessments) AS assessments_count;
