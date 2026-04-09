"use client";

import React from "react";
import Link from "next/link";
import { Paragraph } from "@/shared/ui/Typography";
import { Globe, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Produto",
    links: [
      { label: "Como Funciona", href: "/product/how-it-works" },
      { label: "Plataforma", href: "/product/platform" },
      { label: "Segurança", href: "/product/security" },
      { label: "Preços", href: "/product/pricing" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nós", href: "/company/about" },
      { label: "Carreiras", href: "/company/careers" },
      { label: "Blog", href: "/company/blog" },
      { label: "Sustentabilidade", href: "/company/sustainability" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentação", href: "/resources/docs" },
      { label: "API Reference", href: "/resources/api-reference" },
      { label: "Status", href: "/resources/status" },
      { label: "Suporte", href: "/resources/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "/legal/privacy" },
      { label: "Termos de Uso", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Compliance", href: "/legal/compliance" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-950 pt-24 pb-12 px-6 border-t border-white/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-4 space-y-8 text-left">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-emerald-500/5">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 12L16 26H24L22 36L32 22H24L26 12Z" fill="#10B981" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-display font-black tracking-tighter text-white uppercase transition-transform group-hover:opacity-90">
                  ECOVOLT
                </span>
                <span className="text-[0.65rem] font-bold tracking-[0.4em] text-emerald-500 uppercase -mt-1 ml-0.5">Enterprise</span>
              </div>
            </div>
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
            {footerLinks.map((column, i) => (
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
