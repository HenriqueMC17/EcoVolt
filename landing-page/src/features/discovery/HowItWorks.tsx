"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Search, Handshake, MonitorCheck, BarChart3, ArrowRight, Activity, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { theme } from "@/shared/lib/theme";
import { cn } from "@/shared/lib/utils";

const steps = [
  {
    title: "Mapeamento Global",
    description: "Nossa IA analisa sua planta e mapeia provedores de energia limpa em qualquer coordenada do globo.",
    icon: Search,
    detail: "Latency: < 40ms"
  },
  {
    title: "Smart Contracts",
    description: "Fechamento automático com provedores via contratos inteligentes que blindam preço e conformidade.",
    icon: Handshake,
    detail: "Blockchain Verified"
  },
  {
    title: "Monitoramento Live",
    description: "Uma camada digital monitora cada kW consumido em tempo real durante toda a sua produção.",
    icon: MonitorCheck,
    detail: "Real-time Stream"
  },
];

export const HowItWorks = () => {
  return (
    <Section id="como-funciona" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.02)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-32 space-y-6">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
           >
              <Subheading className="text-emerald-500 font-black tracking-[0.3em] uppercase">OPERATIONAL FLOW</Subheading>
              <Heading className="max-w-4xl mx-auto text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                Da estratégia ao faturamento: <br/><span className="text-slate-500">Totalmente integrado.</span>
              </Heading>
           </motion.div>
        </div>

        <div className="relative">
          {/* Enhanced Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent hidden lg:block -translate-y-1/2" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 group"
                >
                  <GlassCard variant="dark" className="h-full flex flex-col items-center text-center p-12 bg-slate-900/40 border-white/5 hover:border-emerald-500/30 transition-all duration-700">
                    <div className="relative mb-12">
                       <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                          <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
                       </div>
                       <div className="absolute -top-4 -right-4 w-10 h-10 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-white text-xs font-black ring-4 ring-slate-950 shadow-2xl">
                          0{i + 1}
                       </div>
                    </div>
                    <div className="space-y-6">
                       <Heading as="h3" className="text-2xl md:text-3xl text-white font-black tracking-tight">{step.title}</Heading>
                       <Paragraph className="text-slate-400 font-medium leading-relaxed">{step.description}</Paragraph>
                       <div className="pt-4 flex items-center justify-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{step.detail}</span>
                       </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-32 p-10 md:p-20 bg-slate-900/40 rounded-[4rem] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-16 backdrop-blur-3xl relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
            
            <div className="space-y-8 relative z-10 text-center lg:text-left">
               <div className="flex items-center justify-center lg:justify-start gap-3">
                  <Shield size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Compliance & precision</span>
               </div>
               <Heading as="h3" className="text-4xl md:text-7xl text-white font-black tracking-tighter leading-[0.9]">Finishing with <br/><span className="text-slate-500">Extreme Precision.</span></Heading>
               <Paragraph className="text-lg md:text-2xl font-medium text-slate-400 max-w-2xl leading-relaxed">
                  Após o fechamento da operação, nossa reconciliação algorítmica emite auditorias técnicas e faturamento consolidado em segundos.
               </Paragraph>
            </div>
            
            <div className="flex flex-col items-center gap-8 relative z-10">
               <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.4)] relative" aria-hidden="true">
                     <BarChart3 size={44} strokeWidth={1.5} />
                  </div>
               </div>
               <div className="space-y-2 text-center">
                  <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Instant Reconciliation</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                     <Activity size={12} className="text-emerald-500" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SLA: 0.04s Process</span>
                  </div>
               </div>
            </div>
        </motion.div>
      </div>
    </Section>
  );
};
