import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Course, Module } from '@/types/database';
import { FULL_HTML_ROADMAP, FULL_CSS_ROADMAP, FULL_JS_ROADMAP } from '@/data/seedContent';

export const courseService = {
  async getPublishedCourses(): Promise<Course[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'c1000000-0000-0000-0000-000000000001',
          slug: 'html-basics',
          title_ar: 'HTML من الصفر',
          description_ar: 'تعلم كيفية بناء الهيكل الأساسي لمواقع الويب باستخدام لغة HTML خطوة بخطوة.',
          subject: 'html',
          status: 'published',
          estimated_hours: 4,
          order_index: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 'c2000000-0000-0000-0000-000000000002',
          slug: 'css-basics',
          title_ar: 'CSS من الصفر',
          description_ar: 'اكتشف سر تزيين وتنسيق صفحات الويب وتحويل الهيكل البسيط إلى تصميم جذاب ورائع.',
          subject: 'css',
          status: 'published',
          estimated_hours: 5,
          order_index: 2,
          created_at: new Date().toISOString(),
        },
        {
          id: 'c3000000-0000-0000-0000-000000000003',
          slug: 'javascript-basics',
          title_ar: 'JavaScript من الصفر',
          description_ar: 'أضف التفاعل والحيوية لصفحاتك وتعلم التفكير البرمجي وبناء المنطق.',
          subject: 'js',
          status: 'published',
          estimated_hours: 6,
          order_index: 3,
          created_at: new Date().toISOString(),
        },
      ];
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    if (!isSupabaseConfigured()) {
      const courses = await this.getPublishedCourses();
      return courses.find((c) => c.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  },

  async getCourseModules(courseId: string): Promise<Module[]> {
    if (!isSupabaseConfigured()) {
      if (courseId.includes('1')) return FULL_HTML_ROADMAP;
      if (courseId.includes('2')) return FULL_CSS_ROADMAP;
      if (courseId.includes('3')) return FULL_JS_ROADMAP;
      return FULL_HTML_ROADMAP;
    }

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      if (courseId.includes('1')) return FULL_HTML_ROADMAP;
      if (courseId.includes('2')) return FULL_CSS_ROADMAP;
      if (courseId.includes('3')) return FULL_JS_ROADMAP;
      return FULL_HTML_ROADMAP;
    }
    return data;
  }
};
