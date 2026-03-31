"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { ShieldCheck, BarChart3, Globe, TrendingDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const benefits = [
  {
    title: "Risco Regulatório Zero",
    description: "Conformidade total e automática com normas ESG e certificações de energia renovável via Smart Contracts.",
    icon: ShieldCheck,
    className: "md:col-span-2",
  },
  {
    title: "Economia Inteligente",
    description: "Reduza custos fixos em até 30% com algoritmos de IA que otimizam cada kW distribuído.",
    icon: TrendingDown,
    className: "md:col-span-1",
  },
  {
    title: "Escala Sem Fronteiras",
    description: "Ative infraestrutura energética em qualquer continente com nossa rede de provedores homologados.",
    icon: Globe,
    className: "md:col-span-1",
  },
  {
    title: "Transparência Financeira",
    description: "Reconciliação em tempo real e fechamento fiscal instantâneo. Elimine erros de faturamento pós-evento.",
    icon: BarChart3,
    className: "md:col-span-2",
  },
];

const BenefitCard = ({ benefit }: { benefit: typeof benefits[0] }) => {
  const Icon = benefit.icon;
  return (
    <GlassCard className={cn("p-8 h-full flex flex-col justify-between group", benefit.className)}>
      <div className="space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-ecovolt-green-500/10 flex items-center justify-center text-ecovolt-green-600 transition-all group-hover:bg-ecovolt-green-500 group-hover:text-white" aria-hidden="true">
          <Icon size={24} />
        </div>
        <div className="space-y-2">
          <Heading as="h3" className="text-xl md:text-2xl tracking-tight">{benefit.title}</Heading>
          <Text className="text-base font-medium text-slate-500">{benefit.description}</Text>
        </div>
      </div>
    </GlassCard>
  );
};

export const Benefits = () => {
  return (
    <Section id="beneficios" className="bg-white py-32 md:py-48 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
          <Subheading>The Business Case</Subheading>
          <Heading className="mb-6">Por que diretores de operações escolhem a <span className="text-ecovolt-green-600">EcoVolt</span>.</Heading>
          <Text className="text-lg md:text-xl font-medium text-slate-500">
            Unimos sustentabilidade e performance financeira para transformar custos variáveis em ativos estratégicos.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Lista de Benefícios">
          {benefits.map((benefit, i) => (
            <BenefitCard key={i} benefit={benefit} />
          ))}
        </div>
      </div>
    </Section>
  );
};
