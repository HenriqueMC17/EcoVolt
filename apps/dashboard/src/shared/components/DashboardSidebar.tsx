import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Zap, 
  Users, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  DollarSign, 
  ShieldCheck, 
  PieChart, 
  Settings,
  ChevronDown,
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { useUser } from '@/context/UserContext'; 

const menuItems = [
  { icon: LayoutDashboard, label: 'Control Room', path: '/dashboard', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: Calendar, label: 'Live Events', path: '/dashboard/eventos', roles: ['admin', 'event_company', 'provider'] },
  { icon: Zap, label: 'Grid Estimates', path: '/dashboard/estimativas', roles: ['admin', 'event_company'] },
  { icon: Users, label: 'Supply Chain', path: '/dashboard/provedores', roles: ['admin', 'event_company'] },
  { icon: FileText, label: 'Proposals', path: '/dashboard/propostas', roles: ['admin', 'event_company', 'provider'] },
  { icon: ClipboardCheck, label: 'Registry', path: '/dashboard/contratos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: BarChart3, label: 'Telemetria', path: '/dashboard/consumo', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: DollarSign, label: 'Settlement', path: '/dashboard/financeiro', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: ShieldCheck, label: 'Audit Logs', path: '/dashboard/documentos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: Settings, label: 'Protocol Settings', path: '/dashboard/configuracoes', roles: ['admin'] },
];

export const DashboardSidebar: React.FC = () => {
  const { user, logout } = useUser();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = menuItems.filter(item => 
    user?.role === 'admin' || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 glass-thick border-r border-white/5 flex flex-col z-50 shadow-[20px_0_100px_rgba(0,0,0,0.4)]">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
      
      {/* High-Tech Branding */}
      <div className="p-12 relative overflow-hidden group border-b border-white/[0.03]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 opacity-30" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />
        
        <div 
          className="flex items-center gap-6 cursor-pointer relative z-10" 
          onClick={() => navigate('/')}
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-none bg-slate-950 flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative group-hover:border-primary/40 transition-all duration-700"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/40" />
            <Zap className="text-primary relative z-10 animate-pulse" size={32} strokeWidth={2.5} />
          </motion.div>
          
          <div className="space-y-1">
            <Typography variant="h4" className="text-3xl font-black tracking-[-0.08em] leading-none text-white uppercase italic">
              ECO<span className="text-primary glow-text drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">VOLT</span>
            </Typography>
            <div className="flex items-center gap-2">
              <div className="w-2 h-[2px] bg-primary animate-pulse" />
              <Typography className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase leading-none italic">
                CORE_SYSTEM <span className="text-primary/50">v4.1</span>
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Ledger */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-8">
        <div className="mb-6 px-4 flex items-center justify-between opacity-50">
          <Typography className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-black italic">
            OPERATIONAL_PROTOCOLS
          </Typography>
          <div className="w-1 h-1 rounded-full bg-primary/50 animate-ping" />
        </div>
        
        {filteredItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative group block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative min-h-[64px] px-6 flex items-center gap-5 transition-all duration-500 rounded-2xl overflow-hidden",
                  isActive ? "text-white bg-white/5 border border-white/5 shadow-2xl" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent -z-10"
                  />
                )}
                
                <div className="relative shrink-0">
                  <item.icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "text-primary drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "group-hover:text-primary group-hover:scale-110"
                    )} 
                  />
                  {isActive && (
                    <motion.div 
                      layoutId="icon-bloom"
                      className="absolute inset-0 bg-primary/30 blur-xl rounded-full -z-10"
                    />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 leading-none italic",
                    isActive ? "text-white translate-x-1" : "group-hover:translate-x-1"
                  )}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                    <span className="text-[7px] text-slate-700 font-black tracking-widest uppercase">
                      SEC_ID: {index.toString().padStart(2, '0')}
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[7px] text-primary/40 font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      EXE_AUTH
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div className="ml-auto">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-primary/80" />
                      <div className="w-1 h-3 bg-primary/40" />
                      <div className="w-1 h-3 bg-primary/20" />
                    </div>
                  </div>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Security Vault */}
      <div className="p-8 border-t border-white/[0.03] relative overflow-hidden bg-slate-950/40">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none opacity-50" />
        
        <div className="relative">
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center gap-5 p-5 rounded-[2rem] bg-slate-900/60 border border-white/10 hover:border-primary/30 transition-all text-left shadow-2xl backdrop-blur-3xl group"
          >
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center font-black text-primary shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden text-lg italic">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {user?.name.substring(0, 2).toUpperCase() || '??'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <Typography className="text-sm font-black truncate text-white tracking-tight uppercase italic leading-none mb-1.5">
                {user?.name || 'Operator_Root'}
              </Typography>
              <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-primary/70" />
                <Typography className="text-[9px] font-black tracking-[0.25em] text-primary uppercase leading-none italic opacity-80">
                  {user?.role?.replace('_', ' ') || 'SYSTEM_ADMIN'}
                </Typography>
              </div>
            </div>
            
            <ChevronDown size={14} className={cn("text-slate-500 transition-transform duration-700", isSwitcherOpen && "rotate-180")} />
          </motion.button>

          <AnimatePresence>
            {isSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-full left-0 right-0 mb-6 glass-thick rounded-[2.5rem] p-4 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-[60] overflow-hidden"
              >
                <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                <div className="px-5 py-4 mb-2 border-b border-white/5">
                  <Typography className="text-[9px] uppercase tracking-[0.5em] text-slate-500 font-black italic">
                    SESSION_TERMINAL
                  </Typography>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => { logout(); setIsSwitcherOpen(false); }}
                    className="w-full flex items-center justify-between px-6 py-5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em] group italic"
                  >
                    <span>PURGE_SESSION</span>
                    <LogOut size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
