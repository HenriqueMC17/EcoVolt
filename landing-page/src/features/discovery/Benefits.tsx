"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { ShieldCheck, BarChart3, Globe, TrendingDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const benefits = [
  {
    title: "Risco Regulatório Zero",
    description: "Conformidade total e automática com normas ESG e certificações de energia renovável via Smart Contracts auditáveis.",
    icon: ShieldCheck,
    className: "md:col-span-2",
  },
  {
    title: "Economia Inteligente",
    description: "Reduza custos fixos em até 30% com algoritmos de IA que otimizam a distribuição térmica e elétrica.",
    icon: TrendingDown,
    className: "md:col-span-1",
  },
  {
    title: "Escala Sem Fronteiras",
    description: "Ative infraestrutura energética em qualquer localidade com nossa rede global de provedores homologados.",
    icon: Globe,
    className: "md:col-span-1",
  },
  {
    title: "Transparência Total",
    description: "Reconciliação em tempo real e fechamento fiscal instantâneo. Elimine erros de faturamento pós-evento.",
    icon: BarChart3,
    className: "md:col-span-2",
  },
];

const BenefitCard = ({ benefit, index }: { benefit: typeof benefits[0], index: number }) => {
  const Icon = benefit.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn("h-full", benefit.className)}
    >
      <GlassCard 
        variant="dark" 
        className="p-10 md:p-14 h-full flex flex-col justify-between group border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all duration-700 relative overflow-hidden group/benefit"
      >
        <div className="space-y-10 relative z-10">
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 transition-all duration-500 group-hover/benefit:scale-110 group-hover/benefit:bg-emerald-500 group-hover/benefit:text-white group-hover/benefit:shadow-[0_0_40px_rgba(16,185,129,0.5)]" aria-hidden="true">
              <Icon size={32} strokeWidth={1.5} />
            </div>
            <ArrowUpRight size={24} className="text-slate-700 group-hover/benefit:text-emerald-500 group-hover/benefit:translate-x-1 group-hover/benefit:-translate-y-1 transition-all duration-500" />
          </div>
          <div className="space-y-6">
            <Heading as="h3" className="text-3xl md:text-4xl text-white font-black tracking-tight group-hover/benefit:text-emerald-400 transition-colors leading-[1.1]">
              {benefit.title}
            </Heading>
            <Paragraph className="text-lg md:text-xl font-medium text-slate-400 leading-relaxed group-hover/benefit:text-slate-300 transition-colors">
              {benefit.description}
            </Paragraph>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full group-hover/benefit:bg-emerald-500/15 transition-all duration-1000 -z-10" />
      </GlassCard>
    </motion.div>
  );
};

export const Benefits = () => {
  return (
    <Section id="beneficios" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#10B98105,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Subheading className="text-emerald-500 font-black tracking-[0.3em] mb-4 uppercase">THE BUSINESS CASE</Subheading>
            <Heading className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Por que diretores de operações escolhem a <span className="text-slate-500">ECOVOLT.</span>
            </Heading>
            <Paragraph className="text-lg md:text-2xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Unimos sustentabilidade e performance financeira para transformar custos variáveis em ativos estratégicos gerenciáveis.
            </Paragraph>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10" aria-label="Lista de Benefícios Corporativos">
          {benefits.map((benefit, i) => (
            <BenefitCard key={i} benefit={benefit} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
};
