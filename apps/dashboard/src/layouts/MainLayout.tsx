import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart2, 
  ShieldCheck, 
  LogOut,
  Zap,
  Menu,
  Bell,
  Calendar,
  Calculator,
  FileText,
  FileCheck,
  Activity,
  DollarSign,
  Folder,
  PieChart,
  Search,
  Plus,
  ChevronDown,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

import { useAuth, UserRole } from '../app/context/AuthContext';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, setRole } = useAuth();

  const navGroups = [
    {
      title: 'Estratégico',
      items: [
        { icon: <LayoutDashboard />, label: 'Visão Geral', path: '/', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
        { icon: <Calendar />, label: 'Hub de Eventos', path: '/events', roles: ['ADMIN', 'EVENT_COMPANY'] },
      ]
    },
    {
      title: 'Operacional',
      items: [
        { icon: <Activity />, label: 'Monitoramento', path: '/consumption', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
        { icon: <FileCheck />, label: 'Jurídico', path: '/contracts', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
        { icon: <DollarSign />, label: 'Financeiro', path: '/financial', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
      ]
    },
    {
      title: 'Ecossistema',
      items: [
        { icon: <Zap />, label: 'Provedores', path: '/providers', roles: ['ADMIN', 'EVENT_COMPANY'] },
        { icon: <FileText />, label: 'Oportunidades', path: '/proposals', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER'] },
      ]
    },
    {
      title: 'Apoio',
      items: [
        { icon: <Folder />, label: 'Documentos', path: '/documents', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
        { icon: <PieChart />, label: 'Relatórios', path: '/reports', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
        { icon: <Settings />, label: 'Configurações', path: '/settings', roles: ['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-bg-main font-sans text-text-main overflow-hidden">
      {/* Sidebar Premium */}
      <aside className="w-72 border-r border-white/5 glass-thick flex flex-col fixed h-full z-50">
        <header className="flex items-center gap-3 p-8 pb-12 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-primary glow-primary flex items-center justify-center rotate-3">
            <Zap className="text-black w-6 h-6 fill-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">
              EcoVolt
            </h1>
            <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Energy Nexus</span>
          </div>
        </header>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-8 mt-4">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(item => item.roles.includes(role as any));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                <div className="mb-2 px-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{group.title}</span>
                </div>
                {visibleItems.map((item) => (
                  <SidebarLink 
                    key={item.label}
                    icon={item.icon} 
                    label={item.label} 
                    active={location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/')}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </div>
            );
          })}
        </nav>

        <footer className="p-6 border-t border-white/5 bg-black/20">
          <button className="nav-link-premium w-full text-text-muted hover:text-white hover:bg-white/5 transition-all duration-300">
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sair da Conta</span>
          </button>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 min-h-screen flex flex-col relative">
        {/* Topbar Glass */}
        <header className="h-20 glass flex items-center justify-between px-10 sticky top-0 z-40 border-b border-white/5">
          {/* Left: Search & Status */}
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar eventos, contratos ou documentos..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-xs text-white placeholder:text-text-muted/50 focus:outline-none focus:border-primary/30 transition-all focus:bg-white/10"
              />
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary glow-primary animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  Rede Ativa
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-full glow-primary hover:scale-105 active:scale-95 transition-all duration-300 group">
              <Plus className="w-4 h-4 text-black" />
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Novo Evento</span>
            </button>

            <div className="h-8 w-px bg-white/10 mx-2" />

            {/* Role Switcher (Mock for testing) */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-tighter">Papel:</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{role.replace('_', ' ')}</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 glass-thick rounded-xl border border-white/10 p-2 hidden group-hover:block z-50 shadow-2xl shadow-black/50">
                {(['ADMIN', 'EVENT_COMPANY', 'ENERGY_PROVIDER', 'FINANCIAL'] as UserRole[]).map(r => (
                  <button 
                    key={r}
                    onClick={() => setRole(r)}
                    className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 hover:text-primary transition-colors text-text-muted flex items-center justify-between"
                  >
                    {r.replace('_', ' ')}
                    {role === r && <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_#fff]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Bell className="text-text-muted w-5 h-5 group-hover:text-white transition-colors" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-bg-main" />
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Henrique Cardoso</span>
                <span className="text-[8px] font-bold text-primary/70 uppercase tracking-widest">Master Cloud</span>
              </div>
              <div className="w-10 h-10 rounded-xl glass-border bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/10 group cursor-pointer hover:border-primary/50 transition-colors">
                <User className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-10 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto w-full relative z-10">
            {children}
          </div>
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </section>

        {/* Scanline & Grain Effects */}
        <div className="scanline pointer-events-none" />
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] grain" />
      </main>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "nav-link-premium w-full group relative py-3.5",
      active ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.05)]" : "text-text-muted hover:text-white hover:bg-white/5"
    )}
  >
    <span className={cn(
      "w-5 h-5 transition-all duration-500 flex items-center justify-center",
      active ? "text-primary scale-110" : "text-text-muted group-hover:text-white group-hover:scale-110"
    )}>
      {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: active ? 2.5 : 2 })}
    </span>
    <span className={cn(
      "text-[10px] font-black uppercase tracking-[0.2em] transition-all",
      active ? "translate-x-1" : "group-hover:translate-x-1"
    )}>
      {label}
    </span>
    
    {active && (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-l-full glow-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
    )}

    {/* Hover highlight line */}
    {!active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-primary/40 group-hover:h-4 transition-all duration-300 rounded-r-full" />
    )}
  </button>
);


