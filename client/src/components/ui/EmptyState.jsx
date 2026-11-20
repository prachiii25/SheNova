import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import Badge from './Badge';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action,
  isDemo = false,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-white border border-surface-border/80 shadow-soft-sm max-w-lg mx-auto my-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary-600 mb-4 shadow-soft-sm">
        <Icon className="w-7 h-7" />
      </div>

      {isDemo && (
        <Badge variant="demo" size="sm" className="mb-3">
          Sample / Demo State
        </Badge>
      )}

      <h4 className="font-heading text-lg font-bold text-ink mb-1.5">{title}</h4>
      <p className="text-sm text-ink-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
