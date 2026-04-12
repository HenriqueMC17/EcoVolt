"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";
import { Button } from "@/shared/ui/Button";
import { leadSchema, LeadFormValues } from "../schema";
import { submitLeadAction } from "../actions/submit-lead";

export function LeadSubmissionForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = (data: LeadFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await submitLeadAction(data);
      
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.success) {
        setSuccessMessage(result.success);
        reset();
      }
    });
  };

  if (successMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="text-emerald-500 w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h3>
        <p className="text-slate-400 max-w-xs mx-auto">
          {successMessage}
        </p>
        <Button 
          variant="outline" 
          className="mt-8" 
          onClick={() => setSuccessMessage(null)}
        >
          Enviar Outra Solicitação
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input 
          id="name" 
          label="Nome Completo" 
          placeholder="Ex: Maria Silva" 
          disabled={isPending}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input 
          id="company" 
          label="Empresa" 
          placeholder="Ex: EventCorp LTDA" 
          disabled={isPending}
          error={errors.company?.message}
          {...register("company")}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input 
          id="email" 
          type="email" 
          label="Email Corporativo" 
          placeholder="m.silva@empresa.com" 
          disabled={isPending}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input 
          id="phone" 
          type="tel" 
          label="Telefone / WhatsApp" 
          placeholder="(00) 00000-0000" 
          disabled={isPending}
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input 
          id="role" 
          label="Seu Cargo" 
          placeholder="Ex: CTO, Diretor" 
          disabled={isPending}
          error={errors.role?.message}
          {...register("role")}
        />
        <Select 
          id="segment" 
          label="Segmento de Atuação" 
          disabled={isPending}
          error={errors.segment?.message}
          defaultValue=""
          {...register("segment")}
        >
          <option value="" disabled className="bg-slate-900 text-slate-500">Selecione um segmento</option>
          <option value="festivais" className="bg-slate-900 text-white">Festivais de Música</option>
          <option value="corporativo" className="bg-slate-900 text-white">Eventos Corporativos</option>
          <option value="esportes" className="bg-slate-900 text-white">Eventos Esportivos</option>
          <option value="fornecedor" className="bg-slate-900 text-white">Fornecedor de Energia</option>
          <option value="outro" className="bg-slate-900 text-white">Outro</option>
        </Select>
      </div>

      <Textarea 
        id="message" 
        label="Mensagem Opcional" 
        placeholder="Quais seus maiores desafios com energia para eventos atualmente?"
        disabled={isPending}
        error={errors.message?.message}
        rows={4} 
        {...register("message")}
      />

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {errorMessage}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full group mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            <span>Solicitar Contato</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
      
      <p className="text-center text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-4">
        Seus dados estão protegidos conosco.
      </p>
    </form>
  );
}
