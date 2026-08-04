import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-itqan-btn border border-bdr bg-surface text-txt-secondary hover:text-txt-primary hover:border-orange-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] ${className}`}
      aria-label={theme === 'dark' ? 'التغيير للوضع الفاتح' : 'التغيير للوضع الداكن'}
      title={theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-orange-500 transition-transform hover:-rotate-12 duration-300" />
      )}
      {showLabel && (
        <span className="text-xs font-extrabold text-txt-primary">
          {theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
        </span>
      )}
    </button>
  );
};
