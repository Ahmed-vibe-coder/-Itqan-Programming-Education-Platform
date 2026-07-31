import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl border border-bdr bg-surface text-txt-secondary hover:text-txt-primary hover:border-bdr-strong transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 flex items-center justify-center gap-2 ${className}`}
      aria-label={theme === 'dark' ? 'التغيير للوضع الفاتح' : 'التغيير للوضع الداكن'}
      title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 animate-spin-once" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600" />
      )}
    </button>
  );
};
