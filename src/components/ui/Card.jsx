import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ 
  className, 
  children, 
  hover = false,
  padding = 'md',
  ...props 
}, ref) => {
  const baseClass = 'bg-white rounded-xl border border-slate-200 overflow-hidden';
  const hoverClass = hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const CardComponent = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <CardComponent
      ref={ref}
      className={cn(
        baseClass,
        hoverClass,
        paddings[padding],
        'shadow-sm',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = 'Card';

export default Card;