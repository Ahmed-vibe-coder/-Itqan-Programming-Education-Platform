import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface MistakeEntry {
  id: string;
  userId: string;
  concept_ar: string;
  source_type: 'mastery' | 'exam' | 'practice';
  question_prompt: string;
  student_answer?: string;
  explanation_ar: string;
  lesson_id?: string;
  repetitions: number;
  review_status: 'unreviewed' | 'reviewing' | 'mastered' | 'needs_help';
  created_at: string;
}

export const mistakeService = {
  async getStudentMistakes(userId: string): Promise<MistakeEntry[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'mistake-1',
          userId,
          concept_ar: 'الفرق بين head و body',
          source_type: 'mastery',
          question_prompt: 'أي وسم يضم العناصر المرئية للزائر؟',
          student_answer: '<head>',
          explanation_ar: 'الوسم <head> للبيانات الخفية بينما <body> يحتوي على المحتوى المرئي على الشاشة.',
          repetitions: 2,
          review_status: 'unreviewed',
          created_at: new Date().toISOString(),
        },
        {
          id: 'mistake-2',
          userId,
          concept_ar: 'المسارات النسبية للصور',
          source_type: 'exam',
          question_prompt: 'كيف نشير لصورة في نفس المجلد؟',
          student_answer: 'images/src',
          explanation_ar: 'نستخدم المسار المباشر مثل ./image.png أو باسم الملف مباشرة.',
          repetitions: 1,
          review_status: 'reviewing',
          created_at: new Date().toISOString(),
        },
      ];
    }

    const { data } = await supabase
      .from('mistake_notebook_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data || [];
  },

  async updateMistakeStatus(id: string, status: MistakeEntry['review_status']) {
    if (!isSupabaseConfigured()) return;
    await supabase
      .from('mistake_notebook_entries')
      .update({ review_status: status, updated_at: new Date().toISOString() })
      .eq('id', id);
  }
};
