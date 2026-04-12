"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Check, X, ZapOff, Scale, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

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
    traditional: "Altos (Falta de Backup)",
    ecovolt: "Resiliência Digital 24/7",
    impact: "Continuidade Absoluta",
  },
];

export const Comparison = () => {
  return (
    <Section id="comparativo" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-32 space-y-6">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
           >
              <Subheading className="text-emerald-500 font-black tracking-[0.3em] uppercase">THE BENCHMARK</Subheading>
              <Heading className="max-w-4xl mx-auto text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                EcoVolt vs <br/><span className="text-slate-500">Métodos Tradicionais.</span>
              </Heading>
              <Paragraph className="text-lg md:text-2xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Pare de gastar com energia que sua infraestrutura não consome. Veja por que somos a escolha lógica para grandes operações.
              </Paragraph>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           <div className="lg:col-span-5 space-y-8">
              <GlassCard variant="dark" className="p-10 border-red-500/10 bg-red-500/5 shadow-2xl">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                       <ZapOff size={28} />
                    </div>
                    <Heading as="h3" className="text-2xl md:text-3xl text-white font-black tracking-tight">Tradicionais</Heading>
                 </div>
                 <ul className="space-y-6">
                    {["Custos ocultos no faturamento", "Falta de dados para ESG", "Desperdícios operacionais", "Risco de multas ambientais"].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-500 font-medium group">
                         <X size={20} className="text-red-500 shrink-0 mt-1" />
                         <span className="group-hover:text-slate-400 transition-colors">{item}</span>
                      </li>
                    ))}
                 </ul>
              </GlassCard>

              <GlassCard variant="dark" className="p-10 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 </div>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                       <Check size={28} />
                    </div>
                    <Heading as="h3" className="text-2xl md:text-3xl text-white font-black tracking-tight">Vantagem EcoVolt</Heading>
                 </div>
                 <ul className="space-y-6">
                    {["ROI imediato via eficiência", "Certificação automática", "Monitoramento preditivo 24/7", "Interface unificada"].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-200 font-bold group">
                         <Check size={20} className="text-emerald-500 shrink-0 mt-1" />
                         <span className="group-hover:text-white transition-colors">{item}</span>
                      </li>
                    ))}
                 </ul>
              </GlassCard>
           </div>

           <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 rounded-[3rem] p-4 md:p-14 shadow-2xl backdrop-blur-3xl relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-white/5">
                          <th className="pb-8 text-[11px] uppercase font-black text-slate-500 tracking-[0.3em]">Recurso Principal</th>
                          <th className="pb-8 text-[11px] uppercase font-black text-emerald-500 tracking-[0.3em]">EcoVolt OS</th>
                          <th className="pb-8 text-[11px] uppercase font-black text-slate-500 tracking-[0.3em] whitespace-nowrap">Impacto Direto</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                       {comparisonData.map((row, i) => (
                         <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-8 pr-6">
                               <p className="font-black text-white text-lg tracking-tight leading-none">{row.feature}</p>
                            </td>
                            <td className="py-8 pr-6">
                               <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">{row.ecovolt}</p>
                            </td>
                            <td className="py-8">
                               <div className="px-4 py-2 bg-slate-800/50 border border-white/5 rounded-xl inline-block text-center shadow-inner">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{row.impact}</p>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-14 p-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2rem] flex flex-col sm:flex-row gap-8 sm:gap-0 items-center justify-between text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden group cursor-pointer"
              >
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                 <div className="flex items-center gap-6 text-center sm:text-left relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
                       <Scale size={32} strokeWidth={1} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Guaranteed Performance</p>
                       <p className="text-5xl font-black tracking-tighter">+35% <span className="text-xl opacity-60">Avg. Efficiency</span></p>
                    </div>
                 </div>
                 <div className="hidden sm:block h-16 w-px bg-white/20 relative z-10" />
                 <div className="text-center sm:text-right relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Faturamento Estimado</p>
                    <p className="text-3xl font-black group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                       Imediato <ArrowRight size={24} />
                    </p>
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </Section>
  );
};
