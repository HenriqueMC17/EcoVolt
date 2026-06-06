import React from 'react';
import { Search, Bell, Command } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 w-full flex items-center justify-between px-8 border-b border-white/5 bg-bg-main/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Command Palette Trigger Trigger */}
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors w-64 group">
          <Search size={18} className="group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium">Search or jump to...</span>
          <div className="ml-auto flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-md">
            <Command size={12} />
            <span>K</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-slow"></span>
          All Systems Operational
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary glow-primary"></span>
        </button>
      </div>
    </header>
  );
}
