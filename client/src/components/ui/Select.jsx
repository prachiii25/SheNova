import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Select = forwardRef(({
  label,
  options = [],
  children,
  error,
  helperText,
  className = '',
  containerClassName = '',
  id,
  disabled = false,
  required = false,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-ink uppercase tracking-wider font-heading"
        >
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full bg-white text-ink text-sm rounded-xl border border-surface-border pl-3.5 pr-10 py-2.5 transition-all duration-200 outline-none appearance-none cursor-pointer',
            'hover:border-primary-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10',
            disabled && 'bg-surface-subtle opacity-70 cursor-not-allowed',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => {
                const val = typeof opt === 'object' ? opt.value : opt;
                const lab = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={val} value={val}>
                    {lab}
                  </option>
                );
              })
            : children}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-ink-subtle flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-ink-muted">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
