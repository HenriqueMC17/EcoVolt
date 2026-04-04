"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { CheckCircle2, Target } from "lucide-react";

export const ValueProposition = () => {
  return (
    <Section id="visao" className="bg-slate-950 py-32 md:py-48 overflow-hidden relative border-t border-white/5">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-ecovolt-green-500/10 blur-[150px] rounded-full translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ecovolt-green-500/10 text-ecovolt-green-400 text-[10px] font-bold uppercase tracking-widest border border-ecovolt-green-500/20 backdrop-blur-sm">
                A Nossa Visão
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-[0.9] tracking-tighter text-balance">
                Digitalizar o futuro da <span className="text-slate-500">energia para eventos.</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed tracking-tight max-w-xl">
                Não somos apenas um marketplace. Somos a infraestrutura de governança que permite ao mercado escalar com 100% de conformidade ESG.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { title: "Escalabilidade", desc: "Pronto para festivais e conferências globais.", icon: Target },
                { title: "Trustless", desc: "Rastreabilidade completa de cada kW consumido.", icon: CheckCircle2 },
              ].map((v, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 shadow-inner border border-white/10 flex items-center justify-center text-ecovolt-green-500">
                    <v.icon size={22} />
                  </div>
                  <h4 className="font-bold text-white text-lg tracking-tight">{v.title}</h4>
                  <p className="text-sm text-slate-400 font-medium leading-snug">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
             <div className="p-10 md:p-14 bg-slate-900 border border-white/10 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-md">
                <div className="space-y-12">
                   <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter drop-shadow-sm">98</span>
                        <span className="text-4xl font-display font-bold text-ecovolt-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">%</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Acurácia na Reconciliação</p>
                      <p className="text-slate-400 font-medium leading-relaxed">
                        Nossos algoritmos eliminam discrepâncias financeiras entre o provisionado e o consumido, garantindo faturamento justo.
                      </p>
                   </div>
                   
                   <div className="h-px bg-white/10" />

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-3xl font-display font-bold text-white mb-1">2.4k</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Toneladas CO2</p>
                         <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-ecovolt-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                         </div>
                      </div>
                      <div>
                         <p className="text-3xl font-display font-bold text-white mb-1">500+</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Provedores Cert.</p>
                         <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-ecovolt-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
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
