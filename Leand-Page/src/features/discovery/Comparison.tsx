"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Check, X, ShieldAlert, ZapOff, Scale } from "lucide-react";

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
    <Section id="comparativo" className="bg-slate-50 py-32 md:py-48 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-4">
           <Subheading>The Benchmark</Subheading>
           <Heading className="max-w-3xl mx-auto">EcoVolt vs <span className="text-slate-400">Métodos Tradicionais.</span></Heading>
           <Text className="text-lg md:text-xl font-medium text-slate-500">
              Pare de gastar com energia que você não consome. Veja por que somos a escolha lógica.
           </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="space-y-8">
              <GlassCard className="p-8 border-red-500/10 bg-red-50/10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                       <ZapOff size={24} />
                    </div>
                    <Heading as="h3" className="text-2xl">Métodos Tradicionais</Heading>
                 </div>
                 <ul className="space-y-4">
                    {["Custos ocultos no faturamento", "Falta de dados para relatórios ESG", "Desperdiço operacionais", "Risco de multas ambientais"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                         <X size={18} className="text-red-500" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </GlassCard>

              <GlassCard className="p-8 border-ecovolt-green-500/20 bg-ecovolt-green-50/10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-ecovolt-green-100 flex items-center justify-center text-ecovolt-green-600">
                       <Check size={24} />
                    </div>
                    <Heading as="h3" className="text-2xl">Vantagem EcoVolt</Heading>
                 </div>
                 <ul className="space-y-4">
                    {["ROI imediato via eficiência", "Certificação automática de energia limpa", "Monitoramento preditivo 24/7", "Interface unificada de gestão"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-900 font-bold">
                         <Check size={18} className="text-ecovolt-green-600" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </GlassCard>
           </div>

           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-10 shadow-xl shadow-slate-200/50">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="py-6 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Recurso</th>
                          <th className="py-6 text-[10px] uppercase font-bold text-slate-400 tracking-widest">EcoVolt</th>
                          <th className="py-6 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Impacto B2B</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {comparisonData.map((row, i) => (
                         <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 pr-4">
                               <p className="font-bold text-slate-800">{row.feature}</p>
                            </td>
                            <td className="py-6 pr-4">
                               <p className="text-sm font-black text-ecovolt-green-600">{row.ecovolt}</p>
                            </td>
                            <td className="py-6">
                               <div className="px-3 py-1 bg-slate-100 rounded-lg inline-block">
                                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{row.impact}</p>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="mt-10 p-6 bg-ecovolt-green-500 rounded-2xl flex items-center justify-between text-white">
                 <div className="flex items-center gap-4">
                    <Scale size={32} strokeWidth={1.5} />
                    <div>
                       <p className="text-sm font-bold">Eficiência média garantida</p>
                       <p className="text-2xl font-black">+35%</p>
                    </div>
                 </div>
                 <div className="h-10 w-px bg-white/20" />
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Payback Estimado</p>
                    <p className="text-xl font-bold">Imediato</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Section>
  );
};
