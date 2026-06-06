"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Zap, 
  DollarSign, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bot,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, label: 'Overview' },
  { href: '/projetos', icon: FolderKanban, label: 'Projetos' },
  { href: '/eventos', icon: Activity, label: 'Eventos' },
  { href: '/buscar', icon: Search, label: 'Buscar Energia' },
  { href: '/contratos', icon: FileText, label: 'Contratos' },
  { href: '/consumo', icon: Zap, label: 'Consumo' },
  { href: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { href: '/documentos', icon: FileText, label: 'Documentos' },
  { href: '/ai-center', icon: Bot, label: 'AI Center' },
  { href: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen sticky top-0 left-0 z-50 flex flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-3xl"
    >
      <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="text-black h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">EcoVolt</span>
          </motion.div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden group
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10"
                  transition={{ duration: 0.3 }}
                />
              )}
              <Icon size={20} className={isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
              
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
          <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 border-2 border-white/10 shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@ecovolt.com</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
