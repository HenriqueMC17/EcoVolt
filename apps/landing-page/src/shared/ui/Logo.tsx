import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center group cursor-pointer relative gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
          <path d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10Z" stroke="#10B981" strokeWidth="0.5" strokeDasharray="2 2" className="animate-[spin_20s_linear_infinite]" />
          <path d="M26 12L16 26H24L22 36L32 22H24L26 12Z" fill="url(#bolt-gradient)" />
          <defs>
            <linearGradient id="bolt-gradient" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-2xl md:text-3xl font-display font-black tracking-tighter uppercase leading-none">
          <span className="text-white">ECO</span>
          <span className="text-emerald-500">VOLT</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-[1px] w-4 bg-gradient-to-r from-emerald-500/80 to-transparent" />
          <span className="text-[0.65rem] md:text-[0.75rem] font-bold tracking-[0.4em] text-slate-400 uppercase leading-none">
            Enterprise
          </span>
        </div>
      </div>
    </div>
  );
};
