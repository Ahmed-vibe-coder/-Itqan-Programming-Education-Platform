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
