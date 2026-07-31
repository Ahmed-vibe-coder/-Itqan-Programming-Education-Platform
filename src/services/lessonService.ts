import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Lesson, LessonBlock, LessonProgress } from '@/types/database';

export const lessonService = {
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    if (!isSupabaseConfigured()) {
      return {
        id: lessonId,
        module_id: 'b1000000-0000-0000-0000-000000000001',
        title_ar: 'هيكل مستند HTML الأساسي',
        slug: 'html-document-structure',
        estimated_minutes: 15,
        order_index: 3,
        status: 'published',
        version: 1,
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) return null;
    return data;
  },

  async getLessonBlocks(lessonId: string): Promise<LessonBlock[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'b1',
          lesson_id: lessonId,
          block_type: 'heading',
          content: { text_ar: 'ما هو هيكل صفحة الويب؟' },
          order_index: 1,
        },
        {
          id: 'b2',
          lesson_id: lessonId,
          block_type: 'analogy',
          content: {
            title_ar: 'تأطير اللوحة',
            text_ar: 'تخيل أن صفحة الويب مثل الورقة البيضاء في برواز...',
          },
          order_index: 2,
        },
        {
          id: 'b3',
          lesson_id: lessonId,
          block_type: 'code',
          content: {
            language: 'html',
            caption_ar: 'الهيكل القياسي لمستند HTML5',
            code: `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n  <head>\n    <title>صفحتي الأولى</title>\n  </head>\n  <body>\n    <h1>أهلاً بكم في موقعي!</h1>\n  </body>\n</html>`,
          },
          order_index: 3,
        },
      ];
    }

    const { data, error } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    if (!isSupabaseConfigured()) {
      return {
        id: 'lp-1',
        user_id: userId,
        lesson_id: lessonId,
        status: 'in_progress',
        reading_progress: 50,
        updated_at: new Date().toISOString(),
      };
    }

    const { data } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    return data || null;
  },

  async updateWorkspaceDraft(userId: string, lessonId: string, html: string, css: string, js: string) {
    if (!isSupabaseConfigured()) {
      localStorage.setItem(`nawa_draft_${lessonId}`, JSON.stringify({ html, css, js }));
      return;
    }

    await supabase.from('code_workspaces').upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        html_code: html,
        css_code: css,
        js_code: js,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );
  }
};
