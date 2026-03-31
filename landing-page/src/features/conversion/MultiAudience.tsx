"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Button } from "@/shared/ui/Button";
import { Building2, Server, ArrowRight } from "lucide-react";

export const MultiAudience = () => {
  return (
    <Section className="bg-white py-32 md:py-48">
      <div className="text-center mb-24 space-y-6">
         <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 tracking-tighter leading-[0.9]">
            Soluções para <span className="text-slate-400">todo o ecossistema.</span>
         </h2>
         <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium tracking-tight">
            Seja você um organizador buscando eficiência ou um provedor buscando escala.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Organizers */}
        <div className="relative group overflow-hidden bg-slate-50 border border-slate-200 rounded-[3rem] p-12 flex flex-col justify-between items-start min-h-[500px] transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200">
           <div className="absolute top-0 right-0 w-64 h-64 bg-ecovolt-green-100 opacity-20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
           
           <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-ecovolt-green-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-ecovolt-green-500/10 transition-transform group-hover:scale-110">
                 <Building2 size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tighter">Empresas de Eventos</h3>
                <p className="text-slate-500 text-lg md:text-xl font-medium leading-tight max-w-sm tracking-tight text-balance">
                   Contrate energia limpa com previsibilidade de custos e 100% de rastreabilidade para seus projetos.
                </p>
              </div>
           </div>
           
           <Button size="lg" className="mt-12 gap-2 relative z-10 group/btn">
              Acessar Plataforma <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
           </Button>
        </div>

        {/* Providers */}
        <div className="relative group overflow-hidden bg-slate-950 rounded-[3rem] p-12 text-white flex flex-col justify-between items-start min-h-[500px] transition-all hover:shadow-2xl hover:shadow-slate-950/20">
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-ecovolt-blue-600 opacity-10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

           <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center text-ecovolt-blue-400 transition-transform group-hover:scale-110">
                 <Server size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">Provedores de Energia</h3>
                <p className="text-slate-400 text-lg md:text-xl font-medium leading-tight max-w-sm tracking-tight text-balance">
                   Digitalize seu processo comercial e encontre demandas qualificadas através de uma interface global.
                </p>
              </div>
           </div>
           
           <Button variant="secondary" size="lg" className="mt-12 gap-2 relative z-10 bg-white text-slate-900 hover:bg-slate-50">
              Seja um Parceiro <ArrowRight size={20} />
           </Button>
        </div>
      </div>
    </Section>
  );
};
