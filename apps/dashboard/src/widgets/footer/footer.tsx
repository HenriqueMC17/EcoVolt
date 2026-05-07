"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';
import { Zap, Github, Twitter, Linkedin, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-32 pb-12 relative overflow-hidden">
      {/* Structural Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <Zap className="text-primary fill-primary relative z-10" size={32} />
              </div>
              <Typography variant="h3" className="text-2xl font-black tracking-[-0.05em] text-white uppercase italic">
                ECO<span className="text-primary">VOLT</span>
              </Typography>
            </div>
            
            <Typography className="text-slate-400 font-medium leading-relaxed mb-10 max-w-sm">
              Orquestrando o futuro da infraestrutura energética global através de inteligência preditiva e governança de rede autônoma.
            </Typography>
            
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Typography className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 italic">Network</Typography>
            <ul className="space-y-4">
              {['Grid Terminal', 'Protocol v2.4', 'Flux Analytics', 'Governance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-black text-slate-500 hover:text-white uppercase tracking-tighter italic transition-colors block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <Typography className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 italic">Foundation</Typography>
            <ul className="space-y-4">
              {['Strategic Bio', 'Research Lab', 'Security Ops', 'Intelligence'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-black text-slate-500 hover:text-white uppercase tracking-tighter italic transition-colors block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="glass-thick p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 mb-6">
                <Shield size={18} className="text-primary" />
                <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Security Command</Typography>
              </div>
              
              <Typography className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
                Inscreva-se para receber relatórios de inteligência sobre o mercado de energia e atualizações de protocolo.
              </Typography>
              
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="COMMAND@ECOVOLT.AI" 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all"
                />
                <button className="btn-premium-primary w-full py-4 rounded-2xl shadow-2xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initialize Sync</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-12">
            <Typography className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              © {currentYear} EcoVolt Strategic Assets. All rights reserved.
            </Typography>
            <div className="flex gap-8">
              {['Security', 'Privacy', 'Compliance'].map((item) => (
                <a key={item} href="#" className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">{item}</a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 px-6 py-3 glass rounded-2xl border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">Primary Grid: Operational</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-slate-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Latency: 14ms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
