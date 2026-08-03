## 2026-08-01T10:10:43Z
You are Worker 2 (Database Optimization & Security Implementer).
Working directory: d:\@vibcoding\ai\.agents\worker_2\
Project root: d:\@vibcoding\ai

Your task is to refine `supabase/migrations/20260801_fix_rls_and_security_hardening.sql` to eliminate RLS policy recursion and add secondary FK indexes:
1. Open `supabase/migrations/20260801_fix_rls_and_security_hardening.sql`.
2. Add a hardened RPC helper function `public.is_group_member`:
   ```sql
   CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id UUID, p_user_id UUID)
   RETURNS BOOLEAN AS $$
   BEGIN
     RETURN EXISTS (SELECT 1 FROM public.group_members WHERE group_id = p_group_id AND student_id = p_user_id);
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
   ```
3. Update the `group_members` RLS policy to use `public.is_group_member(group_id, auth.uid())` instead of the inline subquery (`EXISTS (SELECT 1 FROM public.group_members gm...)`), preventing PostgreSQL infinite recursion errors.
4. Add secondary B-tree FK indexes:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
   CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_id);
   CREATE INDEX IF NOT EXISTS idx_assessments_module ON public.assessments(module_id);
   CREATE INDEX IF NOT EXISTS idx_practice_activities_lesson ON public.practice_activities(lesson_id);
   CREATE INDEX IF NOT EXISTS idx_remediation_plans_user ON public.remediation_plans(user_id);
   ```
5. Run `npm run lint` and `npm run test` to verify zero regressions.
6. Document changes in `d:\@vibcoding\ai\.agents\worker_2\handoff.md`.
