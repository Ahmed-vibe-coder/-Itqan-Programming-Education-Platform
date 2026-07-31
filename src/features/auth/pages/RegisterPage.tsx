import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import { KeyRound, User, Lock, CheckCircle2, AlertCircle, Sparkles, UserPlus } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

// Safe platform student avatars
const AVATARS = [
  { id: 'av_1', label: 'صقر البرمجة', emoji: '🦅' },
  { id: 'av_2', label: 'فضاء الأكواد', emoji: '🚀' },
  { id: 'av_3', label: 'عبقري الحاسوب', emoji: '💻' },
  { id: 'av_4', label: 'نجم البرمجة', emoji: '⭐' },
  { id: 'av_5', label: 'بطل الخوارزميات', emoji: '🛡️' },
  { id: 'av_6', label: 'مستكشف الحلول', emoji: '🔍' },
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const { setMockUser } = useAuth();

  const [invitationCode, setInvitationCode] = useState(initialCode);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState<number>(12);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!invitationCode || !fullName || !username || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة بما في ذلك كود الدعوة.');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        // Invoke server-side Edge Function for atomic single-use redemption & name matching
        const { data: edgeRes, error: edgeErr } = await supabase.functions.invoke('redeem-single-use-invitation', {
          body: {
            code: invitationCode.trim(),
            studentFullName: fullName.trim(),
            username: username.trim(),
            password: password
          }
        });

        if (edgeErr || (edgeRes && edgeRes.error)) {
          // If function returned explicit error or fallback
          const errorMsg = edgeRes?.error || edgeErr?.message;
          if (errorMsg) throw new Error(errorMsg);

          // Direct DB fallback validation if edge function is in setup mode
          const { data: invData, error: invError } = await supabase
            .from('single_use_invitations')
            .select('*')
            .eq('code', invitationCode.trim())
            .single();

          if (invError || !invData || invData.used_count >= 1 || invData.status !== 'active') {
            throw new Error('كود الدعوة غير صحيح أو أنه تم استخدامه سابقاً.');
          }

          const targetEmail = `${username.trim().toLowerCase()}@itqan.edu.internal`;
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: targetEmail,
            password,
            options: { data: { full_name: fullName, username } }
          });

          if (authError || !authData.user) throw new Error(authError?.message || 'تعذر التسجيل.');

          await supabase.from('profiles').insert({
            id: authData.user.id,
            full_name: fullName,
            username,
            age,
            avatar_url: selectedAvatar
          });

          await supabase.from('user_roles').insert({
            user_id: authData.user.id,
            role: 'student'
          });

          await supabase
            .from('single_use_invitations')
            .update({ status: 'used', used_count: 1, used_by: authData.user.id, used_at: new Date().toISOString() })
            .eq('id', invData.id);
        }

      } else {
        // Local interactive demo registration
        const mockStudent = { id: `student-${Date.now()}`, email: email || `${username}@student.local` };
        const mockProfile = {
          id: mockStudent.id,
          full_name: fullName,
          username,
          age,
          avatar_url: selectedAvatar,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setMockUser(mockStudent, mockProfile, 'student');
      }

      navigate('/app', { replace: true });
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إتمام عملية التسجيل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between p-4 md:p-8">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link to="/">
          <Logo size="md" showTagline />
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Box */}
      <main className="max-w-lg mx-auto w-full my-auto py-6">
        <div className="bg-surface border border-bdr rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-brand-secondary">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-txt-primary mb-2">تسجيل حساب طالب جديد</h1>
            <p className="text-sm text-txt-muted">
              ادخل كود الدعوة الخاص بك للانضمام لأكاديمية إتقان تحت إشراف معلمك.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Invitation Code */}
            <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl mb-4">
              <label className="block text-xs font-bold text-brand-primary mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>كود الدعوة من المعلم (مطلوب)</span>
              </label>
              <input
                type="text"
                required
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                placeholder="NAWA-2026-XYZ"
                dir="ltr"
                className="w-full bg-surface border border-bdr rounded-lg px-4 py-2.5 text-base font-mono font-bold tracking-wider text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 uppercase text-center"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>اختر الصورة الرمزية الخاصة بك</span>
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    title={av.label}
                    className={`h-12 rounded-xl flex items-center justify-center text-2xl border transition-all ${
                      selectedAvatar === av.id
                        ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30 scale-105'
                        : 'border-bdr bg-surface-secondary hover:border-bdr-strong'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  اسم المستخدم (بالإنجليزي)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="mohamed_coder"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-left"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  العمر (من 10 إلى 15 سنة)
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                >
                  {[10, 11, 12, 13, 14, 15].map((a) => (
                    <option key={a} value={a}>
                      {a} سنة
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Email */}
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-left"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-left"
                />
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
                  <span>جاري إنشاء الحساب والتأكد من كود الدعوة...</span>
                </>
              ) : (
                <span>الانضمام للمنصة والبدء فوراً</span>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 pt-6 border-t border-bdr text-center">
            <span className="text-xs text-txt-muted">لديك حساب بالفعل؟ </span>
            <Link to="/login" className="text-xs font-semibold text-brand-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان لتعليم البرمجة &copy; {new Date().getFullYear()} — بيئة تعليمية خاصة وآمنة.
      </footer>
    </div>
  );
};
