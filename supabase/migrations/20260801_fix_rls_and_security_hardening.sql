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
CREATE POLICY "Students read own certificates" ON public.certificates FOR SELECT USING (auth.uid() = student_id OR status = 'active' OR public.is_teacher_or_owner(auth.uid()));
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
