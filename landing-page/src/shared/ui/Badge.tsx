"use client";

import React from "react";
import { m as motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { theme } from "@/shared/lib/theme";

interface BadgeProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "outline" | "success" | "blue" | "glass";
  size?: "sm" | "md";
}

export const Badge = ({ 
  children, 
  className, 
  variant = "default", 
  size = "md",
  ...props 
}: BadgeProps) => {
  const variants = {
    default: "bg-slate-50 border-slate-200 text-slate-500",
    outline: "bg-transparent border-slate-200 text-slate-500",
    success: "bg-ecovolt-green-50 border-ecovolt-green-100 text-ecovolt-green-600",
    blue: "bg-ecovolt-blue-50 border-ecovolt-blue-100 text-ecovolt-blue-600",
    glass: "glass border-white/40 text-slate-600 shadow-sm",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1.5 text-xs",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: theme.animations.durations.normal, ease: theme.animations.easing.premium }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-bold tracking-tight shadow-sm",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
