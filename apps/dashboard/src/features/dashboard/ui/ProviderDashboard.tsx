"use client";

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, MockCompany } from '@/shared/lib/convex';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMockAuth } from '@/shared/providers/MockAuthProvider';
import { 
  Zap, 
  FileText, 
  Check, 
  X, 
  Star, 
  MapPin, 
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { SmartKPI } from '@/shared/ui/SmartKPI';

interface Contract {
  _id: string;
  eventId: string;
  providerCompanyId: string;
  clientCompanyId: string;
  value: number;
  ratePerKwh?: number;
  status: string;
  createdAt: number;
  event: string;
  provider: string;
  energy: string;
}

export const ProviderDashboard: React.FC = () => {
  const { user } = useMockAuth();
  const email = user?.primaryEmailAddress?.emailAddress || "matrix@cleanenergy.com";

  // Fetch all contracts related to this provider
  const contracts = useQuery(
    api.contracts.getContracts,
    email ? { userEmail: email } : 'skip'
  );

  // Fetch companies to get provider's own details
  const companies = useQuery(
    api.companies.getCompanies,
    email ? { userEmail: email, type: "provider" } : 'skip'
  );

  const updateContractStatus = useMutation(api.contracts.updateContractStatus);

  const [actioningId, setActioningId] = useState<string | null>(null);

  // Extract provider's own company details
  const myCompany = useMemo(() => {
    if (!companies || !user) return null;
    const providerCompId = user.role === "provider" ? "company_ecovolt_provider_001" : "";
    return (companies as MockCompany[]).find((c: MockCompany) => c._id === providerCompId) || companies[0] || null;
  }, [companies, user]);

  const stats = useMemo(() => {
    if (!contracts) return { pending: [], active: [], totalRevenue: 0 };
    
    const typedContracts = contracts as Contract[];
    // In Convex, status can be draft, pending_signatures, active, completed, terminated
    const pending = typedContracts.filter((c: Contract) => c.status === 'pending_signatures' || c.status === 'draft');
    const active = typedContracts.filter((c: Contract) => c.status === 'active' || c.status === 'completed');
    const totalRevenue = active.reduce((sum: number, c: Contract) => sum + c.value, 0);
    
    return { pending, active, totalRevenue };
  }, [contracts]);

  const handleResponse = async (contractId: string, accept: boolean) => {
    setActioningId(contractId);
    try {
      const nextStatus = accept ? "active" : "terminated";
      await updateContractStatus({
        contractId: contractId as Id<"contracts">,
        status: nextStatus,
        userEmail: email
      });
    } catch (err) {
      console.error("Failed to update contract status", err);
      alert("Erro ao responder contrato.");
    } finally {
      setActioningId(null);
    }
  };

  const renderStars = (rating?: number) => {
    const r = Math.round(rating || 5);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  };

  if (contracts === undefined || companies === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <Typography className="text-white/40 font-black tracking-widest uppercase text-[10px]">Carregando painel da provedora...</Typography>
      </div>
    );
  }

  const capacityText = myCompany?.capacity || "150 MWh/mês";
  const ratingValue = myCompany?.rating || 4.9;

  return (
    <div className="space-y-8 animate-luxury">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            {myCompany?.name || "Painel da Provedora"}
          </h2>
          <p className="text-text-muted text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Fazenda Solar · Disponível para Cotação
          </p>
        </div>
      </header>

      {/* Metrics grid using Tailored HSL Colors */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SmartKPI 
          title="Capacidade Geração"
          value={capacityText}
          trend={{ value: 0, direction: 'up', label: 'Estável' }}
          aiInsight="Sua fazenda solar está operando em capacidade nominal perfeita sem alertas harmônicos."
          color="primary"
        />
        <SmartKPI 
          title="Contratos Vigentes"
          value={String(stats.active.length)}
          trend={{ value: stats.active.length > 0 ? 10 : 0, direction: 'up', label: 'vs mês anterior' }}
          aiInsight="Todos os contratos vigentes estão cobertos por lastro de energia solar distribuída."
          color="secondary"
        />
        <SmartKPI 
          title="Demandas Pendentes"
          value={String(stats.pending.length)}
          trend={{ value: 0, direction: 'up', label: 'Estável' }}
          aiInsight={stats.pending.length > 0 ? "Você possui solicitações aguardando sua resposta comercial." : "Nenhuma solicitação pendente no momento."}
          color="neutral"
        />
        <SmartKPI 
          title="Faturamento Acumulado"
          value={`R$ ${stats.totalRevenue.toLocaleString()}`}
          trend={{ value: 14.8, direction: 'up', label: 'vs último trimestre' }}
          aiInsight="Projeção aponta crescimento com base no aumento das solicitações do mercado de entretenimento."
          color="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Requests Column (Col-Span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 border-white/5 bg-slate-950/20 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Typography variant="h3" className="text-sm font-black uppercase tracking-[0.25em] text-white/50">Solicitações Pendentes</Typography>
                <Typography className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-1">Aceite solicitações para formalizar contratos</Typography>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400">
                {stats.pending.length} Pendentes
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {stats.pending.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center">
                    <FileText className="w-10 h-10 text-white/20 mb-4" />
                    <Typography className="text-text-muted text-xs uppercase tracking-widest font-bold">Nenhuma solicitação pendente</Typography>
                  </div>
                ) : (
                  stats.pending.map((c: Contract) => (
                    <motion.div
                      key={c._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 bg-slate-900/60 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <div className="space-y-2">
                        <Typography className="text-lg font-bold text-white tracking-tight">{c.event}</Typography>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                          <span className="flex items-center gap-1.5"><Zap size={12} className="text-primary" /> {c.energy}</span>
                          <span className="flex items-center gap-1.5"><DollarSign size={12} /> R$ {c.value.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => handleResponse(c._id, true)}
                          disabled={actioningId !== null}
                          className="flex-1 md:flex-initial h-10 px-5 rounded-xl bg-primary text-black hover:bg-primary/95 transition-all text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {actioningId === c._id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          Aceitar
                        </button>
                        <button
                          onClick={() => handleResponse(c._id, false)}
                          disabled={actioningId !== null}
                          className="flex-1 md:flex-initial h-10 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rose-500/20 text-white/60 hover:text-rose-400 transition-all text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <X size={14} />
                          Recusar
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Farm description Column (Col-Span-1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 border-white/5 bg-slate-950/20 rounded-3xl space-y-6">
            <Typography variant="h3" className="text-xs font-black uppercase tracking-[0.25em] text-white/50">Ativo Solar</Typography>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Zap size={24} />
                </div>
                <div>
                  <Typography className="text-base font-bold text-white tracking-tight">Geração Habilitada</Typography>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-0.5">
                    <Star size={12} className="fill-amber-400" />
                    <span>{ratingValue.toFixed(1)}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/40 text-[9px] uppercase tracking-wider">{renderStars(ratingValue)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-white/40 flex items-center gap-1"><MapPin size={12} /> Localização:</span>
                  <span className="text-white">{myCompany?.region || "Região Sudeste"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 flex items-center gap-1"><Calendar size={12} /> Cadastro:</span>
                  <span className="text-white">Junho, 2024</span>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed font-medium pt-2">
                {myCompany?.cnpj ? `CNPJ: ${myCompany.cnpj}` : ""}
                <br />
                {getDescription(myCompany?._id || "")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Contracts Table */}
      <div className="glass-card p-8 border-white/5 bg-slate-950/20 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Typography variant="h3" className="text-sm font-black uppercase tracking-[0.25em] text-white/50">Contratos em Operação</Typography>
            <Typography className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-1">Lista consolidada de acordos vigentes</Typography>
          </div>
        </div>

        <div className="overflow-x-auto">
          {stats.active.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center">
              <FileText className="w-10 h-10 text-white/20 mb-4" />
              <Typography className="text-text-muted text-xs uppercase tracking-widest font-bold">Nenhum contrato ativo</Typography>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30">
                  <th className="py-4 px-4">Evento / Cliente</th>
                  <th className="py-4 px-4">Energia Prevista</th>
                  <th className="py-4 px-4">Tarifa Base</th>
                  <th className="py-4 px-4">Valor Total</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Data Acordo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium text-white/80">
                {stats.active.map((c: Contract) => (
                  <tr key={c._id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-white block">{c.event}</span>
                      <span className="text-[10px] text-white/40">{c.provider}</span>
                    </td>
                    <td className="py-4 px-4 font-variant-numeric: tabular-nums">{c.energy}</td>
                    <td className="py-4 px-4 font-variant-numeric: tabular-nums">R$ {c.ratePerKwh?.toFixed(2) || '0.48'}</td>
                    <td className="py-4 px-4 text-primary font-bold font-variant-numeric: tabular-nums">R$ {c.value.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        c.status === 'completed'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : 'border-primary/20 bg-primary/10 text-primary'
                      }`}>
                        {c.status === 'completed' ? 'Concluído' : 'Ativo'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/40">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple helper to load provider desc matching the local map
function getDescription(id: string) {
  const descMap: Record<string, string> = {
    "company_ecovolt_provider_001": "Fazenda solar com 10 anos de experiência e alta estabilidade de rede.",
    "company_ecovolt_provider_default_1": "Geração focada em eventos de médio porte na região sudeste.",
    "company_ecovolt_provider_default_2": "Energia limpa com compensação simplificada para pequenas demandas."
  };
  return descMap[id] || "Fornecedor homologado de energia limpa EcoVolt.";
}
