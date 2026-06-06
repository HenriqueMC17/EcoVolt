"use client";

import React, { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
          <textarea
            id={id}
            className={cn(
              "flex min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-medium resize-none ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              error && "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60",
              className
            )}
            ref={ref}
            {...props}
          />
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

Textarea.displayName = "Textarea";

export { Textarea };
