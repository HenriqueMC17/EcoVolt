"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Target, Layers, Leaf, Rocket } from "lucide-react";

const diffs = [
  {
    title: "Eco-Specialized",
    description: "Foco absoluto no nicho de eventos, resolvendo dores específicas de produtores.",
    icon: Target,
  },
  {
    title: "Stack Integrada",
    description: "Unimos estimativa, contratação e reconciliação em uma única API de confiança.",
    icon: Layers,
  },
  {
    title: "Visão Operacional",
    description: "Diferente de consultorias genéricas, entregamos software que de fato gerencia a energia.",
    icon: Leaf,
  },
  {
    title: "Escalabilidade B2B",
    description: "Arquitetura preparada para suportar a infraestrutura de eventos globais.",
    icon: Rocket,
  },
];

export const Differentials = () => {
  return (
    <Section id="diferenciais" className="bg-slate-950 py-24 md:py-32">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
          Por que a EcoVolt?
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
          Onde a sustentabilidade encontra a precisão técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {diffs.map((diff, i) => (
          <div key={i} className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-white/5 rounded-3xl group hover:border-ecovolt-green-500/50 hover:bg-slate-900/80 transition-all shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-slate-800/80 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-ecovolt-green-500/10 group-hover:text-ecovolt-green-500 transition-colors shadow-inner border border-white/5">
              <diff.icon size={28} />
            </div>
            <h4 className="text-lg font-bold text-white mb-3 tracking-tight">{diff.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{diff.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
