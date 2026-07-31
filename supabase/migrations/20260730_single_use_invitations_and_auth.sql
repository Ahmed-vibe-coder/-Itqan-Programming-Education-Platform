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
