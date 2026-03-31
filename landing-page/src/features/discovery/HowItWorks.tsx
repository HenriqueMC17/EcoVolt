"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Search, Handshake, MonitorCheck, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { theme } from "@/shared/lib/theme";
import { Badge } from "@/shared/ui/Badge";

const steps = [
  {
    title: "Mapeamento Global",
    description: "Nossa IA analisa sua planta e mapeia provedores de energia limpa em qualquer lugar do mundo.",
    icon: Search,
  },
  {
    title: "Smart Contracts",
    description: "Fechamento automático com provedores via contratos inteligentes que garantem preço e conformidade.",
    icon: Handshake,
  },
  {
    title: "Monitoramento Live",
    description: "Uma camada digital monitora cada kW consumido em tempo real durante toda a produção.",
    icon: MonitorCheck,
  },
];

export const HowItWorks = () => {
  return (
    <Section id="como-funciona" className="bg-white py-32 md:py-48 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 space-y-6">
          <Subheading>The Flow</Subheading>
          <Heading className="max-w-3xl mx-auto">
            Da estimativa ao faturamento: <span className="text-slate-400">Totalmente integrado.</span>
          </Heading>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-ecovolt-green-500/0 via-ecovolt-green-500/20 to-ecovolt-green-500/0 hidden lg:block -translate-y-1/2" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: theme.animations.durations.slow, ease: theme.animations.easing.premium }}
                  className="relative z-10"
                >
                  <GlassCard className="h-full flex flex-col items-center text-center p-10 bg-white border-slate-100 hover:border-ecovolt-green-500/30">
                    <div className="relative mb-10">
                       <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-ecovolt-green-600 shadow-inner group-hover:scale-110 transition-transform">
                          <Icon size={32} aria-hidden="true" />
                       </div>
                       <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold ring-4 ring-white">
                          0{i + 1}
                       </div>
                    </div>
                    <div className="space-y-4">
                      <Heading as="h3">{step.title}</Heading>
                      <Text>{step.description}</Text>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-32 p-10 md:p-14 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4">
               <Heading as="h3" className="text-3xl md:text-5xl tracking-tighter">Finishing with Precision.</Heading>
               <Text className="text-lg md:text-xl font-medium max-w-lg">
                  Após o evento, nossa reconciliação financeira emite notas fiscais e relatórios técnicos em menos de 10 segundos.
               </Text>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-ecovolt-green-600 shadow-lg shadow-slate-200" aria-hidden="true">
                  <BarChart3 size={32} />
               </div>
               <Badge variant="success">Reconciliação Instantânea</Badge>
            </div>
        </div>
      </div>
    </Section>
  );
};
