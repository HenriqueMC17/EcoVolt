"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Target, Layers, Leaf, Rocket, Globe, Zap, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const diffs = [
  {
    title: "Eco-Specialized",
    description: "Foco absoluto no nicho de eventos, resolvendo dores específicas de produtores globais.",
    icon: Target,
    tag: "Niche Leader"
  },
  {
    title: "Stack Integrada",
    description: "Unimos estimativa, contratação e reconciliação em uma única API de alta disponibilidade.",
    icon: Layers,
    tag: "All-in-one"
  },
  {
    title: "Visão Operacional",
    description: "Entregamos software de monitoramento real que de fato governa a carga energética do grid.",
    icon: Activity,
    tag: "Realtime OS"
  },
  {
    title: "Escalabilidade B2B",
    description: "Arquitetura preparada para suportar a infraestrutura crítica de festivais e turnês mundiais.",
    icon: ShieldCheck,
    tag: "Enterprise Ready"
  },
];

export const Differentials = () => {
  return (
    <Section id="diferenciais" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-32 space-y-6">
           <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
           >
              <Subheading className="text-emerald-500 font-black tracking-[0.3em] uppercase">THE ECOVOLT EDGE</Subheading>
              <Heading className="max-w-4xl mx-auto text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                Onde a precisão encontra a <br/><span className="text-slate-500">sustentabilidade.</span>
              </Heading>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {diffs.map((diff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard 
                variant="dark" 
                className="flex flex-col items-center text-center p-12 bg-slate-900/40 border-white/5 group hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all duration-700 h-full relative"
                hover={false}
              >
                <div className="absolute top-6 right-6">
                   <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                      {diff.tag}
                   </div>
                </div>
                
                <div className="w-20 h-20 bg-slate-950 border border-white/5 text-slate-600 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-500">
                  <diff.icon size={32} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-4">
                   <Heading as="h4" className="text-xl font-black text-white tracking-tight uppercase leading-tight group-hover:text-emerald-400 transition-colors">
                      {diff.title}
                   </Heading>
                   <Paragraph className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                      {diff.description}
                   </Paragraph>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
