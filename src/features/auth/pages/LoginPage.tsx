import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import { LogIn, User, Lock, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { UserRole } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/FormControls';

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

        setMockUser({ id: mockProfile.id, email: `${usernameOrEmail}@itqan.edu` }, mockProfile, detectedRole);

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
    <div className="min-h-screen bg-bg flex flex-col justify-between p-4 md:p-8 transition-colors duration-200">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link to="/">
          <Logo size="md" showTagline />
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full my-auto py-8 text-right">
        <Card variant="default" padding="lg" className="shadow-itqan-soft border-orange-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-500 border border-orange-500/20 shadow-itqan-glow">
              <LogIn className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-txt-primary mb-2">تسجيل الدخول</h1>
            <p className="text-sm text-txt-muted font-bold">
              أهلاً بك مجدداً! ادخل حسابك لتستكمل رحلة إتقان التعلم.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="اسم المستخدم أو البريد الإلكتروني"
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="اسم المستخدم أو الإيميل"
              dir="ltr"
              icon={<User className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-txt-primary">
                  كلمة المرور
                </label>
                <Link to="/forgot-password" className="text-xs text-orange-500 hover:underline font-black">
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
                  className="w-full bg-surface text-txt-primary placeholder:text-txt-muted/60 text-sm font-medium rounded-itqan-input border border-bdr px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-txt-muted hover:text-txt-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<LogIn className="w-4 h-4" />}
            >
              دخول المنصة
            </Button>
          </form>

          {/* Join Invitation Box */}
          <div className="mt-8 pt-6 border-t border-bdr text-center">
            <p className="text-xs text-txt-muted mb-3 font-bold">
              لديك كود دعوة أو رمز من المعلم للانضمام لأول مرة؟
            </p>
            <Link to="/register">
              <Button variant="secondary" size="sm" leftIcon={<KeyRound className="w-4 h-4" />}>
                التسجيل بواسطة كود الدعوة
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-txt-muted py-4 font-medium">
        منصة إتقان لتعليم المهارات &copy; {new Date().getFullYear()} — جميع الحقوق محفوظة.
      </footer>
    </div>
  );
};
