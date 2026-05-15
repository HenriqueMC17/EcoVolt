'use client';

import React from 'react';
import { Search, Bell, User, Command } from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { cn } from '../../shared/lib/utils';
import { Button } from '../../shared/ui/button';

export function Topbar() {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-30 h-16 glass border-b border-white/10 transition-all duration-300 flex items-center justify-between px-6",
        isSidebarOpen ? "left-[260px]" : "left-[80px]"
      )}
    >
      <div className="flex-1 flex items-center max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-foreground placeholder-muted focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary focus:border-primary transition-all sm:text-sm"
            placeholder="Buscar operações, contratos, eventos..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-muted bg-white/10 border border-white/10">
              <Command size={12} /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <Button variant="ghost" size="icon" className="relative text-muted hover:text-foreground rounded-full">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-background"></span>
        </Button>
        
        <div className="h-8 w-px bg-white/10 mx-1"></div>
        
        <button className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg transition-colors text-left">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none mb-1">Carlos Andrade</p>
            <p className="text-xs text-muted leading-none">Administrador</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/50 flex items-center justify-center text-secondary">
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}
