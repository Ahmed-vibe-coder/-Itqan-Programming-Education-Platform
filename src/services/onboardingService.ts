import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface OnboardingState {
  userId: string;
  isCompleted: boolean;
  priorExperience: 'none' | 'basic' | 'intermediate';
  selectedGoal?: string;
  placementStatus: 'pending' | 'completed' | 'skipped';
}

export const onboardingService = {
  async getOnboardingState(userId: string): Promise<OnboardingState | null> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(`nawa_onboarding_${userId}`);
      if (stored) return JSON.parse(stored);
      return {
        userId,
        isCompleted: false,
        priorExperience: 'none',
        placementStatus: 'pending',
      };
    }

    const { data } = await supabase
      .from('student_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!data) {
      return {
        userId,
        isCompleted: false,
        priorExperience: 'none',
        placementStatus: 'pending',
      };
    }

    return {
      userId: data.user_id,
      isCompleted: data.is_completed,
      priorExperience: data.prior_experience,
      selectedGoal: data.selected_goal,
      placementStatus: data.placement_status,
    };
  },

  async saveOnboarding(state: OnboardingState) {
    if (!isSupabaseConfigured()) {
      localStorage.setItem(`nawa_onboarding_${state.userId}`, JSON.stringify(state));
      return;
    }

    await supabase.from('student_onboarding').upsert({
      user_id: state.userId,
      is_completed: state.isCompleted,
      prior_experience: state.priorExperience,
      selected_goal: state.selectedGoal,
      placement_status: state.placementStatus,
      completed_at: state.isCompleted ? new Date().toISOString() : null,
    });
  }
};
