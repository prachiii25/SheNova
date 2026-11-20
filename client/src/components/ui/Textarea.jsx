import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  id,
  rows = 4,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-ink uppercase tracking-wider font-heading"
        >
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full bg-white text-ink text-sm rounded-xl border border-surface-border px-3.5 py-2.5 transition-all duration-200 outline-none resize-y',
          'placeholder:text-ink-subtle placeholder:text-sm',
          'hover:border-primary-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10',
          disabled && 'bg-surface-subtle opacity-70 cursor-not-allowed',
          className
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-ink-muted">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
