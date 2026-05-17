"use client";

import React from "react";
import { m as motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { theme } from "@/shared/lib/theme";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "light" | "dark" | "transparent";
  hover?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "light", 
  hover = true,
  ...props 
}: GlassCardProps) => {
  const variants = {
    light: "glass border-border/40 bg-background/70",
    dark: "glass-dark border-white/10 bg-slate-900/60",
    transparent: "bg-transparent border-border/60 shadow-none",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: theme.animations.durations.fast } } : undefined}
      className={cn(
        "rounded-[2.5rem] border overflow-hidden p-6 transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
