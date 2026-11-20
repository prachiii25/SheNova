import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'secondary',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200/60',
    secondary: 'bg-secondary text-primary-800 border border-primary-100',
    accent: 'bg-accent-50 text-accent-700 border border-accent-200',
    neutral: 'bg-surface-subtle text-ink-muted border border-ink-border/50',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    outline: 'border border-primary-200 text-primary-700 bg-white/70',
    demo: 'bg-purple-100 text-purple-800 border border-purple-300 font-mono text-[11px]',
  };

  const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-primary-600',
    accent: 'bg-accent-500',
    neutral: 'bg-ink-muted',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    outline: 'bg-primary-400',
    demo: 'bg-purple-600',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-medium gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-wide transition-colors',
        variants[variant] || variants.secondary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0 animate-pulse',
            dotColors[variant] || 'bg-primary-500'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
