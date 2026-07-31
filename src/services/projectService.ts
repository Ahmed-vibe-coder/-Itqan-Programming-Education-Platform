import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface StudentProject {
  id: string;
  courseId: string;
  title_ar: string;
  description_ar: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'needs_changes' | 'approved';
  submittedHtml?: string;
  submittedCss?: string;
  submittedJs?: string;
  teacherFeedback?: string;
}

export const projectService = {
  async getStudentProjects(userId: string, courseId: string): Promise<StudentProject[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'proj-1',
          courseId,
          title_ar: 'مشروع الصفحة الشخصية الأولى (HTML Profile)',
          description_ar: 'قم بإنشاء صفحة ويب تعريفية متكاملة تحتوي على عناوين وقوائم وصورة شخصية ورابط.',
          status: 'in_progress',
          submittedHtml: `<!DOCTYPE html>\n<html>\n<head><title>صفحتي الشخصية</title></head>\n<body>\n  <h1>أهلاً بكم في موقعي</h1>\n</body>\n</html>`,
        },
      ];
    }

    const { data } = await supabase
      .from('projects')
      .select('*, project_submissions(*)')
      .eq('course_id', courseId);

    return (data || []).map((p: any) => {
      const sub = p.project_submissions && p.project_submissions[0];
      return {
        id: p.id,
        courseId: p.course_id,
        title_ar: p.title_ar,
        description_ar: p.description_ar,
        status: sub?.status || 'not_started',
        submittedHtml: sub?.submitted_html,
        submittedCss: sub?.submitted_css,
        submittedJs: sub?.submitted_js,
        teacherFeedback: sub?.teacher_feedback,
      };
    });
  }
};
