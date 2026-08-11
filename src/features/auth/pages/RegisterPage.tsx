import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import { KeyRound, User, Lock, CheckCircle2, AlertCircle, Sparkles, UserPlus } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/FormControls';

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
        const { data: edgeRes, error: edgeErr } = await supabase.functions.invoke('redeem-single-use-invitation', {
          body: {
            code: invitationCode.trim(),
            studentFullName: fullName.trim(),
            username: username.trim(),
            password: password
          }
        });

        if (edgeErr || (edgeRes && edgeRes.error)) {
          const errorMsg = edgeRes?.error || edgeErr?.message;
          if (errorMsg) throw new Error(errorMsg);

          const { data: invData, error: invError } = await supabase
            .from('single_use_invitations')
            .select('*')
            .eq('code', invitationCode.trim())
            .single();

          if (invError || !invData || invData.used_count >= 1 || invData.status !== 'active') {
            throw new Error('كود الدعوة غير صحيح أو أنه تم استخدامه سابقاً.');
          }

          const targetEmail = `${username.trim().toLowerCase()}@itqan.edu.internal`;
          const redirectUrl = `${window.location.origin}/login`;
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: targetEmail,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              data: { full_name: fullName, username }
            }
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
        const mockStudent = { id: `student-${Date.now()}`, email: email || `${username}@itqan.local` };
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
    <div className="min-h-screen bg-bg flex flex-col justify-between p-4 md:p-8 transition-colors duration-200">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link to="/">
          <Logo size="md" showTagline />
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Box */}
      <main className="max-w-lg mx-auto w-full my-auto py-6 text-right">
        <Card variant="default" padding="lg" className="shadow-itqan-soft border-orange-500/20">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-orange-500 border border-orange-500/20 shadow-itqan-glow">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-txt-primary mb-2">تسجيل حساب طالب جديد</h1>
            <p className="text-sm text-txt-muted font-bold">
              ادخل كود الدعوة الخاص بك للانضمام لمنصة إتقان تحت إشراف معلمك.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Invitation Code */}
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-itqan-card mb-4 text-right">
              <label className="block text-xs font-black text-orange-500 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>كود الدعوة من المعلم (مطلوب)</span>
              </label>
              <input
                type="text"
                required
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                placeholder="ITQAN-2026-XYZ"
                dir="ltr"
                className="w-full bg-surface border border-orange-500/40 rounded-itqan-input px-4 py-2.5 text-base font-mono font-black tracking-wider text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 uppercase text-center"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-black text-txt-primary mb-2 flex items-center gap-1">
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
                        ? 'border-orange-500 bg-orange-500/15 ring-2 ring-orange-500/30 scale-105'
                        : 'border-bdr bg-surface-secondary hover:border-bdr-strong'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="الاسم الكامل"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد أحمد"
              />

              <Input
                label="اسم المستخدم (بالإنجليزي)"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="mohamed_coder"
                dir="ltr"
              />
            </div>

            <Input
              label="البريد الإلكتروني (اختياري)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              dir="ltr"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="كلمة المرور"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
              />

              <Input
                label="تأكيد كلمة المرور"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              size="lg"
              fullWidth
            >
              الانضمام للمنصة والبدء فوراً
            </Button>
          </form>

          {/* Already have account */}
          <div className="mt-6 pt-6 border-t border-bdr text-center">
            <span className="text-xs text-txt-muted font-bold">لديك حساب بالفعل؟ </span>
            <Link to="/login" className="text-xs font-black text-orange-500 hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-txt-muted py-4 font-medium">
        منصة إتقان التعليمية &copy; {new Date().getFullYear()} — جميع الحقوق محفوظة.
      </footer>
    </div>
  );
};
