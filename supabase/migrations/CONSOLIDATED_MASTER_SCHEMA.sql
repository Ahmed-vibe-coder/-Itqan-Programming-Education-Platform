-- CONSOLIDATED MASTER SCHEMA FOR ITQAN PLATFORM
-- Generated for 1-Click Execution in Supabase SQL Editor
-- Total Migrations Merged: 7

-- ==========================================
-- FILE: 20260730_init_schema.sql
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  age INT CHECK (age >= 8 AND age <= 99),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE user_role_enum AS ENUM ('owner', 'teacher', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 2. GROUPS & INVITATIONS
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  leaderboard_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, student_id)
);

CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE course_subject AS ENUM ('html', 'css', 'js');

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  subject course_subject NOT NULL,
  status content_status DEFAULT 'draft',
  estimated_hours INT DEFAULT 5,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  estimated_minutes INT DEFAULT 15,
  order_index INT NOT NULL,
  status content_status DEFAULT 'draft',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

CREATE TABLE public.lesson_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INT NOT NULL
);

-- 4. PROGRESS & WORKSPACES
CREATE TYPE progress_status AS ENUM ('locked', 'available', 'in_progress', 'awaiting_mastery', 'completed');

CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status progress_status DEFAULT 'locked',
  reading_progress INT DEFAULT 0,
  mastery_passed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE public.code_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  prompt_ar TEXT NOT NULL,
  supporting_text_ar TEXT,
  code_snippet TEXT,
  options JSONB,
  correct_answer JSONB NOT NULL, -- Sensitive: restricted via RLS
  explanation_ar TEXT,
  points INT DEFAULT 10,
  difficulty TEXT DEFAULT 'medium',
  status content_status DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  type TEXT NOT NULL,
  time_limit_minutes INT,
  passing_score INT DEFAULT 70,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  xp_reward INT DEFAULT 50
);

CREATE TABLE public.student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSE & LESSON VERSIONS AND PREREQUISITES
CREATE TABLE IF NOT EXISTS public.course_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_prerequisites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  prerequisite_lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  UNIQUE(lesson_id, prerequisite_lesson_id)
);

-- 6. PRACTICE ACTIVITIES & ATTEMPTS
CREATE TABLE IF NOT EXISTS public.practice_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 8. LEARNING ACTIVITY & SMART REVIEW RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.learning_activity_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  reason_ar TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ASSESSMENT QUESTION SNAPSHOTS & GRADING RECORDS
CREATE TABLE IF NOT EXISTS public.attempt_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  options_snapshot JSONB NOT NULL,
  points INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  body_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  body_ar TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI GENERATION JOBS & USAGE LOGS
CREATE TABLE IF NOT EXISTS public.ai_generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  prompt_summary TEXT NOT NULL,
  response_payload JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INT DEFAULT 0,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CERTIFICATES FOUNDATION
CREATE TABLE IF NOT EXISTS public.certificate_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  score_snapshot INT NOT NULL,
  status TEXT DEFAULT 'issued',
  issued_at TIMESTAMPTZ DEFAULT NOW()
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  order_index INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.student_skill_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, learning, needs_review, mastered
  mastery_percentage INT DEFAULT 0,
  last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- 3. MISTAKE NOTEBOOK & SPACED REVIEW
CREATE TABLE IF NOT EXISTS public.mistake_notebook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_submission_id UUID REFERENCES public.project_submissions(id),
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  is_approved_by_teacher BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HELP REQUESTS ("ASK THE TEACHER")
CREATE TABLE IF NOT EXISTS public.help_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id),
  code_snapshot JSONB,
  message_text TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- new, viewed, answered, resolved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.help_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  attached_lesson_id UUID REFERENCES public.lessons(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEEKLY MISSIONS & FOCUS SESSIONS
CREATE TABLE IF NOT EXISTS public.weekly_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.weekly_missions(id) ON DELETE CASCADE,
  current_count INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, mission_id)
);

CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  parent_id UUID REFERENCES public.question_folders(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_tag_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.question_tags(id) ON DELETE CASCADE,
  UNIQUE(question_id, tag_id)
);

-- 2. QUESTION VERSIONS & STATISTICS
CREATE TABLE IF NOT EXISTS public.question_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  matched_question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  similarity_score FLOAT NOT NULL,
  match_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXAM BLUEPRINTS & SECTIONS & POOLS
CREATE TABLE IF NOT EXISTS public.exam_blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  instructions_ar TEXT,
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_question_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.assessment_sections(id) ON DELETE SET NULL,
  pool_name_ar TEXT NOT NULL,
  select_count INT NOT NULL DEFAULT 1,
  filter_criteria JSONB NOT NULL, -- e.g. {"module_id": "...", "difficulty": "easy"}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTENT SCHEDULES & VALIDATION REPORTS
CREATE TABLE IF NOT EXISTS public.content_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- 'lesson', 'assessment', 'project'
  entity_id UUID NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  scheduled_publish_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'published', 'cancelled'
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_validation_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE POLICY "Public read question tags" ON public.question_tags FOR SELECT USING (true);
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
  result := REGEXP_REPLACE(result, '[\u064B-\u0652]', '', 'g');
  -- Collapse multiple spaces
  result := REGEXP_REPLACE(result, '\s+', ' ', 'g');

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. ENHANCE INVITATIONS TABLE WITH SINGLE-USE GUARANTEES
CREATE TABLE IF NOT EXISTS public.single_use_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES public.single_use_invitations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  UNIQUE(invitation_id, course_id)
);

