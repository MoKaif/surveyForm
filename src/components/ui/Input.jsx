import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  label,
  error,
  icon: Icon,
  ...props 
}, ref) => {
  const inputClass = cn(
    'w-full px-4 py-3 text-slate-900 bg-white border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
    error 
      ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
      : 'border-slate-300 focus:ring-primary-500 focus:border-primary-500',
    Icon && 'pl-10',
    className
  );
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          className={inputClass}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;