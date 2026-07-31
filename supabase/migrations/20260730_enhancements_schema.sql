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
