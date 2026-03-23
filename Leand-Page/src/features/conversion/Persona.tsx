"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Quote, Sparkles } from "lucide-react";

export const PersonaSection = () => {
  return (
    <Section className="bg-white py-32 md:py-48">
      <div className="max-w-6xl mx-auto">
        <div className="relative p-10 md:p-24 rounded-[4rem] bg-slate-950 text-white overflow-hidden shadow-2xl">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent_50%)]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
               <div className="shrink-0 relative group">
                  <div className="w-56 h-56 md:w-80 md:h-80 rounded-[3.5rem] overflow-hidden border-8 border-white/5 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                     <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-white/10 uppercase italic">Social Proof</span>
                     </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-ecovolt-green-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-ecovolt-green-500/20">
                     <Quote size={36} />
                  </div>
               </div>

               <div className="space-y-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-ecovolt-green-400 text-[10px] font-bold uppercase tracking-widest">
                     <Sparkles size={12} /> Case de Sucesso
                  </div>
                  
                  <div className="space-y-6">
                     <h3 className="text-3xl md:text-5xl font-display font-medium text-white leading-[1.1] tracking-tight text-balance italic">
                       &quot;Toda a minha produção mudou de nível quando a energia deixou de ser um risco e passou a ser uma vantagem competitiva de sustentabilidade.&quot;
                     </h3>
                     <div className="h-px w-16 bg-ecovolt-green-500" />
                  </div>
                  
                  <div className="space-y-6">
                     <p className="text-slate-400 text-lg md:text-xl leading-relaxed tracking-tight max-w-xl font-medium">
                        Mariana Sousa é produtora de eventos culturais que buscava uma narrativa de sustentabilidade real para atrair grandes patrocínios em festivais de música.
                     </p>
                     <div>
                        <p className="text-xl font-bold text-white">Mariana Souza</p>
                        <p className="text-sm text-ecovolt-green-500 font-bold uppercase tracking-[0.2em] mt-1">Head de Produção • GreenFest</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </Section>
  );
};
