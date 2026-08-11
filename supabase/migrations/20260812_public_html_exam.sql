-- MIGRATION: PUBLIC HTML EXAM AND CANVAS CERTIFICATES

-- 1. PUBLIC HTML EXAM ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.public_html_exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL DEFAULT 30,
  percentage NUMERIC(5,2) NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers_json JSONB DEFAULT '{}'::jsonb,
  verification_code TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PUBLIC HTML CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.public_html_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verification_code TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL DEFAULT 'اختبار إتقان الشامل في لغة HTML',
  score INT NOT NULL,
  total_questions INT NOT NULL DEFAULT 30,
  percentage NUMERIC(5,2) NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_public_html_attempts_code ON public.public_html_exam_attempts(verification_code);
CREATE INDEX IF NOT EXISTS idx_public_html_certs_code ON public.public_html_certificates(verification_code);

-- 4. RLS POLICIES FOR PUBLIC ANONYMOUS ACCESS
ALTER TABLE public.public_html_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_html_certificates ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated anonymous users) to insert exam attempts
CREATE POLICY "Allow public insert to exam attempts"
  ON public.public_html_exam_attempts
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view exam attempts
CREATE POLICY "Allow public select from exam attempts"
  ON public.public_html_exam_attempts
  FOR SELECT
  USING (true);

-- Allow anyone to insert public certificates
CREATE POLICY "Allow public insert to certificates"
  ON public.public_html_certificates
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to verify public certificates by code
CREATE POLICY "Allow public select from certificates"
  ON public.public_html_certificates
  FOR SELECT
  USING (true);