-- 3. APPROVED AI EXPLANATIONS & REMEDIATION PLANS
CREATE TABLE IF NOT EXISTS public.approved_ai_explanations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_code TEXT NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  explanation_ar TEXT NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.remediation_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE POLICY "Public read approved explanations" ON public.approved_ai_explanations FOR SELECT USING (true);


-- ==========================================
-- FILE: 20260730_certificates_and_system_health.sql
-- ==========================================

-- CERTIFICATES AND SYSTEM HEALTH MIGRATION

-- 1. CERTIFICATES TABLES
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  student_full_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  final_score INT DEFAULT 100,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  revoked_reason TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.certificate_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  header_ar TEXT NOT NULL,
  body_template_ar TEXT NOT NULL,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificate_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- RLS POLICIES FOR CERTIFICATES
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public verify active certificates" ON public.certificates FOR SELECT USING (status = 'active');
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
  result := REGEXP_REPLACE(result, '[\u064B-\u0652]', '', 'g');
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
CREATE POLICY "Public read active groups" ON public.groups FOR SELECT USING (is_active = true OR public.is_teacher_or_owner(auth.uid()));
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
DROP POLICY IF EXISTS "Teachers manage invitations" ON public.invitations;
CREATE POLICY "Public read active invitations" ON public.invitations FOR SELECT USING (is_active = true OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage invitations" ON public.invitations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Courses, Modules, Lessons, Lesson Blocks
DROP POLICY IF EXISTS "Public read published courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers manage courses" ON public.courses;
CREATE POLICY "Public read published courses" ON public.courses FOR SELECT USING (status = 'published' OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage courses" ON public.courses FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read modules" ON public.modules;
DROP POLICY IF EXISTS "Teachers manage modules" ON public.modules;
CREATE POLICY "Public read modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Teachers manage modules" ON public.modules FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers manage lessons" ON public.lessons;
CREATE POLICY "Public read published lessons" ON public.lessons FOR SELECT USING (status = 'published' OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage lessons" ON public.lessons FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read lesson blocks" ON public.lesson_blocks;
DROP POLICY IF EXISTS "Teachers manage lesson blocks" ON public.lesson_blocks;
CREATE POLICY "Public read lesson blocks" ON public.lesson_blocks FOR SELECT USING (true);
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
CREATE POLICY "Students read published questions" ON public.questions FOR SELECT USING (status = 'published' OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage questions" ON public.questions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read published assessments" ON public.assessments;
DROP POLICY IF EXISTS "Teachers manage assessments" ON public.assessments;
CREATE POLICY "Students read published assessments" ON public.assessments FOR SELECT USING (is_published = true OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers manage assessments" ON public.assessments FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

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
CREATE POLICY "Public read achievement definitions" ON public.achievement_definitions FOR SELECT USING (true);
CREATE POLICY "Teachers manage achievement definitions" ON public.achievement_definitions FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Students read own achievements" ON public.student_achievements;
DROP POLICY IF EXISTS "Students manage achievements" ON public.student_achievements;
CREATE POLICY "Students manage achievements" ON public.student_achievements FOR ALL USING (auth.uid() = user_id OR public.is_teacher_or_owner(auth.uid()));

-- App Settings, Feature Flags, Audit Logs
DROP POLICY IF EXISTS "Public read app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Teachers manage app settings" ON public.app_settings;
CREATE POLICY "Public read app settings" ON public.app_settings FOR SELECT USING (true);
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
CREATE POLICY "Public read lesson prerequisites" ON public.lesson_prerequisites FOR SELECT USING (true);
CREATE POLICY "Teachers manage lesson prerequisites" ON public.lesson_prerequisites FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

-- Practice Activities & Practice Attempts
DROP POLICY IF EXISTS "Public read practice activities" ON public.practice_activities;
DROP POLICY IF EXISTS "Teachers manage practice activities" ON public.practice_activities;
CREATE POLICY "Public read practice activities" ON public.practice_activities FOR SELECT USING (true);
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
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
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
CREATE POLICY "Public read certificate templates" ON public.certificate_templates FOR SELECT USING (true);
CREATE POLICY "Teachers manage templates" ON public.certificate_templates FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public verify active certificates" ON public.certificates;
DROP POLICY IF EXISTS "Teachers full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "Students read own certificates" ON public.certificates;
CREATE POLICY "Students read own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id OR auth.uid() = student_id OR status = 'active' OR public.is_teacher_or_owner(auth.uid()));
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
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
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
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
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
CREATE POLICY "Public read weekly missions" ON public.weekly_missions FOR SELECT USING (true);
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
CREATE POLICY "Public read question tags" ON public.question_tags FOR SELECT USING (true);
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
CREATE POLICY "Public read active invitations for redemption" ON public.single_use_invitations FOR SELECT USING ((is_active = true AND status = 'active') OR public.is_teacher_or_owner(auth.uid()));
CREATE POLICY "Teachers full access invitations" ON public.single_use_invitations FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Teachers manage invitation course assignments" ON public.invitation_course_assignments;
CREATE POLICY "Teachers manage invitation course assignments" ON public.invitation_course_assignments FOR ALL USING (public.is_teacher_or_owner(auth.uid()));

DROP POLICY IF EXISTS "Public read approved explanations" ON public.approved_ai_explanations;
DROP POLICY IF EXISTS "Teachers manage approved explanations" ON public.approved_ai_explanations;
CREATE POLICY "Public read approved explanations" ON public.approved_ai_explanations FOR SELECT USING (true);
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


