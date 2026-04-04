"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { TrendingUp, Globe2, ShieldCheck, Milestone } from "lucide-react";

export const Credibility = () => {
  return (
    <Section id="futuro" className="bg-slate-950 py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ecovolt-blue-600/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="space-y-8">
           <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
             O futuro do setor de eventos é <span className="text-ecovolt-green-400 opacity-90">digital</span> e <span className="text-ecovolt-blue-400 opacity-90">sustentável.</span>
           </h2>
           <p className="text-lg text-slate-400 leading-relaxed">
             Estamos construindo uma infraestrutura que permite ao mercado escalar sem comprometer o planeta, 
             unindo a robustez da engenharia energética com a agilidade do software B2B.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-inner border border-white/10 flex items-center justify-center text-ecovolt-green-500">
                    <TrendingUp size={20} />
                 </div>
                 <h4 className="font-bold text-white tracking-tight">Crescimento Acelerado</h4>
                 <p className="text-sm text-slate-400">Demanda por eventos corporativos cresce 15% ao ano.</p>
              </div>
              <div className="space-y-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-inner border border-white/10 flex items-center justify-center text-ecovolt-blue-500">
                    <Globe2 size={20} />
                 </div>
                 <h4 className="font-bold text-white tracking-tight">Filtro ESG</h4>
                 <p className="text-sm text-slate-400">90% dos investidores priorizam empresas sustentáveis.</p>
              </div>
           </div>
        </div>

        <div className="bg-slate-900/60 p-10 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 space-y-12 backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[3.5rem] pointer-events-none" />
            
            <div className="relative z-10">
               <p className="text-6xl font-display font-bold text-ecovolt-green-500 mb-2 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">90%</p>
               <p className="font-bold text-white uppercase tracking-widest text-xs mb-4">Transformação Digital</p>
               <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                 Nossa meta é digitalizar 90% das transações energéticas do mercado de eventos brasileiro até 2030.
               </p>
            </div>
            
            <hr className="border-white/10 relative z-10" />

            <div className="flex flex-col sm:flex-row gap-8 relative z-10">
               <div className="flex-1 space-y-3">
                  <ShieldCheck size={28} className="text-ecovolt-blue-400 mb-2" />
                  <h5 className="font-bold text-white tracking-tight">Confiabilidade</h5>
                  <p className="text-[13px] text-slate-400">Protocolos de gestão de risco em cada contrato assinado.</p>
               </div>
               <div className="flex-1 space-y-3">
                  <Milestone size={28} className="text-ecovolt-green-400 mb-2" />
                  <h5 className="font-bold text-white tracking-tight">Escalabilidade</h5>
                  <p className="text-[13px] text-slate-400">Desenvolvido para suportar desde reuniões a festivais.</p>
               </div>
            </div>
        </div>
      </div>
    </Section>
  );
};
