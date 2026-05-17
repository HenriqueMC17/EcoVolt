"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Heading = ({ 
  children, 
  className, 
  as: Component = "h2" 
}: TypographyProps) => {
  const baseStyles = "font-display font-bold tracking-tighter text-slate-900 dark:text-white text-balance transition-colors";
  
  const sizeStyles = Component === "h1" 
    ? "text-5xl md:text-7xl lg:text-8xl leading-[0.95]" 
    : Component === "h2" 
    ? "text-4xl md:text-6xl leading-[1.1]"
    : Component === "h3"
    ? "text-2xl md:text-4xl leading-tight"
    : "text-xl md:text-2xl font-bold";

  return (
    <Component className={cn(baseStyles, sizeStyles, className)}>
      {children}
    </Component>
  );
};

export const Paragraph = ({ 
  children, 
  className, 
  as: Component = "p" 
}: TypographyProps) => {
  return (
    <Component className={cn(
      "text-slate-500 dark:text-slate-400 font-medium leading-relaxed tracking-tight transition-colors",
      className
    )}>
      {children}
    </Component>
  );
};

export const Subheading = ({ children, className }: TypographyProps) => (
  <span className={cn(
    "text-emerald-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block",
    className
  )}>
    {children}
  </span>
);
