"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Check, Zap, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { m as motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

const plans = [
  {
    name: "Standard",
    price: "Custom",
    description: "Ideal para eventos regionais e infraestruturas em fase de transição.",
    features: [
       "Intermediação com 1 provedor",
       "Monitoramento básico de carga",
       "Dashboard de acompanhamento",
       "Certificação I-REC básica",
       "Suporte via tickets"
    ],
    highlight: false,
    icon: Globe
  },
  {
    name: "Enterprise",
    price: "Scale",
    description: "Para grandes festivais e turnês que exigem infraestrutura crítica e redundância.",
    features: [
       "Múltiplos provedores globais",
       "Gestão de Smart Contracts",
       "Consultoria técnica 24/7",
       "Auditoria em Blockchain",
       "SLA: 99.99% Availability",
       "Dedicated Account Manager"
    ],
    highlight: true,
    icon: Zap
  }
];

export const Pricing = () => {
  return (
    <Section id="pricing" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-32 space-y-6">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
           >
              <Subheading className="text-emerald-500 font-black tracking-[0.3em] uppercase">TRANSPARENT GROWTH</Subheading>
              <Heading className="max-w-4xl mx-auto text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                Planos de <br/><span className="text-slate-500">Infraestrutura.</span>
              </Heading>
              <Paragraph className="text-lg md:text-2xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 Provisionamento técnico moldado para a escala e complexidade da sua operação.
              </Paragraph>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard 
                className={cn(
                  "p-0 border-white/5 bg-slate-900/40 shadow-2xl relative overflow-hidden h-full group",
                  plan.highlight ? "border-emerald-500/20 shadow-[0_30px_80px_rgba(16,185,129,0.1)]" : "hover:bg-slate-900/60"
                )}
                variant="dark"
                hover={false}
              >
                {plan.highlight && (
                   <div className="absolute top-0 right-0 p-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/30">
                         <ShieldCheck size={10} /> Optimal Choice
                      </div>
                   </div>
                )}
                
                <div className="p-10 md:p-14 space-y-10 flex flex-col h-full">
                   <div className="space-y-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                        plan.highlight ? "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700"
                      )}>
                         <plan.icon size={32} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-2">
                         <Heading as="h3" className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none uppercase">
                            {plan.name}
                         </Heading>
                         <Paragraph className="text-slate-400 font-medium leading-relaxed">
                            {plan.description}
                         </Paragraph>
                      </div>
                   </div>

                   <div className="py-8 border-y border-white/5">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Scalable from</span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                         <span className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                           {plan.price}
                         </span>
                         <span className="text-sm font-black text-slate-500 uppercase tracking-widest">/ Node</span>
                      </div>
                   </div>

                   <ul className="space-y-6 flex-grow">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-4 group/item">
                           <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <Check size={12} strokeWidth={3} />
                           </div>
                           <span className="text-slate-400 font-medium group-hover/item:text-slate-200 transition-colors">
                             {feature}
                           </span>
                        </li>
                      ))}
                   </ul>

                   <Button 
                      variant={plan.highlight ? "primary" : "secondary"}
                      className={cn(
                        "w-full h-20 text-lg font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden group/btn",
                        plan.highlight ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_15px_40px_rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                   >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                         Configure Stack <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                   </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-32 text-center flex flex-col items-center gap-4">
           <Paragraph className="text-slate-500 font-medium">Looking for customized SLA or private grid deployment?</Paragraph>
           <button className="text-emerald-500 font-black uppercase text-xs tracking-[0.3em] hover:tracking-[0.4em] transition-all flex items-center gap-2 group">
              Speak with Infrastructure team <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </Section>
  );
};
