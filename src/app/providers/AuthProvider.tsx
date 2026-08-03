import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, Profile } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  hasOwner: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  checkHasOwner: () => Promise<boolean>;
  setMockUser: (user: any, profile: Profile, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasOwner, setHasOwner] = useState<boolean>(false);

  const checkHasOwner = async (): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured()) {
        const storedOwner = localStorage.getItem('nawa_has_owner');
        const exists = storedOwner === 'true';
        setHasOwner(exists);
        return exists;
      }
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'owner')
        .limit(1);

      if (error) throw error;
      const exists = (data && data.length > 0) || false;
      setHasOwner(exists);
      return exists;
    } catch (err) {
      console.warn('Error checking owner status:', err);
      return false;
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    try {
      await checkHasOwner();
      if (!isSupabaseConfigured()) {
        // Check local storage mock session
        const storedUser = localStorage.getItem('nawa_mock_session');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (typeof parsed !== 'object' || parsed === null) {
              throw new Error('Invalid session object in localStorage');
            }
            setUser(parsed.user ?? null);
            setProfile(parsed.profile ?? null);
            setRole(parsed.role ?? null);
          } catch (e) {
            console.error('Failed to parse nawa_mock_session:', e);
            localStorage.removeItem('nawa_mock_session');
            setUser(null);
            setProfile(null);
            setRole(null);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch profile and role
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setProfile(profileData || null);
        setRole((roleData?.role as UserRole) || null);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Session refresh error:', err);
      setUser(null);
      setProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'].includes(event)) {
        if (session?.user) {
          setUser(session.user);
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            setProfile(profileData || null);
            setRole((roleData?.role as UserRole) || null);
          } catch {
            setProfile(null);
            setRole(null);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('nawa_mock_session');
    }
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const setMockUser = (mockUser: any, mockProfile: Profile, mockRole: UserRole) => {
    setUser(mockUser);
    setProfile(mockProfile);
    setRole(mockRole);
    localStorage.setItem(
      'nawa_mock_session',
      JSON.stringify({ user: mockUser, profile: mockProfile, role: mockRole })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        hasOwner,
        logout,
        refreshSession,
        checkHasOwner,
        setMockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
