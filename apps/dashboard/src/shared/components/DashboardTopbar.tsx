"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Settings, Command, Cpu, ShieldCheck } from 'lucide-react';
import { useUser } from '@/shared/context/UserContext';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardTopbar: React.FC = () => {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [heartbeat, setHeartbeat] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(() => setHeartbeat(prev => (prev + 1) % 100), 1500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const getRoleBranding = (role?: string) => {
    switch (role) {
      case 'admin': return { label: 'ROOT_ACCESS', color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
      case 'event_company': return { label: 'OP_COORD', color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' };
      case 'provider': return { label: 'PWR_SUPPLY', color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' };
      default: return { label: 'GUEST_PROTO', color: 'text-slate-400', bg: 'bg-slate-400/5', border: 'border-white/10', glow: 'shadow-none' };
    }
  };

  const branding = getRoleBranding(user?.role);

  return (
    <header className={cn(
      "fixed top-0 right-0 left-80 h-24 px-12 flex items-center justify-between z-40 transition-all duration-700",
      scrolled ? "bg-slate-950/90 backdrop-blur-3xl border-b border-white/5 shadow-2xl h-20" : "bg-transparent"
    )}>
      {/* Scanline Overlay */}
      <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
      
      {/* Left: Global Command Search */}
      <div className="flex items-center gap-12 flex-1 max-w-3xl relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="relative">
              <Cpu size={14} className="text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full animate-ping" />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic">
              NEURAL_NODE_X01
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    height: [8, 14, 8],
                    opacity: [0.3, 1, 0.3],
                    backgroundColor: i < 3 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.1)'
                  }}
                  transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                  className="w-[2px] rounded-full"
                />
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-primary/5 border border-primary/20">
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <Typography className="text-[9px] font-black text-primary tracking-[0.2em] italic">
                STABLE_SYNK_4.0
              </Typography>
            </div>
          </div>
        </div>

        <div className="relative w-full group max-w-xl">
          <div className={cn(
            "absolute inset-0 bg-primary/10 blur-[40px] transition-opacity duration-1000 rounded-full",
            isSearchFocused ? "opacity-100" : "opacity-0"
          )} />
          
          <Search className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 z-10",
            isSearchFocused ? "text-primary scale-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "text-slate-500"
          )} size={18} strokeWidth={3} />
          
          <input 
            type="text" 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="INTERROGATE_DATABASE_PROTOCOLS..." 
            className={cn(
              "w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4.5 pl-16 pr-24 text-xs font-black tracking-[0.15em] outline-none transition-all duration-500 placeholder:text-slate-700 uppercase italic",
              isSearchFocused ? "bg-slate-950/80 border-primary/40 shadow-[0_0_80px_rgba(16,185,129,0.1)] ring-8 ring-primary/5" : "hover:bg-slate-900/60 hover:border-white/10"
            )}
          />
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-slate-950/90 text-[9px] text-slate-500 font-black tracking-widest shadow-2xl backdrop-blur-xl group-hover:border-primary/20 transition-colors">
            <Command size={10} className="group-hover:text-primary transition-colors" />
            <span className="group-hover:text-white transition-colors">K</span>
          </div>
        </div>
      </div>

      {/* Right: Operational Controls */}
      <div className="flex items-center gap-10 relative z-10">
        <div className="flex flex-col items-end gap-1.5 border-r border-white/5 pr-10">
          <Typography className="text-[8px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
            SECURE_ID_VALIDATED
          </Typography>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex items-center gap-3 px-6 py-2.5 rounded-xl border text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-1000 italic",
              branding.color, branding.bg, branding.border, branding.glow,
              scrolled ? "scale-90" : "scale-100"
            )}
          >
            <ShieldCheck size={12} className="animate-pulse" />
            <span>{branding.label}</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-5">
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-white rounded-2xl transition-all relative group border border-white/10 bg-slate-950 shadow-2xl"
          >
            <Bell size={20} className="group-hover:rotate-12 transition-transform duration-500" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-[3px] border-slate-950 shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-white rounded-2xl transition-all group border border-white/10 bg-slate-950 shadow-2xl"
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
          </motion.button>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-16 px-12 rounded-2xl bg-primary hover:bg-primary-light text-slate-950 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] flex items-center gap-4 group overflow-hidden border border-primary/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Plus size={20} strokeWidth={4} className="group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-[12px] font-black uppercase tracking-[0.3em] italic">EXE_DEPLOY</span>
          
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10 overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-1/2 h-full bg-white/40"
            />
          </div>
        </motion.button>
      </div>
    </header>
  );
};

