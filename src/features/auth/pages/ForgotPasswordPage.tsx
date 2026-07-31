import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between p-4 md:p-8">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link to="/"><Logo size="md" showTagline /></Link>
        <ThemeToggle />
      </header>

      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-surface border border-bdr rounded-2xl p-6 md:p-8 shadow-sm text-center space-y-6">
          <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto text-brand-primary">
            <Mail className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-txt-primary">استعادة كلمة المرور</h1>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  البريد الإلكتروني المسجل
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-3 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-left"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all"
              >
                إرسال رابط إعادة التعيين
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>تم إرسال تعليمات إعادة التعيين إلى بريدك الإلكتروني!</span>
            </div>
          )}

          <div className="pt-4 border-t border-bdr">
            <Link to="/login" className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1">
              <ArrowRight className="w-4 h-4" />
              <span>العودة لصفحة تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
