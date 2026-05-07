"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Zap, 
  Activity, 
  Settings, 
  Database,
  ArrowRightLeft,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'DASHBOARD_X1', path: '/dashboard', color: 'text-emerald-500' },
  { icon: FileText, label: 'CONTRACT_FLOW', path: '/dashboard/contratos', color: 'text-blue-400' },
  { icon: ArrowRightLeft, label: 'LEDGER_TX', path: '/dashboard/transacoes', color: 'text-purple-400' },
  { icon: BarChart3, label: 'ANALYTICS_CORE', path: '/dashboard/analytics', color: 'text-amber-400' },
  { icon: Users, label: 'NODE_AUTH', path: '/dashboard/usuarios', color: 'text-rose-400' },
  { icon: Database, label: 'ASSET_MAP', path: '/dashboard/inventario', color: 'text-cyan-400' },
];

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-80 bg-slate-950/80 backdrop-blur-4xl border-r border-white/5 z-50 flex flex-col p-10 group overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
      
      {/* Brand Header */}
      <div className="relative mb-20">
        <div className="flex items-center gap-4 mb-10 group/logo cursor-pointer">
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-500 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] group-hover/logo:scale-110 group-hover/logo:rotate-12 transition-all duration-700">
              <Zap className="text-slate-950 fill-current" size={28} strokeWidth={3} />
            </div>
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse group-hover/logo:scale-150 transition-all duration-1000" />
          </div>
          <div>
            <Typography className="text-2xl font-black tracking-tighter text-white italic leading-none uppercase">
              ECO<span className="text-emerald-500">VOLT</span>
            </Typography>
            <Typography className="text-[9px] font-black tracking-[0.5em] text-slate-600 uppercase mt-2 italic leading-none">OS_EXECUTIVE_4.0</Typography>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-3xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
          <Typography className="text-[10px] font-black tracking-widest text-emerald-500/80 uppercase italic">GRID_STABLE</Typography>
          <div className="flex-1" />
          <Typography className="text-[9px] font-bold text-slate-700 uppercase italic">v4.2.1</Typography>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        <Typography className="text-[10px] font-black text-slate-700 tracking-[0.6em] uppercase mb-10 ml-5 italic">NAV_PROTOCOLS</Typography>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <motion.div 
                whileHover={{ x: 12 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-6 px-6 py-5 rounded-2xl transition-all duration-500 group/nav overflow-hidden",
                  isActive 
                    ? "bg-emerald-500/10 border border-emerald-500/20 shadow-2xl" 
                    : "hover:bg-white/3 border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1.5 h-1/2 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)]"
                  />
                )}
                
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "transition-all duration-500",
                    isActive ? item.color : "text-slate-600 group-hover/nav:text-white"
                  )}
                />
                
                <Typography className={cn(
                  "text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 italic",
                  isActive ? "text-white" : "text-slate-500 group-hover/nav:text-white"
                )}>
                  {item.label}
                </Typography>

                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto space-y-10 pt-10 border-t border-white/5">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4 group/util cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 group-hover/util:text-emerald-500 group-hover/util:border-emerald-500/40 transition-all duration-700">
              <Cpu size={20} strokeWidth={1.5} />
            </div>
            <div>
              <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover/util:text-white transition-colors">CORE_ENGINE</Typography>
              <Typography className="text-[10px] font-bold text-slate-700 uppercase tracking-widest italic leading-none group-hover/util:text-emerald-500/60 transition-colors">OS_VER: 88.0.2</Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-4 group/util cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 group-hover/util:text-blue-400 group-hover/util:border-blue-400/40 transition-all duration-700">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <div>
              <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover/util:text-white transition-colors">SECURITY_LAYER</Typography>
              <Typography className="text-[10px] font-bold text-slate-700 uppercase tracking-widest italic leading-none group-hover/util:text-blue-400/60 transition-colors">E2E_ENCRYPTED</Typography>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 relative overflow-hidden group/upgrade cursor-pointer">
          <div className="absolute top-0 right-0 p-4">
            <Activity size={16} className="text-emerald-500 animate-pulse" />
          </div>
          <Typography className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-3 italic">UPGRADE_NODE</Typography>
          <Typography className="text-[10px] font-bold text-slate-400 leading-relaxed italic group-hover:text-white transition-colors">
            Aumente sua capacidade de monitoramento com o Plano Enterprise.
          </Typography>
        </div>
      </div>
    </aside>
  );
};
