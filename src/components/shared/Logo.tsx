import React from 'react';
import { BRAND } from '@/config/brand';

interface LogoProps {
  variant?: 'full' | 'compact' | 'symbol';
  showTagline?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Sleek Master Itqan Symbol SVG */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="itqan-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="itqan-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>

          {/* Master Shield / Knowledge Card Frame */}
          <rect x="12" y="12" width="76" height="76" rx="22" fill="url(#itqan-primary-grad)" />

          {/* Abstract 'إ' Alif-Hamza + Book / Checkmark Geometry */}
          {/* Left Book Page / Checkmark Path */}
          <path
            d="M 32 64 L 46 74 L 72 34"
            stroke="#FFFFFF"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Knowledge Spark (Hamza Spark Dot) */}
          <circle cx="68" cy="24" r="5" fill="url(#itqan-gold-grad)" />

          {/* Inner Accent Line representing progress path */}
          <path
            d="M 28 36 L 44 36"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {variant !== 'symbol' && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight text-txt-primary flex items-center gap-2 ${textSizes[size]}`}>
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              {BRAND.nameAr}
            </span>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-orange-500/90 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              {BRAND.nameEn}
            </span>
          </div>
          {(showTagline || variant === 'full') && (
            <span className="text-[11px] font-medium text-txt-muted tracking-wide -mt-0.5 truncate">
              {BRAND.taglineAr}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
