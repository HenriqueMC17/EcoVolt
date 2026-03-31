"use client";

import React from "react";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { Glow } from "@/shared/ui/Glow";
import { GlassCard } from "@/shared/ui/GlassCard";
import { motion } from "framer-motion";
import { Send, Mail, Phone, ShieldCheck, Zap } from "lucide-react";

export const ContactForm = () => {
  return (
    <Section id="contato" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative">
      <Glow color="green" position="top-right" size="lg" />
      <Glow color="blue" position="bottom-left" size="md" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 text-center lg:text-left">
            <div className="space-y-6">
               <Subheading className="text-ecovolt-green-500">Corporate Demo</Subheading>
               <Heading as="h2" className="text-white text-5xl md:text-7xl">
                 Garanta a energia do seu <span className="text-white/40">próximo sucesso.</span>
               </Heading>
               <Text className="text-slate-400 text-lg md:text-2xl font-medium max-w-xl mx-auto lg:mx-0">
                 Preencha os dados e receba uma análise de viabilidade técnica em menos de 12 horas.
               </Text>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
               <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-ecovolt-green-500">
                     <Mail size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Vendas B2B</p>
                     <p className="text-sm font-bold">solutions@ecovolt.app</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-ecovolt-green-500">
                     <Phone size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Suporte 24/7</p>
                     <p className="text-sm font-bold">+55 (11) 9999-9999</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-widest">
                   <ShieldCheck size={16} className="text-ecovolt-green-500" />
                   Infraestrutura Auditada
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-widest">
                   <Zap size={16} className="text-ecovolt-green-500" />
                   Acordo de Nível de Serviço (SLA) 99.9%
                </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-ecovolt-green-500/10 to-ecovolt-blue-500/10 rounded-[3rem] blur-3xl -z-10" />
            
            <GlassCard variant="dark" className="p-10 md:p-14 border-white/5 bg-slate-900/40 backdrop-blur-2xl">
              <form className="space-y-8" aria-label="EcoVolt Lead Capture">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1" htmlFor="name">Nome Completo</label>
                    <input 
                      id="name"
                      type="text" 
                      placeholder="Ex: Roberto Lima" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-ecovolt-green-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1" htmlFor="email">Email Corporativo</label>
                    <input 
                      id="email"
                      type="email" 
                      placeholder="roberto@agencia.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-ecovolt-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2 text-left">
                     <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1" htmlFor="company">Empresa / Agência</label>
                     <input 
                       id="company"
                       type="text" 
                       placeholder="Sua Empresa Ltda" 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-ecovolt-green-500 transition-colors"
                     />
                   </div>
                   <div className="space-y-2 text-left">
                     <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1" htmlFor="scale">Expectativa de Público</label>
                     <select 
                        id="scale"
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-ecovolt-green-500 transition-colors appearance-none"
                     >
                        <option value="">Selecione o tamanho</option>
                        <option value="small">Até 5.000 pessoas</option>
                        <option value="medium">5.000 a 20.000 pessoas</option>
                        <option value="large">20.000 a 100.000 pessoas</option>
                        <option value="epic">Acima de 100.000 pessoas</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-2 text-left">
                   <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-1" htmlFor="message">Desafios Energéticos Atuais (Opcional)</label>
                   <textarea 
                     id="message"
                     rows={3} 
                     placeholder="Como podemos ajudar sua operação?" 
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-ecovolt-green-500 transition-colors resize-none"
                   />
                </div>

                <Button className="w-full h-16 text-lg tracking-tight group shadow-2xl shadow-ecovolt-green-500/10">
                   Agendar Demonstração Técnica <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
                
                <div className="flex items-center justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-ecovolt-green-500 animate-pulse" />
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                      Consultores técnicos online agora
                   </p>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
