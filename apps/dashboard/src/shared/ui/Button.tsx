import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary text-black hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    outline: 'border border-white/10 text-white hover:bg-white/5',
    ghost: 'text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-widest',
    md: 'px-6 py-3 text-sm font-medium',
    lg: 'px-8 py-4 text-base font-semibold',
    icon: 'p-3 text-sm flex items-center justify-center',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
