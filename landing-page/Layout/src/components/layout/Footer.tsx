import React from "react";
import { Zap, Instagram, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 pt-32 pb-12 px-6 overflow-hidden relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-ecovolt-green-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-ecovolt-green-500/20">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white font-display">
                EcoVolt
              </span>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-snug max-w-xs tracking-tight">
              A infraestrutura digital para o futuro da energia sustentável em eventos.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Groups */}
          {[
            {
              title: "Produto",
              links: ["Visão Geral", "Plataforma", "Segurança", "Preços"]
            },
            {
              title: "Empresa",
              links: ["Sobre Nós", "Carreiras", "Blog", "Contato"]
            },
            {
              title: "Legal",
              links: ["Privacidade", "Termos", "Cookies"]
            }
          ].map((group, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm font-bold hover:text-white transition-colors flex items-center gap-1 group">
                      {link}
                      <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
              <p>© 2026 ECOVOLT TECNOLOGIA S.A.</p>
              <div className="w-1 h-1 bg-slate-800 rounded-full hidden md:block" />
              <p className="text-slate-700">HANDCRAFTED FOR EXCELLENCE</p>
           </div>
           
           <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                 <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Status do Sistema</p>
                 <p className="text-[10px] font-bold text-ecovolt-green-500 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-ecovolt-green-500 animate-pulse" /> Operacional
                 </p>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};
