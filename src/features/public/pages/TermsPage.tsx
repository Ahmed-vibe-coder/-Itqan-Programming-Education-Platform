import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { BookOpen } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col justify-between">
      <header className="max-w-5xl mx-auto w-full px-4 py-4 flex items-center justify-between">
        <Link to="/"><Logo size="md" showTagline /></Link>
        <ThemeToggle />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 my-auto">
        <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-lg border-b border-bdr pb-3">
            <BookOpen className="w-6 h-6" />
            <h1>الشروط والأحكام والاستخدام المقبول</h1>
          </div>
          <p className="text-xs text-txt-secondary leading-relaxed">
            يُتفق على استخدام منصة إتقان للأغراض التعليمية البرمجية فقط تحت إشراف وتوجيه المعلم المشرف.
          </p>
        </div>
      </main>

      <footer className="text-center text-xs text-txt-muted py-4">
        منصة إتقان &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
