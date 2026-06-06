"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Activity, Folder, Settings, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Typography } from '@/shared/ui/Typography';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands = [
    {
      group: 'Páginas',
      items: [
        { icon: Activity, title: 'Dashboard', href: '/' },
        { icon: Folder, title: 'Projetos', href: '/projetos' },
        { icon: Zap, title: 'Consumo & Telemetria', href: '/consumo' },
        { icon: Settings, title: 'Financeiro', href: '/financeiro' },
      ]
    },
    {
      group: 'Ações Rápidas',
      items: [
        { icon: Search, title: 'Simular Cenário de Geração', action: () => console.log('Simulate') },
        { icon: Search, title: 'Gerar Relatório Mensal', action: () => console.log('Report') },
      ]
    }
  ];

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
  })).filter(group => group.items.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl z-50 overflow-hidden"
          >
            <div className="glass-card bg-black/60 border border-white/10 rounded-2xl shadow-2xl flex flex-col">
              <div className="flex items-center px-4 border-b border-white/5">
                <Search className="w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="O que você está procurando? (Páginas, Projetos, Ações...)"
                  className="flex-1 bg-transparent border-none outline-none text-white p-4 placeholder-text-muted text-lg font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-white/5 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-text-muted">
                    <Typography>Nenhum resultado encontrado para &quot;{query}&quot;.</Typography>
                  </div>
                ) : (
                  filteredCommands.map((group, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {group.group}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item, itemIdx) => {
                          const itemTyped = item as Record<string, unknown> & { icon: React.ComponentType<{ className?: string }>; title: string; href?: string; action?: () => void };
                          const Icon = itemTyped.icon;
                          return (
                            <button
                              key={itemIdx}
                              onClick={() => {
                                if (itemTyped.href) router.push(itemTyped.href);
                                if (itemTyped.action) itemTyped.action();
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 group transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 text-text-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors border border-white/5 group-hover:border-primary/20">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-text-main group-hover:text-white transition-colors">{item.title}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="bg-black/40 border-t border-white/5 p-3 flex items-center justify-between text-xs text-text-muted font-medium">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-sans">↑↓</kbd> Navegar</span>
                  <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-sans">↵</kbd> Selecionar</span>
                </div>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-sans">ESC</kbd> Fechar</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
