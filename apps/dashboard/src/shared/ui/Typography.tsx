import React from 'react';
import { cn } from '@/shared/lib/utils';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  children,
  className,
  as,
}) => {
  const Component = as || (variant.startsWith('h') ? variant : 'p');

  const styles = {
    h1: 'text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]',
    h2: 'text-4xl md:text-5xl font-semibold tracking-tight text-white',
    h3: 'text-2xl md:text-3xl font-semibold text-white',
    h4: 'text-xl font-medium text-white',
    p: 'text-base md:text-lg text-text-main leading-relaxed',
    small: 'text-sm font-medium leading-none',
    muted: 'text-sm text-text-muted',
  };

  return (
    <Component className={cn(styles[variant], className)}>
      {children}
    </Component>
  );
};
