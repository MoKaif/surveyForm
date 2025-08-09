import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}) => {
  const baseClass = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-slate-100 text-slate-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };
  
  return (
    <span
      className={cn(
        baseClass,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;