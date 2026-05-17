"use client";

import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { Glow } from "@/shared/ui/Glow";
import { GlassCard } from "@/shared/ui/GlassCard";
import { m as motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Phone, ShieldCheck, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

const contactSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Endereço de e-mail corporativo inválido"),
  company: z.string().min(2, "Informe o nome da sua empresa"),
  scale: z.string().min(1, "Selecione a escala do seu público"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Form Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <Section id="contato" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative">
      <Glow color="green" position="top-right" size="lg" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 text-center lg:text-left">
            <div className="space-y-6">
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
               >
                 <Subheading className="text-emerald-500 font-black tracking-[0.2em] mb-4 uppercase">DEMONSTRAÇÃO CORPORATIVA</Subheading>
                 <Heading as="h2" className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                   Energia para a <span className="text-slate-500">próxima escala.</span>
                 </Heading>
               </motion.div>
               <Paragraph className="text-slate-400 text-lg md:text-2xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                 Preencha os dados e receba uma análise de viabilidade técnica personalizada para sua infraestrutura.
               </Paragraph>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
               <div className="flex items-center gap-4 text-white group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                     <Mail size={22} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Enterprise Sales</p>
                     <p className="text-lg font-bold">solutions@ecovolt.app</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-white group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                     <Phone size={22} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Suporte 24/7</p>
                     <p className="text-lg font-bold">+55 (11) 9999-9999</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                   <ShieldCheck size={16} className="text-emerald-500" />
                   Infraestrutura Auditada ISO 50001
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                   <Zap size={16} className="text-emerald-500" />
                   SLA de Disponibilidade 99.99%
                </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-[100px] -z-10" />
            
            <GlassCard variant="dark" className="p-8 md:p-14 border-white/10 bg-slate-900/60 backdrop-blur-3xl overflow-hidden relative">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 size={48} />
                    </div>
                    <Heading as="h3" className="text-3xl text-white font-black tracking-tight">Solicitação Enviada!</Heading>
                    <Paragraph className="text-slate-400 font-medium">Nossa equipe técnica entrará em contato em breve.</Paragraph>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)} 
                    className="space-y-8" 
                    aria-label="Lead Capture Form"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input 
                        label="Nome Completo"
                        placeholder="Ex: Roberto Lima"
                        {...register("name")}
                        error={errors.name?.message}
                      />
                      <Input 
                        label="Email Corporativo"
                        type="email"
                        placeholder="roberto@agencia.com"
                        {...register("email")}
                        error={errors.email?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <Input 
                        label="Empresa / Agência"
                        placeholder="Sua Empresa Ltda"
                        {...register("company")}
                        error={errors.company?.message}
                       />
                       <Select 
                        label="Expectativa de Público"
                        {...register("scale")}
                        error={errors.scale?.message}
                       >
                          <option value="">Selecione o tamanho</option>
                          <option value="small">Até 5.000 pessoas</option>
                          <option value="medium">5.000 a 20.000 pessoas</option>
                          <option value="large">20.000 a 100.000 pessoas</option>
                          <option value="epic">Acima de 100.000 pessoas</option>
                       </Select>
                    </div>

                    <Textarea 
                      label="Desafios Energéticos Atuais (Opcional)"
                      placeholder="Como podemos ajudar sua operação hoje?"
                      {...register("message")}
                      error={errors.message?.message}
                    />

                    <Button 
                      disabled={isSubmitting}
                      className="w-full h-16 text-xl font-black uppercase tracking-widest group shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-emerald-600 hover:bg-emerald-500 relative overflow-hidden"
                    >
                       <span className={cn("inline-flex items-center", isSubmitting && "opacity-0")}>
                         Solicitar Análise Técnica <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </span>
                       {isSubmitting && (
                         <div className="absolute inset-0 flex items-center justify-center">
                           <Loader2 className="animate-spin text-white" size={24} />
                         </div>
                       )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
                          Sistemas de análise consultiva ativos agora
                       </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
