"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { TrendingUp, Globe2, ShieldCheck, Milestone } from "lucide-react";

export const Credibility = () => {
  return (
    <Section className="bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
           <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
             O futuro do setor de eventos é digital e sustentável.
           </h2>
           <p className="text-lg text-slate-600 leading-relaxed">
             Estamos construindo uma infraestrutura que permite ao mercado escalar sem comprometer o planeta, 
             unindo a robustez da engenharia energética com a agilidade do software B2B.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-ecovolt-green-600">
                    <TrendingUp size={20} />
                 </div>
                 <h4 className="font-bold text-slate-800">Crescimento Acelerado</h4>
                 <p className="text-sm text-slate-500">Demanda por eventos corporativos cresce 15% ao ano.</p>
              </div>
              <div className="space-y-3">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-ecovolt-green-600">
                    <Globe2 size={20} />
                 </div>
                 <h4 className="font-bold text-slate-800">Filtro ESG</h4>
                 <p className="text-sm text-slate-500">90% dos investidores priorizam empresas sustentáveis.</p>
              </div>
           </div>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-12">
            <div>
               <p className="text-5xl font-display font-bold text-ecovolt-green-600 mb-2">90%</p>
               <p className="font-bold text-slate-800 uppercase tracking-widest text-xs">Transformação Digital</p>
               <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                 Nossa meta é digitalizar 90% das transações energéticas do mercado de eventos brasileiro até 2030.
               </p>
            </div>
            
            <hr className="border-slate-100" />

            <div className="flex flex-col sm:flex-row gap-8">
               <div className="flex-1 space-y-3">
                  <ShieldCheck size={24} className="text-ecovolt-blue-500" />
                  <h5 className="font-bold text-slate-800">Confiabilidade</h5>
                  <p className="text-[13px] text-slate-500">Protocólos de gestão de risco em cada contrato.</p>
               </div>
               <div className="flex-1 space-y-3">
                  <Milestone size={24} className="text-ecovolt-green-600" />
                  <h5 className="font-bold text-slate-800">Escalabilidade</h5>
                  <p className="text-[13px] text-slate-500">Desenvolvedo para suportar desde reuniões até festivais.</p>
               </div>
            </div>
        </div>
      </div>
    </Section>
  );
};
