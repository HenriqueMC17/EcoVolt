'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Zap, Users, FileCheck, BarChart3, 
  DollarSign, ShieldCheck, Settings, Menu, X, Activity, History, TrendingUp, Briefcase, LogOut 
} from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { cn } from '../../shared/lib/utils';

const navigation = [
  {
    group: 'Operação',
    items: [
      { name: 'Visão Geral', icon: LayoutDashboard, path: '/operations/overview' },
      { name: 'Eventos', icon: Calendar, path: '/operations/eventos' },
      { name: 'Estimativas', icon: Zap, path: '/operations/estimativa' },
      { name: 'Consumo', icon: Activity, path: '/operations/consumo' },
      { name: 'Auditoria', icon: History, path: '/operations/auditoria' },
    ]
  },
  {
    group: 'Comercial',
    items: [
      { name: 'Empresas', icon: Briefcase, path: '/commercial/empresas' },
      { name: 'Provedores', icon: Users, path: '/commercial/provedores' },
      { name: 'Propostas', icon: Briefcase, path: '/commercial/propostas' },
      { name: 'Contratos', icon: FileCheck, path: '/commercial/contratos' },
    ]
  },
  {
    group: 'Financeiro',
    items: [
      { name: 'Financeiro', icon: DollarSign, path: '/financial/financeiro' },
      { name: 'Reconciliação', icon: TrendingUp, path: '/financial/reconciliacao' },
    ]
  },
  {
    group: 'Governança',
    items: [
      { name: 'Documentos', icon: ShieldCheck, path: '/governance/compliance' },
      { name: 'Relatórios', icon: BarChart3, path: '/governance/relatorios' },
      { name: 'Usuários', icon: Users, path: '/governance/usuarios' },
    ]
  }
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      className="fixed left-0 top-0 z-40 h-screen glass border-r border-white/10 flex flex-col transition-all duration-300"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <div className={cn("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "hidden")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">
            EV
          </div>
          <span className="font-heading font-bold text-lg text-foreground whitespace-nowrap">
            EcoVolt
          </span>
        </div>
        
        {/* If sidebar is closed, show logo instead of toggle button in the middle */}
        {!isSidebarOpen && (
          <div className="w-10 h-10 mx-auto rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary cursor-pointer" onClick={toggleSidebar}>
            EV
          </div>
        )}

        {isSidebarOpen && (
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-white/10 text-muted transition-colors">
            <Menu size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        {navigation.map((group, idx) => (
          <div key={idx} className="mb-6">
            {isSidebarOpen && (
              <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                {group.group}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted hover:bg-white/5 hover:text-foreground"
                    )}
                    title={!isSidebarOpen ? item.name : undefined}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" 
                      />
                    )}
                    <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary" : "text-muted group-hover:text-foreground")} />
                    {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/governance/configuracoes"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-white/5 hover:text-foreground transition-all"
        >
          <Settings size={20} />
          {isSidebarOpen && <span>Configurações</span>}
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-all">
          <LogOut size={20} />
          {isSidebarOpen && <span>Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
}
