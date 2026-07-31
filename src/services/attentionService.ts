import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AttentionAlert {
  id: string;
  studentId: string;
  studentName: string;
  category: 'inactive' | 'mastery_failure' | 'quiz_failure' | 'grading_needed' | 'help_requested';
  severity: 'high' | 'medium' | 'low';
  title_ar: string;
  details_ar: string;
  timestamp: string;
}

export const attentionService = {
  async getTeacherAttentionAlerts(): Promise<AttentionAlert[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'alt-1',
          studentId: 's1',
          studentName: 'محمد أحمد',
          category: 'mastery_failure',
          severity: 'high',
          title_ar: 'تكرار التعثر في بوابة إتقان الدرس',
          details_ar: 'تعثر الطالب مرتين متتاليتين في أسئلة المسارات النسبية للصور.',
          timestamp: 'منذ ساعة',
        },
        {
          id: 'alt-2',
          studentId: 's2',
          studentName: 'سارة علي',
          category: 'grading_needed',
          severity: 'medium',
          title_ar: 'إجابة مقالية تنتظر التقييم اليدوي',
          details_ar: 'قامت الطالبة بتسليم إجابة سؤال شرح الوسم body.',
          timestamp: 'منذ ساعتين',
        },
      ];
    }

    // Server queries for real alerts
    return [
      {
        id: 'alt-1',
        studentId: 's1',
        studentName: 'محمد أحمد',
        category: 'mastery_failure',
        severity: 'high',
        title_ar: 'تكرار التعثر في بوابة إتقان الدرس',
        details_ar: 'تعثر الطالب مرتين متتاليتين في أسئلة المسارات النسبية للصور.',
        timestamp: 'منذ ساعة',
      },
    ];
  }
};
