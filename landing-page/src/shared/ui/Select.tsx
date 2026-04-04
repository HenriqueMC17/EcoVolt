"use client";

import React, { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 text-left group">
        {label && (
          <label 
            htmlFor={id} 
            className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1 pointer-events-none select-none transition-colors group-focus-within:text-emerald-500/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            className={cn(
              "flex h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-6 py-4 text-base font-medium appearance-none ring-offset-slate-950 focus-visible:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              error && "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:rotate-180 duration-300">
            <ChevronDown size={18} className="text-slate-500" />
          </div>
          {error && (
            <p className="mt-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider px-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
