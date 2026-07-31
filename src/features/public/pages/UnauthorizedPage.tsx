import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col justify-between p-4">
      <header className="max-w-5xl mx-auto w-full py-4 flex items-center justify-between">
        <Link to="/"><Logo size="md" showTagline /></Link>
        <ThemeToggle />
      </header>

      <main className="max-w-md mx-auto w-full my-auto text-center space-y-6 bg-surface border border-bdr p-8 rounded-3xl shadow-sm">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-txt-primary">غير مصرح بالوصول</h1>
        <p className="text-xs text-txt-muted leading-relaxed">
          عذراً، هذه الصفحة محجوبة أو لا تملك الصلاحية الكافية لعرضها.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-sm"
        >
          <span>العودة لتسجيل الدخول</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>

      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
