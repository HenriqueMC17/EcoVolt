import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Settings, Command, Cpu, ShieldCheck } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardTopbar: React.FC = () => {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleBranding = (role?: string) => {
    switch (role) {
      case 'admin': return { label: 'ROOT_ACCESS', color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20', shadow: 'shadow-primary/20' };
      case 'event_company': return { label: 'OP_COORD', color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20', shadow: 'shadow-blue-400/20' };
      case 'provider': return { label: 'PWR_SUPPLY', color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20', shadow: 'shadow-amber-400/20' };
      default: return { label: 'GUEST_PROTO', color: 'text-slate-400', bg: 'bg-slate-400/5', border: 'border-white/10', shadow: 'shadow-transparent' };
    }
  };

  const branding = getRoleBranding(user?.role);

  return (
    <header className={cn(
      "fixed top-0 right-0 left-80 h-24 px-12 flex items-center justify-between z-40 transition-all duration-700",
      scrolled ? "bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 shadow-2xl h-20" : "bg-transparent"
    )}>
      {/* Left: Global Command Search */}
      <div className="flex items-center gap-10 flex-1 max-w-2xl">
        <div className="relative w-full group">
          <div className={cn(
            "absolute inset-0 bg-primary/5 blur-2xl transition-opacity duration-700",
            isSearchFocused ? "opacity-100" : "opacity-0"
          )} />
          
          <Search className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500",
            isSearchFocused ? "text-primary scale-110" : "text-slate-500"
          )} size={20} />
          
          <input 
            type="text" 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Interrogar protocolos, ativos ou credenciais..." 
            className={cn(
              "w-full bg-slate-900/40 border border-white/5 rounded-[1.5rem] py-4 pl-16 pr-20 text-sm font-bold tracking-tight outline-none transition-all duration-500 placeholder:text-slate-600",
              isSearchFocused ? "bg-slate-900/80 border-primary/40 shadow-[0_0_50px_rgba(16,185,129,0.1)] ring-4 ring-primary/5" : "hover:bg-slate-900/60 hover:border-white/10"
            )}
          />
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950/50 text-[10px] text-slate-500 font-black tracking-widest shadow-2xl">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Operational Controls */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex items-center gap-3 px-6 py-2.5 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-1000",
              branding.color, branding.bg, branding.border, scrolled ? "scale-90" : "scale-100"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_12px_currentColor] animate-pulse")} />
            <span>{branding.label}</span>
          </motion.div>
        </div>

        <div className="h-8 w-px bg-white/5 mx-2" />

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white rounded-2xl transition-all relative group border border-transparent hover:border-white/5 shadow-2xl"
          >
            <Bell size={22} className="group-hover:rotate-12 transition-transform duration-500" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-4 border-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white rounded-2xl transition-all group border border-transparent hover:border-white/5 shadow-2xl"
          >
            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-700" />
          </motion.button>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="btn-premium-primary h-14 px-10 rounded-[1.5rem] shadow-[0_0_40px_rgba(16,185,129,0.2)] flex items-center gap-4 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Plus size={20} strokeWidth={3} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">New Protocol</span>
        </motion.button>
      </div>
    </header>
  );
};
