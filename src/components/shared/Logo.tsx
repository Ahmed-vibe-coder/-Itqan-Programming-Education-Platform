import React from 'react';
import { BRAND } from '@/config/brand';

interface LogoProps {
  variant?: 'full' | 'compact' | 'symbol';
  showTagline?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  showTagline = false,
  className = '',
  size = 'md'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Symbol for Itqan */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="itqan-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4355E8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="itqan-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Master Skill Diamond Base */}
          <rect x="20" y="20" width="60" height="60" rx="16" fill="url(#itqan-grad-1)" transform="rotate(45 50 50)" />
          
          {/* Inner Code Bracket Precision Layer */}
          <path
            d="M 38 42 L 30 50 L 38 58"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 62 42 L 70 50 L 62 58"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Mastery Core Dot */}
          <circle cx="50" cy="50" r="5" fill="#10B981" />
        </svg>
      </div>

      {/* Wordmark */}
      {variant !== 'symbol' && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight text-txt-primary font-sans flex items-center gap-1.5 ${textSizes[size]}`}>
            <span className="text-brand-primary">{BRAND.nameAr}</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-txt-muted bg-surface-secondary px-2 py-0.5 rounded-md border border-bdr">
              {BRAND.nameEn}
            </span>
          </div>
          {(showTagline || variant === 'full') && (
            <span className="text-[11px] font-medium text-txt-muted tracking-wide -mt-0.5">
              {BRAND.taglineAr}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
