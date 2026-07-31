import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ReviewItem {
  id: string;
  userId: string;
  lessonId: string;
  lessonTitle_ar: string;
  conceptCode: string;
  dueDate: string;
  intervalDays: number;
  status: 'due' | 'completed' | 'overdue';
}

export const reviewService = {
  async getDueReviews(userId: string): Promise<ReviewItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'rev-1',
          userId,
          lessonId: 'l1030000-0000-0000-0000-000000000003',
          lessonTitle_ar: 'هيكل مستند HTML الأساسي',
          conceptCode: 'html_doc_structure',
          dueDate: new Date().toISOString().split('T')[0],
          intervalDays: 3,
          status: 'due',
        },
        {
          id: 'rev-2',
          userId,
          lessonId: 'l1030000-0000-0000-0000-000000000004',
          lessonTitle_ar: 'عناصر النصوص والعناوين',
          conceptCode: 'html_headings',
          dueDate: new Date().toISOString().split('T')[0],
          intervalDays: 7,
          status: 'due',
        },
      ];
    }

    const { data } = await supabase
      .from('review_schedules')
      .select('*, lessons(title_ar)')
      .eq('user_id', userId)
      .lte('due_date', new Date().toISOString().split('T')[0]);

    return (data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      lessonId: d.lesson_id,
      lessonTitle_ar: d.lessons?.title_ar || 'درس مراجعة',
      conceptCode: d.concept_code,
      dueDate: d.due_date,
      intervalDays: d.interval_days,
      status: d.status,
    }));
  },

  async recordConfidence(userId: string, questionId: string, confidence: 'sure' | 'think_so' | 'unsure') {
    if (!isSupabaseConfigured()) return;
    await supabase.from('learning_activity_events').insert({
      user_id: userId,
      event_type: 'confidence_response',
      entity_id: questionId,
      metadata: { confidence },
    });
  }
};
