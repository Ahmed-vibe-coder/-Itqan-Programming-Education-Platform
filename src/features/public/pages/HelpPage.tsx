import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { HelpCircle, Mail } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col justify-between">
      <header className="max-w-5xl mx-auto w-full px-4 py-4 flex items-center justify-between">
        <Link to="/"><Logo size="md" showTagline /></Link>
        <ThemeToggle />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 my-auto">
        <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-4 shadow-sm text-center">
          <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-txt-primary">المساعدة والدعم الفني</h1>
          <p className="text-xs text-txt-muted leading-relaxed">
            إذا واجهتك أية مشكلة في تسجيل الدخول أو رموز الدعوات، تواصل مباشرة مع معلمك المشرف أو عبر البريد الإلكتروني المعتمد.
          </p>
          <div className="p-4 bg-surface-secondary border border-bdr rounded-2xl inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
            <Mail className="w-4 h-4" />
            <span>support@itqan.edu</span>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
