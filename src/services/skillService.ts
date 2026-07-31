import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ConceptSkill {
  id: string;
  subject: 'html' | 'css' | 'js';
  code: string;
  title_ar: string;
  category_ar: string;
  status: 'not_started' | 'learning' | 'needs_review' | 'mastered';
  mastery_percentage: number;
}

export const skillService = {
  async getStudentSkills(userId: string, subject: 'html' | 'css' | 'js'): Promise<ConceptSkill[]> {
    const baseSkills: Record<string, ConceptSkill[]> = {
      html: [
        { id: 'sk-h1', subject: 'html', code: 'html_doc_structure', title_ar: 'هيكل المستند الأساسي', category_ar: 'الأساسيات', status: 'mastered', mastery_percentage: 100 },
        { id: 'sk-h2', subject: 'html', code: 'html_text_elements', title_ar: 'عناصر النصوص والعناوين', category_ar: 'المحتوى', status: 'mastered', mastery_percentage: 100 },
        { id: 'sk-h3', subject: 'html', code: 'html_links', title_ar: 'الروابط والمسارات النسبية', category_ar: 'التنقل', status: 'learning', mastery_percentage: 60 },
        { id: 'sk-h4', subject: 'html', code: 'html_images', title_ar: 'الصور وسهولة الوصول', category_ar: 'الوسائط', status: 'needs_review', mastery_percentage: 45 },
        { id: 'sk-h5', subject: 'html', code: 'html_forms', title_ar: 'النماذج ومدخلات البيانات', category_ar: 'التفاعل', status: 'not_started', mastery_percentage: 0 },
        { id: 'sk-h6', subject: 'html', code: 'html_semantic', title_ar: 'العناصر الدلالية Semantic HTML', category_ar: 'الهيكلة', status: 'not_started', mastery_percentage: 0 },
      ],
      css: [
        { id: 'sk-c1', subject: 'css', code: 'css_selectors', title_ar: 'المحددات والقواعد Selectors', category_ar: 'الأساسيات', status: 'learning', mastery_percentage: 70 },
        { id: 'sk-c2', subject: 'css', code: 'css_colors_units', title_ar: 'الألوان والوحدات', category_ar: 'التصميم', status: 'mastered', mastery_percentage: 95 },
        { id: 'sk-c3', subject: 'css', code: 'css_box_model', title_ar: 'نموذج الصندوق Box Model', category_ar: 'الهيكل', status: 'needs_review', mastery_percentage: 50 },
        { id: 'sk-c4', subject: 'css', code: 'css_flexbox', title_ar: 'الهيكل المرن Flexbox', category_ar: 'التخطيط', status: 'not_started', mastery_percentage: 0 },
        { id: 'sk-c5', subject: 'css', code: 'css_grid', title_ar: 'الشبكة البرمجية CSS Grid', category_ar: 'التخطيط', status: 'not_started', mastery_percentage: 0 },
      ],
      js: [
        { id: 'sk-j1', subject: 'js', code: 'js_variables', title_ar: 'المتغيرات والثوابت', category_ar: 'الأساسيات', status: 'mastered', mastery_percentage: 100 },
        { id: 'sk-j2', subject: 'js', code: 'js_conditions', title_ar: 'الشروط القواعدية If Conditions', category_ar: 'المنطق', status: 'learning', mastery_percentage: 65 },
        { id: 'sk-j3', subject: 'js', code: 'js_functions', title_ar: 'الدوال والـ Scope', category_ar: 'المنطق', status: 'needs_review', mastery_percentage: 40 },
        { id: 'sk-j4', subject: 'js', code: 'js_dom', title_ar: 'التحكم بعناصر DOM', category_ar: 'التفاعل', status: 'not_started', mastery_percentage: 0 },
        { id: 'sk-j5', subject: 'js', code: 'js_events', title_ar: 'الأحداث والأزرار Events', category_ar: 'التفاعل', status: 'not_started', mastery_percentage: 0 },
      ],
    };

    if (!isSupabaseConfigured()) {
      return baseSkills[subject] || [];
    }

    const { data } = await supabase
      .from('student_skill_mastery')
      .select('*, skills(*)')
      .eq('user_id', userId)
      .eq('skills.subject', subject);

    if (!data || data.length === 0) {
      return baseSkills[subject] || [];
    }

    return data.map((d: any) => ({
      id: d.skill_id,
      subject,
      code: d.skills?.code || 'concept',
      title_ar: d.skills?.title_ar || 'مفهوم برمجي',
      category_ar: d.skills?.category_ar || 'تخصص',
      status: d.status || 'not_started',
      mastery_percentage: d.mastery_percentage || 0,
    }));
  }
};
