import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserRole, Profile } from '@/types/database';

export const authService = {
  async getHasOwner(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return localStorage.getItem('nawa_has_owner') === 'true';
    }
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'owner')
      .limit(1);

    if (error) return false;
    return (data && data.length > 0) || false;
  },

  async validateInvitation(code: string) {
    if (!isSupabaseConfigured()) {
      if (code.toUpperCase().startsWith('NAWA')) {
        return { id: 'inv-1', code, group_id: 'grp-1', is_active: true, used_count: 0, max_uses: 10 };
      }
      throw new Error('كود الدعوة غير صحيح.');
    }

    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('كود الدعوة غير صحيح أو غير مفعّل.');
    }

    if (data.max_uses && data.used_count >= data.max_uses) {
      throw new Error('لقد وصل كود الدعوة للحد الأقصى للاستخدام.');
    }

    return data;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return data || null;
  },

  async getRole(userId: string): Promise<UserRole | null> {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();
    return (data?.role as UserRole) || null;
  }
};
