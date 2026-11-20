import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({
  className = '',
  variant = 'text',
  width,
  height,
  rounded = 'rounded-xl',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    title: 'h-7 w-3/4 rounded-lg',
    circular: 'rounded-full aspect-square',
    rectangular: 'w-full h-32 rounded-xl',
    card: 'w-full h-48 rounded-2xl',
  };

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        'animate-pulse bg-gradient-to-r from-surface-subtle via-primary-50/50 to-surface-subtle bg-[length:200%_100%]',
        variantStyles[variant] || '',
        rounded,
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
