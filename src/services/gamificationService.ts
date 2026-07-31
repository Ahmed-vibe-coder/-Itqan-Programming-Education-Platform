import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { XPTransaction, AchievementDefinition, StudentStreak } from '@/types/database';

export const gamificationService = {
  async getUserXP(userId: string): Promise<number> {
    if (!isSupabaseConfigured()) return 250;

    const { data, error } = await supabase
      .from('xp_transactions')
      .select('points')
      .eq('user_id', userId);

    if (error || !data) return 0;
    return data.reduce((sum, tx) => sum + tx.points, 0);
  },

  async awardXP(userId: string, points: number, eventType: string, idempotencyKey: string) {
    if (!isSupabaseConfigured()) return;

    await supabase.from('xp_transactions').insert({
      user_id: userId,
      points,
      event_type: eventType,
      idempotency_key: idempotencyKey,
    });
  },

  async getUserStreak(userId: string): Promise<StudentStreak | null> {
    if (!isSupabaseConfigured()) {
      return {
        user_id: userId,
        current_streak: 3,
        longest_streak: 5,
        last_activity_date: new Date().toISOString().split('T')[0],
      };
    }

    const { data } = await supabase
      .from('student_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || null;
  },

  async getAchievements(): Promise<AchievementDefinition[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 'a1', code: 'first_step', title_ar: 'أول خطوة', description_ar: 'سجلت دخولك وبدأت رحلتك!', badge_icon: '🦅', xp_reward: 25 },
        { id: 'a2', code: 'first_lesson', title_ar: 'أول درس مكتمل', description_ar: 'أكملت درسك الأول بنجاح.', badge_icon: '🎖️', xp_reward: 50 },
      ];
    }

    const { data, error } = await supabase.from('achievement_definitions').select('*');
    if (error) throw error;
    return data || [];
  }
};
