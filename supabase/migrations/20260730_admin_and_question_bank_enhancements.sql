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
