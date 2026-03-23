"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
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
    <Section id="problema" className="bg-slate-950 py-32 md:py-48 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <Subheading className="text-red-500">The Problem</Subheading>
            <Heading as="h2" className="text-white">O status quo do setor de eventos é <span className="text-white/40">insustentável.</span></Heading>
            <Text className="text-slate-400 text-lg md:text-xl font-medium">
              Organizadores ainda lidam com estimativas manuais, sistemas arcaicos e absoluta falta de transparência sobre o impacto ambiental real.
            </Text>
          </div>

          <div className="space-y-6">
            {problems.map((item, i) => (
              <GlassCard 
                key={i} 
                variant="dark" 
                className="group flex flex-col md:flex-row gap-6 items-start md:items-center p-8 border-white/5 bg-white/[0.02]"
              >
                <div className={`w-14 h-14 shrink-0 rounded-2xl ${item.bg} flex items-center justify-center ${item.accent} shadow-xl shadow-black/20`}>
                  <item.icon size={28} aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">{item.title}</h3>
                  <Text className="text-slate-500 font-medium leading-snug">{item.description}</Text>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
