import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const disabled = isDisabled || isLoading;

  const baseStyles = 'inline-flex items-center justify-center font-medium font-heading transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft-sm hover:shadow-soft-md shadow-primary-600/20 active:bg-primary-800',
    secondary: 'bg-secondary text-primary-800 hover:bg-secondary-hover active:bg-secondary-active font-semibold',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-soft-sm hover:shadow-soft-md shadow-accent-500/20',
    outline: 'border border-primary-200 bg-white hover:bg-primary-50 text-primary-700 hover:border-primary-300',
    ghost: 'text-ink-light hover:text-primary-700 hover:bg-primary-50/70',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 h-10',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 h-12',
    icon: 'p-2 rounded-xl h-10 w-10',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner
            size="sm"
            color={variant === 'primary' || variant === 'accent' || variant === 'danger' ? 'white' : 'primary'}
          />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
