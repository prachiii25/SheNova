import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className = '',
  isHoverable = false,
  padding = 'default',
  border = true,
  onClick,
  as = 'div',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const Component = isHoverable ? motion.div : as;
  const hoverProps = isHoverable
    ? {
        whileHover: { y: -3, transition: { duration: 0.2 } },
        whileTap: onClick ? { scale: 0.99 } : undefined,
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'bg-surface-card rounded-2xl shadow-soft-sm transition-all duration-200',
        border && 'border border-surface-border',
        isHoverable && 'hover:shadow-soft-md cursor-pointer hover:border-primary-200',
        paddings[padding] || paddings.default,
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Tag = 'h3', ...props }) => (
  <Tag className={cn('font-heading text-lg md:text-xl font-bold text-ink leading-tight', className)} {...props}>
    {children}
  </Tag>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={cn('text-sm text-ink-muted leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={cn('space-y-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={cn('flex items-center pt-4 border-t border-surface-border/60 mt-4', className)} {...props}>
    {children}
  </div>
);

export default Card;
