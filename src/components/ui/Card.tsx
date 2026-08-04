import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "bg-card text-txt-primary border border-bdr rounded-itqan-card transition-all duration-200";

  const variantStyles = {
    default: "shadow-sm",
    elevated: "bg-surface-elevated shadow-itqan-soft border-bdr-strong",
    glass: "itqan-glass shadow-lg border-white/10",
    interactive: "itqan-card-glow cursor-pointer hover:border-orange-500/40 hover:bg-card-hover",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-3 md:p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
