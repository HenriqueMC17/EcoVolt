"use client";

import * as React from "react";
import { m as motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: `
        bg-ecovolt-green-600 text-white 
        hover:bg-ecovolt-green-500 
        shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(16,185,129,0.25)]
        before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-100
        hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-4px_rgba(16,185,129,0.35)]
      `,
      secondary: `
        bg-ecovolt-blue-600 text-white 
        hover:bg-ecovolt-blue-500 
        shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(59,130,246,0.25)]
        before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent
      `,
      outline: "border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:border-ecovolt-green-500/50 hover:bg-white hover:text-ecovolt-green-600",
      ghost: "bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-xs font-semibold",
      md: "px-6 py-2.5 text-sm font-bold",
      lg: "px-10 py-4 text-base font-bold tracking-tight",
    };

    return (
      <motion.button
        ref={ref}
        aria-disabled={props.disabled}
        whileHover={!props.disabled ? { scale: 1.02 } : {}}
        whileTap={!props.disabled ? { scale: 0.98 } : {}}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ecovolt-green-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
