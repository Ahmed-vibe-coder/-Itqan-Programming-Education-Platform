import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'text' | 'list';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 3,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        <div className="h-10 bg-surface-secondary border border-bdr rounded-xl" />
        {items.map((_, i) => (
          <div key={i} className="h-14 bg-surface/60 border border-bdr/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="h-16 bg-surface border border-bdr rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-secondary rounded w-1/3" />
              <div className="h-3 bg-surface-secondary/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 animate-pulse ${className}`}>
        <div className="h-4 bg-surface-secondary rounded w-3/4" />
        <div className="h-4 bg-surface-secondary rounded w-1/2" />
        <div className="h-4 bg-surface-secondary rounded w-5/6" />
      </div>
    );
  }

  // Default: Card Skeleton
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-card border border-bdr rounded-itqan-card p-6 space-y-4 animate-pulse shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary" />
            <div className="w-16 h-6 rounded-lg bg-surface-secondary" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-surface-secondary rounded w-3/4" />
            <div className="h-3 bg-surface-secondary/70 rounded w-full" />
            <div className="h-3 bg-surface-secondary/70 rounded w-2/3" />
          </div>
          <div className="pt-4 border-t border-bdr flex justify-between items-center">
            <div className="w-20 h-4 bg-surface-secondary rounded" />
            <div className="w-24 h-9 bg-orange-500/20 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.FC<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`bg-card border border-bdr rounded-itqan-card p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4 border border-orange-500/20 shadow-itqan-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-extrabold text-txt-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-txt-muted leading-relaxed mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ أثناء تحميل البيانات',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`bg-red-500/10 border border-red-500/30 rounded-itqan-card p-6 sm:p-8 text-center max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-extrabold text-red-600 dark:text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-txt-secondary mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="md" leftIcon={<RefreshCw className="w-4 h-4" />}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}>
      <div className="space-y-1 text-right">
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-1">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-txt-primary tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm sm:text-base text-txt-secondary leading-relaxed max-w-3xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  color?: 'primary' | 'secondary' | 'teal' | 'gold';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  className = '',
}) => {
  const colors = {
    primary: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      border: 'hover:border-orange-500/40',
    },
    secondary: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'hover:border-blue-500/40',
    },
    teal: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      border: 'hover:border-emerald-500/40',
    },
    gold: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-500',
      border: 'hover:border-amber-500/40',
    },
  };

  const style = colors[color];

  return (
    <div className={`bg-card border border-bdr ${style.border} p-5 rounded-itqan-card transition-all shadow-sm flex items-center justify-between gap-4 ${className}`}>
      <div className="text-right">
        <span className="text-xs font-extrabold text-txt-muted block mb-1">{title}</span>
        <span className="text-2xl sm:text-3xl font-black text-txt-primary font-mono">{value}</span>
        {subtitle && <span className="text-[11px] text-txt-muted block mt-1">{subtitle}</span>}
      </div>
      <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 border border-white/5`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: 'active' | 'completed' | 'pending' | 'draft' | 'closed' | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    closed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const displayLabel = label || status;
  const badgeStyle = styles[status] || 'bg-orange-500/10 text-orange-500 border-orange-500/20';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeStyle} ${className}`}>
      {displayLabel}
    </span>
  );
};
