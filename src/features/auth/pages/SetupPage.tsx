import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import { ShieldCheck, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setMockUser, checkHasOwner } = useAuth();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !fullName || !username || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        // Sign up with Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, username }
          }
        });

        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('تعذر إنشاء حساب المالك.');

        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          username,
        });

        // Assign owner role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'owner',
        });
      } else {
        // Local state setup
        const mockOwner = { id: 'owner-1', email };
        const mockProfile = {
          id: 'owner-1',
          full_name: fullName,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem('nawa_has_owner', 'true');
        setMockUser(mockOwner, mockProfile, 'owner');
      }

      await checkHasOwner();
      navigate('/teacher', { replace: true });
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إعداد حساب المالك.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between p-4 md:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Logo size="md" showTagline />
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-surface border border-bdr rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Title Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-primary">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-txt-primary mb-2">إعداد حساب المعلم المالك الأول</h1>
            <p className="text-sm text-txt-muted leading-relaxed">
              هذه الصفحة مخصصة لإنشاء حساب المعلم المالك المرة الأولى فقط. بعد التفعيل، ستتعطل هذه الصفحة تلقائياً لتأمين المنصة.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                البريد الإلكتروني للمعلم
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@itqan.edu"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary pl-10 text-left"
                />
                <Mail className="w-4 h-4 text-txt-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                الاسم الكامل
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أ. أسامة أحمد"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                />
                <User className="w-4 h-4 text-txt-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                اسم المستخدم
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="teacher_osama"
                dir="ltr"
                className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary pl-10 text-left"
                />
                <Lock className="w-4 h-4 text-txt-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary pl-10 text-left"
                />
                <CheckCircle2 className="w-4 h-4 text-txt-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري إنشاء الحساب وإغلاق الثغرة...</span>
                </>
              ) : (
                <span>إنشاء حساب المالك وتأمين المنصة</span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان لتعليم البرمجة &copy; {new Date().getFullYear()} — نظام آمن ومحمي.
      </footer>
    </div>
  );
};
