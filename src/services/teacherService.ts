import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Group, Invitation, Profile } from '@/types/database';

export const teacherService = {
  async getGroups(): Promise<Group[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'g1',
          name: 'المجموعة الأولى (أبطال HTML)',
          code: 'GRP-HTML-1',
          description: 'مجموعة المبتدئين في الويب',
          is_active: true,
          leaderboard_enabled: true,
          created_at: new Date().toISOString(),
        },
      ];
    }

    const { data, error } = await supabase.from('groups').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createGroup(name: string, description: string): Promise<Group> {
    const code = `GRP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    if (!isSupabaseConfigured()) {
      return {
        id: `g-${Date.now()}`,
        name,
        code,
        description,
        is_active: true,
        leaderboard_enabled: true,
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('groups')
      .insert({ name, code, description, is_active: true, leaderboard_enabled: true })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createInvitation(groupId: string, maxUses: number = 10): Promise<Invitation> {
    const code = `NAWA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    if (!isSupabaseConfigured()) {
      return {
        id: `inv-${Date.now()}`,
        code,
        group_id: groupId,
        created_by: 'teacher-1',
        max_uses: maxUses,
        used_count: 0,
        expires_at: null,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        code,
        group_id: groupId,
        max_uses: maxUses,
        used_count: 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStudents(): Promise<Profile[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 's1', full_name: 'أحمد محمود', username: 'ahmed_coder', age: 13, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 's2', full_name: 'سارة علي', username: 'sara_web', age: 14, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles!inner(role)')
      .eq('user_roles.role', 'student');

    if (error) throw error;
    return data || [];
  }
};
