"use client";

import React from "react";
import Link from "next/link";
import { Paragraph } from "@/shared/ui/Typography";
import { Logo } from "@/shared/ui/Logo";
import { FOOTER_LINKS } from "@/shared/lib/constants";
import { Globe, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 pt-24 pb-12 px-6 border-t border-white/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-4 space-y-8 text-left">
            <Logo />
            <Paragraph className="max-w-xs text-base font-medium text-slate-500 dark:text-slate-400">
              A espinha dorsal energética para a próxima geração de eventos globais e sustentáveis.
            </Paragraph>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-slate-800 transition-all cursor-pointer">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            {FOOTER_LINKS.map((column, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-0.5 group">
                        {link.label}
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 EcoVolt Technologies Inc.</p>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global Network Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
             <div className="flex items-center gap-1.5"><Globe size={12} /> Brazil (PT-BR)</div>
             <div className="w-px h-3 bg-slate-800" />
             <div className="hover:text-white cursor-pointer transition-colors">System Status</div>
          </div>
        </div>
      </div>
      
      {/* Subtle branding accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10 translate-x-1/2 translate-y-1/2" aria-hidden="true" />
    </footer>
  );
};
