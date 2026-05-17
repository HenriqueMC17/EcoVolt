"use client";

import React, { useState } from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";
import { m as motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";
import { theme } from "@/shared/lib/theme";
import { cn } from "@/shared/lib/utils";

const faqs = [
  {
    question: "Como a EcoVolt garante a procedência da energia?",
    answer: "Trabalhamos exclusivamente com provedores homologados que utilizam certificação I-REC e auditoria em blockchain para garantir que cada kW entregue ao evento venha de fontes 100% renováveis e auditáveis em tempo real.",
  },
  {
    question: "A plataforma suporta eventos internacionais?",
    answer: "Sim, nossa infraestrutura de Smart Contracts e rede de distribuição operam globalmente, com suporte nativo a cross-border payments e regulamentações energéticas de múltiplos territórios (EU, US, LATAM).",
  },
  {
    question: "Quanto tempo leva para implementar a solução?",
    answer: "Para operações de médio porte, o setup completo leva cerca de 72 horas. Para grandes festivais ou turnês globais com alta complexidade logística, recomendamos um provisionamento estratégico de 30 dias.",
  },
  {
    question: "Como funciona a reconciliação financeira?",
    answer: "Nossa camada digital de monitoramento cruza os dados de consumo dos meters com os termos do contrato inteligente. Ao fim da operação, a reconciliação é instantânea, gerando faturas e relatórios técnicos sem intervenção manual.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) => {
  return (
    <motion.div
       layout
       initial={false}
       className="relative"
    >
      <GlassCard 
        variant="dark"
        className={cn(
          "p-0 border-white/5 bg-slate-900/20 shadow-sm transition-all duration-500 cursor-pointer overflow-hidden relative group",
          isOpen ? "border-emerald-500/20 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.4)]" : "hover:bg-slate-900/40 hover:border-white/10"
        )} 
        hover={false}
        onClick={onClick}
      >
        <div className="p-8 md:p-10 flex items-center justify-between gap-8">
          <div className="space-y-2 text-left">
             <div className="flex items-center gap-3 mb-2">
                <HelpCircle size={14} className={cn("transition-colors", isOpen ? "text-emerald-500" : "text-slate-600")} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-400 transition-colors">Enterprise Inquiry</span>
             </div>
             <Heading as="h4" className="text-xl md:text-2xl text-white font-black tracking-tight leading-tight">{faq.question}</Heading>
          </div>
          <div className={cn(
             "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 border relative overflow-hidden",
             isOpen ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-slate-800/50 text-slate-400 border-white/5"
          )}>
             {isOpen ? <Minus size={24} strokeWidth={2.5} /> : <Plus size={24} strokeWidth={2.5} />}
          </div>
        </div>
        
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-10 pb-10 pt-0 text-left border-t border-white/5 mx-2 mt-2">
                 <Paragraph className="text-lg text-slate-400 font-medium pt-8 leading-relaxed">
                    {faq.answer}
                 </Paragraph>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32 space-y-6">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
           >
              <Subheading className="text-emerald-500 font-black tracking-[0.3em] uppercase">THE DETAILS</Subheading>
              <Heading className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                Perguntas <br/><span className="text-slate-500">Frequentes.</span>
              </Heading>
              <Paragraph className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                 Esclareça dúvidas técnicas sobre a infraestrutura digital e energética da EcoVolt.
              </Paragraph>
           </motion.div>
        </div>

        <div className="space-y-6" aria-label="Enterprise FAQ Accordion">
          {faqs.map((faq, i) => (
            <FAQItem 
              key={i} 
              faq={faq} 
              isOpen={openIndex === i} 
              onClick={() => setOpenIndex(openIndex === i ? null : i)} 
            />
          ))}
        </div>

        <motion.div 
           whileHover={{ scale: 1.02 }}
           className="mt-24 p-8 bg-white/5 border border-white/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl group cursor-pointer"
        >
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                 <MessageCircle size={28} />
              </div>
              <div className="text-left">
                 <p className="text-white font-black tracking-tight">Ainda tem dúvidas?</p>
                 <Paragraph className="text-sm text-slate-500 font-medium">Nossa equipe de engenharia está pronta para ajudar.</Paragraph>
              </div>
           </div>
           <button className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
              Falar com Especialista
           </button>
        </motion.div>
      </div>
    </Section>
  );
};
