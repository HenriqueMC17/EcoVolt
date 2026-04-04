"use client";

import React, { useState } from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { theme } from "@/shared/lib/theme";
import { cn } from "@/shared/lib/utils";

const faqs = [
  {
    question: "Como a EcoVolt garante a procedência da energia?",
    answer: "Trabalhamos exclusivamente com provedores homologados que utilizam certificação I-REC e auditoria em blockchain para garantir que cada kW entregue ao evento venha de fontes 100% renováveis.",
  },
  {
    question: "A plataforma suporta eventos internacionais?",
    answer: "Sim, nossa rede de provedores e nossa infraestrutura de Smart Contracts operam globalmente, suportando múltiplas moedas e regulamentações energéticas locais.",
  },
  {
    question: "Quanto tempo leva para implementar a solução?",
    answer: "Para eventos de médio porte, a configuração completa leva cerca de 72 horas. Para turnês mundiais ou festivais de grande escala, recomendamos um planejamento de 30 dias.",
  },
  {
    question: "Como funciona a reconciliação financeira?",
    answer: "Nossa camada digital monitora os meters em tempo real. Ao fim do evento, os dados são cruzados com o contrato inteligente, gerando a fatura final automaticamente sem necessidade de disputas manuais.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) => {
  return (
    <GlassCard 
      variant="dark"
      className={cn(
        "p-0 border-white/5 bg-slate-900/40 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden",
        isOpen ? "border-white/10 bg-slate-900/80 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]" : "hover:bg-slate-900/60"
      )} 
      hover={false}
      onClick={onClick}
    >
      <div className="p-6 md:p-8 flex items-center justify-between gap-6">
        <div className="space-y-1 text-left">
           <Heading as="h4" className="text-lg md:text-xl text-white tracking-tight">{faq.question}</Heading>
        </div>
        <div className={cn(
           "w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 border",
           isOpen ? "bg-ecovolt-green-500/10 text-ecovolt-green-400 border-ecovolt-green-500/20" : "bg-slate-800 text-slate-400 border-white/5"
        )}>
           {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: theme.animations.durations.normal, ease: theme.animations.easing.premium }}
          >
            <div className="px-8 pb-8 pt-0 text-left border-t border-white/5 mx-2 mt-2">
               <Text className="text-base text-slate-400 font-medium pt-6">{faq.answer}</Text>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-slate-950 py-32 md:py-48 overflow-hidden relative border-t border-white/5">
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-ecovolt-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <Subheading className="text-ecovolt-green-400">The Details</Subheading>
          <Heading className="text-white">Perguntas Frequentes.</Heading>
          <Text className="text-lg md:text-xl text-slate-400 font-medium">
             Tudo o que você precisa saber sobre a infraestrutura da EcoVolt.
          </Text>
        </div>

        <div className="space-y-4" aria-label="FAQ Accordion">
          {faqs.map((faq, i) => (
            <FAQItem 
              key={i} 
              faq={faq} 
              isOpen={openIndex === i} 
              onClick={() => setOpenIndex(openIndex === i ? null : i)} 
            />
          ))}
        </div>

        <div className="mt-20 text-center">
           <Text className="text-sm text-slate-500">Ainda tem dúvidas? <span className="text-ecovolt-green-400 font-bold cursor-pointer hover:underline">Fale com um especialista.</span></Text>
        </div>
      </div>
    </Section>
  );
};
