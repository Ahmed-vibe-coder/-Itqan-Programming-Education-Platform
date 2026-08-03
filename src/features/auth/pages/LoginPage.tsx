import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import { LogIn, User, Lock, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { UserRole } from '@/types/database';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, setMockUser, refreshSession } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (role === 'teacher' || role === 'owner') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/app', { replace: true });
      }
    }
  }, [user, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usernameOrEmail || !password) {
      setError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const isEmailInput = usernameOrEmail.includes('@');
        let authEmail = usernameOrEmail;

        if (!isEmailInput) {
          // Fetch profile by username to get registered email
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('username', usernameOrEmail)
            .single();

          if (!profileData || !(profileData as any).email) {
            throw new Error('اسم المستخدم/البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          }
          authEmail = (profileData as any).email;
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (signInError) throw signInError;
        if (data.user) {
          await refreshSession();

          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .single();

          const userRole = roleData?.role as UserRole | undefined;
          if (userRole === 'teacher' || userRole === 'owner') {
            navigate('/teacher', { replace: true });
          } else {
            navigate('/app', { replace: true });
          }
        }
      } else {
        // Safe interactive demo login logic
        let detectedRole: UserRole = 'student';
        let mockName = 'طالب إتقان';

        if (usernameOrEmail.toLowerCase().includes('teacher') || usernameOrEmail.toLowerCase().includes('owner')) {
          detectedRole = 'teacher';
          mockName = 'أ. أسامة (المعلم)';
        }

        const mockProfile = {
          id: detectedRole === 'teacher' ? 'teacher-1' : 'student-1',
          full_name: mockName,
          username: usernameOrEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setMockUser({ id: mockProfile.id, email: `${usernameOrEmail}@nawa.edu` }, mockProfile, detectedRole);

        if (detectedRole === 'teacher') {
          navigate('/teacher', { replace: true });
        } else {
          navigate('/app', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول غير صحيحة. يرجى التأكد وإعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link to="/">
          <Logo size="md" showTagline />
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-surface border border-bdr rounded-2xl p-6 md:p-8 shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-primary border border-brand-primary/20">
              <LogIn className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-txt-primary mb-2">تسجيل الدخول</h1>
            <p className="text-sm text-txt-muted">
              أهلاً بك مجدداً! ادخل حسابك لتستكمل رحلة إتقان البرمجة.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="اسم المستخدم أو الإيميل"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary pl-10 text-left"
                />
                <User className="w-4 h-4 text-txt-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-txt-secondary">
                  كلمة المرور
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-primary hover:underline font-bold"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary pl-10 text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-txt-muted hover:text-txt-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] w-full bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول المنصة</span>
                  <LogIn className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Join Invitation Box */}
          <div className="mt-8 pt-6 border-t border-bdr text-center">
            <p className="text-xs text-txt-muted mb-3">
              لديك كود دعوة أو رمز من المعلم للانضمام لأول مرة؟
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-primary-hover bg-brand-primary/10 hover:bg-brand-primary/20 px-4 py-2.5 rounded-xl transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>التسجيل بواسطة كود الدعوة</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان لتعليم البرمجة &copy; {new Date().getFullYear()} — جميع الحقوق محفوظة.
      </footer>
    </div>
  );
};
