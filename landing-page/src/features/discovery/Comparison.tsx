"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Check, X, ZapOff, Scale } from "lucide-react";

const comparisonData = [
  {
    feature: "Visibilidade de Consumo",
    traditional: "Pós-evento (Estimativa)",
    ecovolt: "Tempo Real (Live Dash)",
    impact: "Prevenção de sobrecarga",
  },
  {
    feature: "Eficiência Energética",
    traditional: "Baixa (Desperdício de 20%+)",
    ecovolt: "Alta (Otimização via IA)",
    impact: "Redução de custos reais",
  },
  {
    feature: "Conformidade ESG",
    traditional: "Manual / Complexa",
    ecovolt: "Automatizada / Smart Contract",
    impact: "Selo de Sustentabilidade",
  },
  {
    feature: "Riscos Operacionais",
    traditional: "Altos (Falta de Backup Inteligente)",
    ecovolt: "Monitorado (Redundância Digital)",
    impact: "Continuidade do Negócio",
  },
];

export const Comparison = () => {
  return (
    <Section id="comparativo" className="bg-slate-950 py-32 md:py-48 overflow-hidden relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-4">
           <Subheading className="text-ecovolt-green-400">The Benchmark</Subheading>
           <Heading className="max-w-3xl mx-auto text-white">EcoVolt vs <span className="text-slate-500">Métodos Tradicionais.</span></Heading>
           <Text className="text-lg md:text-xl font-medium text-slate-400">
              Pare de gastar com energia que você não consome. Veja por que somos a escolha lógica.
           </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="space-y-8">
              <GlassCard variant="dark" className="p-8 border-red-500/20 bg-red-500/5 shadow-[0_0_30px_-10px_rgba(239,68,68,0.15)]">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                       <ZapOff size={24} />
                    </div>
                    <Heading as="h3" className="text-2xl text-white">Métodos Tradicionais</Heading>
                 </div>
                 <ul className="space-y-4">
                    {["Custos ocultos no faturamento", "Falta de dados para relatórios ESG", "Desperdícios operacionais", "Risco de multas ambientais"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-400 font-medium">
                         <X size={18} className="text-red-500 shrink-0" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </GlassCard>

              <GlassCard variant="dark" className="p-8 border-ecovolt-green-500/20 bg-ecovolt-green-500/5 shadow-[0_0_30px_-10px_rgba(34,197,94,0.15)]">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-ecovolt-green-500/10 border border-ecovolt-green-500/20 flex items-center justify-center text-ecovolt-green-500">
                       <Check size={24} />
                    </div>
                    <Heading as="h3" className="text-2xl text-white">Vantagem EcoVolt</Heading>
                 </div>
                 <ul className="space-y-4">
                    {["ROI imediato via eficiência", "Certificação automática de energia limpa", "Monitoramento preditivo 24/7", "Interface unificada de gestão"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-200 font-bold">
                         <Check size={18} className="text-ecovolt-green-500 shrink-0" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </GlassCard>
           </div>

           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-4 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.6)]">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-white/10">
                          <th className="py-6 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Recurso</th>
                          <th className="py-6 text-[10px] uppercase font-bold text-slate-500 tracking-widest">EcoVolt</th>
                          <th className="py-6 text-[10px] uppercase font-bold text-slate-500 tracking-widest whitespace-nowrap">Impacto B2B</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {comparisonData.map((row, i) => (
                         <tr key={i} className="group hover:bg-slate-800/50 transition-colors">
                            <td className="py-6 pr-4">
                               <p className="font-bold text-white tracking-tight">{row.feature}</p>
                            </td>
                            <td className="py-6 pr-4">
                               <p className="text-sm font-black text-ecovolt-green-400">{row.ecovolt}</p>
                            </td>
                            <td className="py-6">
                               <div className="px-3 py-1.5 bg-slate-800 border border-white/5 rounded-lg inline-block text-center">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">{row.impact}</p>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="mt-10 p-6 bg-gradient-to-r from-ecovolt-green-600 to-ecovolt-green-500 rounded-2xl flex flex-col sm:flex-row gap-6 sm:gap-0 items-center justify-between text-white shadow-xl shadow-ecovolt-green-500/20">
                 <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                       <Scale size={24} strokeWidth={2} />
                    </div>
                    <div>
                       <p className="text-sm font-bold opacity-90">Eficiência média garantida</p>
                       <p className="text-3xl font-black tracking-tight">+35%</p>
                    </div>
                 </div>
                 <div className="hidden sm:block h-12 w-px bg-white/30" />
                 <div className="w-full h-px bg-white/30 sm:hidden" />
                 <div className="text-center sm:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Payback Estimado</p>
                    <p className="text-2xl font-black">Imediato</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Section>
  );
};
