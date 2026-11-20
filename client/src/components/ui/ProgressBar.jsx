import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const ProgressBar = ({
  value = 0,
  max = 100,
  height = 'md',
  variant = 'primary',
  showLabel = false,
  labelPosition = 'right',
  label,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedValue / max) * 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    primary: 'bg-primary-600',
    accent: 'bg-accent-500',
    success: 'bg-emerald-500',
    gradient: 'bg-gradient-to-r from-primary-600 to-accent-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && labelPosition === 'top' && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-ink-light">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold text-ink">{percentage}%</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-full bg-surface-subtle overflow-hidden rounded-full p-0.5 border border-surface-border',
            heights[height] || heights.md
          )}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full transition-all',
              variants[variant] || variants.primary
            )}
          />
        </div>

        {(showLabel || label) && labelPosition === 'right' && (
          <span className="text-xs font-semibold text-ink shrink-0 min-w-8 text-right">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
