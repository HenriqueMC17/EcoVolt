"use client";
import React from 'react';
import { cn } from '@/shared/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva(
  "transition-colors duration-200",
  {
    variants: {
      variant: {
        h1: "text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85]",
        h2: "text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic",
        h3: "text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic",
        h4: "text-xl md:text-2xl font-bold tracking-tight text-white uppercase",
        p: "text-base md:text-lg text-slate-400 leading-relaxed",
        small: "text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic",
        muted: "text-sm text-slate-600 font-medium",
        system: "font-mono text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-black italic",
      },
      mono: {
        true: "font-mono",
        false: "",
      },
    },
    defaultVariants: {
      variant: "p",
      mono: false,
    },
  }
);

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  mono,
  children,
  className,
  as,
}) => {
  const getDefaultElement = () => {
    if (variant === 'h1') return 'h1';
    if (variant === 'h2') return 'h2';
    if (variant === 'h3') return 'h3';
    if (variant === 'h4') return 'h4';
    if (variant === 'small') return 'small';
    return 'p';
  };

  const Component = as || getDefaultElement();

  return (
    <Component className={cn(typographyVariants({ variant, mono, className }))}>
      {children}
    </Component>
  );
};

