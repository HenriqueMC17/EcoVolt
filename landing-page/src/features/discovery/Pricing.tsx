"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Check, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Standard",
    price: "Sob consulta",
    description: "Ideal para eventos regionais e produtores independentes.",
    features: [
       "Intermediação com 1 provedor",
       "Estimativa básica de carga",
       "Dashboard de acompanhamento",
       "Certificação I-REC básica"
    ],
    highlight: false,
    icon: Globe
  },
  {
    name: "Enterprise",
    price: "Customizado",
    description: "Para grandes festivais e turnês que exigem infraestrutura crítica.",
    features: [
       "Múltiplos provedores simultâneos",
       "Gestão de Smart Contracts",
       "Consultoria técnica 24/7",
       "Auditoria em Blockchain",
       "SLA de 99.9% de entrega"
    ],
    highlight: true,
    icon: Zap
  }
];

export const Pricing = () => {
  return (
    <Section id="pricing" className="bg-white py-32 md:py-48 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <Subheading>Transparent Growth</Subheading>
          <Heading className="text-slate-900">Planos de Infraestrutura.</Heading>
          <Text className="text-lg md:text-xl font-medium max-w-2xl mx-auto">
             Escolha o nível de suporte e tecnologia necessário para a escala do seu evento.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard 
                className={plan.highlight ? "border-ecovolt-green-500/30 shadow-2xl shadow-ecovolt-green-500/5" : "border-slate-100 shadow-sm"}
                variant={plan.highlight ? "dark" : "light"}
                hover={true}
              >
                <div className="p-4 md:p-8 space-y-8">
                   <div className="flex items-center justify-between">
                     <div className={plan.highlight ? "text-ecovolt-green-500" : "text-slate-400"}>
                        <plan.icon size={32} />
                     </div>
                     {plan.highlight && (
                       <span className="px-3 py-1 bg-ecovolt-green-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                          Mais Escolhido
                       </span>
                     )}
                   </div>

                   <div className="space-y-2">
                      <h3 className={plan.highlight ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900"}>
                        {plan.name}
                      </h3>
                      <p className={plan.highlight ? "text-slate-400 text-sm" : "text-slate-500 text-sm"}>
                        {plan.description}
                      </p>
                   </div>

                   <div className="flex items-baseline gap-1">
                      <span className={plan.highlight ? "text-4xl font-display font-bold text-white leading-none" : "text-4xl font-display font-bold text-slate-900 leading-none"}>
                        {plan.price}
                      </span>
                   </div>

                   <div className="h-px w-full bg-slate-100/10" />

                   <ul className="space-y-4">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3">
                           <Check size={16} className="text-ecovolt-green-500 shrink-0" />
                           <span className={plan.highlight ? "text-sm text-slate-300" : "text-sm text-slate-600"}>
                             {feature}
                           </span>
                        </li>
                      ))}
                   </ul>

                   <Button 
                      variant={plan.highlight ? "primary" : "secondary"}
                      className="w-full h-14"
                   >
                      Contatar Vendas
                   </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
