import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables or fallback safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-nawa-code.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-nawa-code.supabase.co'
  );
};
