"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { AlertTriangle, ShieldAlert, ZapOff } from "lucide-react";

export const Problem = () => {
  const problems = [
    {
      title: "Instabilidade Energética",
      description: "Quedas inesperadas de energia podem custar milhões e destruir a reputação de um grande evento.",
      icon: ZapOff,
      accent: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      title: "Opacidade Financeira",
      description: "Faturas complexas e reconciliação manual impossibilitam a auditoria precisa de gastos pós-evento.",
      icon: AlertTriangle,
      accent: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Desperdício 'Verde'",
      description: "Pagar por certificados de energia renovável que não garantem o uso real de fontes limpas na carga total.",
      icon: ShieldAlert,
      accent: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <Section id="problema" className="bg-gradient-to-b from-slate-950 to-slate-950 py-32 md:py-64 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <Subheading className="text-emerald-500">The Problem</Subheading>
            <Heading as="h2" className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">O status quo do setor é <br/><span className="text-slate-500">insustentável.</span></Heading>
            <Paragraph className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed">
              Organizadores ainda lidam com estimativas manuais, sistemas arcaicos e absoluta falta de transparência sobre o impacto ambiental real.
            </Paragraph>
          </div>

          <div className="space-y-6">
            {problems.map((item, i) => (
              <GlassCard 
                key={i} 
                variant="dark" 
                className="group flex flex-col md:flex-row gap-6 items-start md:items-center p-10 border-white/5 bg-slate-900/40 hover:bg-slate-900/80 hover:-translate-y-1 transition-all shadow-2xl"
              >
                <div className={`w-16 h-16 shrink-0 rounded-2xl ${item.bg} flex items-center justify-center ${item.accent} shadow-xl shadow-black/20 group-hover:scale-110 transition-transform`}>
                   <item.icon size={32} aria-hidden="true" />
                </div>
                <div className="space-y-2">
                   <Heading as="h3" className="text-white text-2xl md:text-3xl font-black tracking-tight leading-none">{item.title}</Heading>
                   <Paragraph className="text-slate-400 font-medium leading-relaxed">{item.description}</Paragraph>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
