"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  LayoutDashboard, 
  BarChart3, 
  Activity, 
  ShieldAlert, 
  Settings, 
  HelpCircle,
  Cpu,
  Power
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/typography';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '#', active: true },
  { icon: Activity, label: 'Live Metrics', href: '#' },
  { icon: BarChart3, label: 'Nexus Analytics', href: '#' },
  { icon: ShieldAlert, label: 'Security Protocols', href: '#' },
  { icon: Cpu, label: 'Asset Management', href: '#' },
];

const secondaryItems = [
  { icon: Settings, label: 'System Settings', href: '#' },
  { icon: HelpCircle, label: 'Nexus Intel', href: '#' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-black/50 backdrop-blur-3xl border-r border-white/5 flex flex-col z-50">
      {/* Brand Section */}
      <div className="p-10 mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
            <Zap className="text-black fill-black" size={24} />
          </div>
          <div>
            <Typography variant="h4" className="text-2xl leading-none">Eco<span className="text-emerald-500">Volt</span></Typography>
            <Typography variant="small" className="text-[9px] text-slate-600 mt-1">NEXUS_OS v4.2.0</Typography>
          </div>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        <Typography variant="small" className="px-4 mb-6 opacity-50">Main_Sequence</Typography>
        {navItems.map((item, idx) => (
          <motion.a
            key={item.label}
            href={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "nav-link-premium group",
              item.active ? "bg-white/5 border border-white/10" : "hover:bg-white/3 border border-transparent"
            )}
          >
            <item.icon 
              size={20} 
              className={cn(
                "transition-colors duration-500",
                item.active ? "text-emerald-500" : "text-slate-500 group-hover:text-white"
              )} 
            />
            <span className={cn(
              "font-black uppercase tracking-widest text-[11px] italic transition-colors duration-500",
              item.active ? "text-white" : "text-slate-500 group-hover:text-white"
            )}>
              {item.label}
            </span>
            {item.active && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              />
            )}
          </motion.a>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-6 pb-10 space-y-2">
        <Typography variant="small" className="px-4 mb-6 opacity-50">System_Core</Typography>
        {secondaryItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="nav-link-premium group hover:bg-white/3 border border-transparent"
          >
            <item.icon size={20} className="text-slate-500 group-hover:text-white transition-colors" />
            <span className="font-black uppercase tracking-widest text-[11px] italic text-slate-500 group-hover:text-white transition-colors">
              {item.label}
            </span>
          </a>
        ))}

        <div className="mt-10 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 group cursor-pointer hover:bg-emerald-500/10 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
            <Typography variant="small" className="text-emerald-500">GRID_SECURE</Typography>
          </div>
          <Typography className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed italic">
            Connection stable. No anomalies detected in the current nexus cycle.
          </Typography>
        </div>

        <button className="w-full mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 group transition-all duration-500">
          <Power size={18} className="text-slate-500 group-hover:text-red-500 transition-colors" />
          <span className="font-black uppercase tracking-widest text-[10px] italic text-slate-500 group-hover:text-red-500">Terminate_Session</span>
        </button>
      </div>
    </aside>
  );
};
