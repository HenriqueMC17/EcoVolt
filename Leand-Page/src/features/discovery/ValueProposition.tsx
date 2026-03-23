"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { CheckCircle2, Target } from "lucide-react";

export const ValueProposition = () => {
  return (
    <Section id="visao" className="bg-slate-50 py-32 md:py-48 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-ecovolt-green-500/5 blur-[120px] rounded-full translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecovolt-green-100 text-ecovolt-green-600 text-[10px] font-bold uppercase tracking-widest border border-ecovolt-green-200/50">
                A Nossa Visão
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[0.9] tracking-tighter text-balance">
                Digitalizar o futuro da <span className="text-slate-400">energia para eventos.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed tracking-tight max-w-xl">
                Não somos apenas um marketplace. Somos a infraestrutura de governança que permite ao mercado escalar com 100% de conformidade ESG.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { title: "Escalabilidade", desc: "Pronto para festivais e conferências globais.", icon: Target },
                { title: "Trustless", desc: "Rastreabilidade completa de cada kW consumido.", icon: CheckCircle2 },
              ].map((v, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-ecovolt-green-600">
                    <v.icon size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg tracking-tight">{v.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-snug">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
             <div className="p-10 md:p-14 bg-white border border-slate-200 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative z-10">
                <div className="space-y-12">
                   <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl md:text-8xl font-display font-bold text-slate-900 tracking-tighter">98</span>
                        <span className="text-4xl font-display font-bold text-ecovolt-green-500">%</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Acurácia na Reconciliação</p>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        Nossos algoritmos eliminam discrepâncias financeiras entre o provisionado e o consumido, garantindo faturamento justo.
                      </p>
                   </div>
                   
                   <div className="h-px bg-slate-100" />

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-3xl font-display font-bold text-slate-900 mb-1">2.4k</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Toneladas CO2</p>
                         <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-ecovolt-green-500" />
                         </div>
                      </div>
                      <div>
                         <p className="text-3xl font-display font-bold text-slate-900 mb-1">500+</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Provedores Cert.</p>
                         <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-ecovolt-blue-500" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             {/* Decorative Background Glows */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-ecovolt-blue-600/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </Section>
  );
};
