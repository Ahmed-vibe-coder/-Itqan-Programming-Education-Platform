import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-itqan-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 border border-orange-400/20",
    secondary: "bg-surface-secondary text-txt-primary hover:bg-card-hover border border-bdr hover:border-orange-500/30",
    outline: "bg-transparent text-orange-500 hover:bg-orange-500/10 border border-orange-500/40 hover:border-orange-500",
    ghost: "bg-transparent text-txt-secondary hover:text-txt-primary hover:bg-surface-secondary",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 h-8 min-h-[32px]",
    md: "px-4 py-2.5 text-sm gap-2 h-11 min-h-[44px]",
    lg: "px-6 py-3 text-base gap-2.5 h-12 min-h-[48px]",
    icon: "p-2.5 text-sm h-11 w-11 min-h-[44px] min-w-[44px]",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
