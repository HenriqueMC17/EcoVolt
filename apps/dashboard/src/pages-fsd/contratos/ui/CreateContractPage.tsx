"use client";

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, MockCompany, MockEvent } from '@/shared/lib/convex';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { 
  Zap, 
  ArrowLeft,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

// Mock data mapping to ensure price and capacity match search page
const PROVIDER_METADATA: Record<string, { price: number; capacityKwh: number; name: string; region: string; rating: number }> = {
  "company_ecovolt_provider_001": { 
    price: 0.48, 
    capacityKwh: 5000, 
    name: "Matrix Clean Energy",
    region: "Sudeste",
    rating: 4.9
  },
  "company_ecovolt_provider_default_1": { 
    price: 0.51, 
    capacityKwh: 1200, 
    name: "SolarFarm Sorocaba",
    region: "Sudeste",
    rating: 4.7
  },
  "company_ecovolt_provider_default_2": { 
    price: 0.55, 
    capacityKwh: 800, 
    name: "EnerSol Campinas",
    region: "Sudeste",
    rating: 4.5
  }
};

export const CreateContractPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get('providerId');

  const user = useQuery(api.users.getMe, {});
  const email = user?.email || "admin@ecovolt.com";

  // Fetch events to list in dropdown
  const events = useQuery(
    api.events.getEvents,
    email ? { userEmail: email } : 'skip'
  );

  // Fetch companies to find provider info
  const rawCompanies = useQuery(
    api.companies.getCompanies,
    email ? { userEmail: email, type: "provider" } : 'skip'
  );

  const createContract = useMutation(api.contracts.createContract);

  const [eventId, setEventId] = useState<string>('');
  const [kwh, setKwh] = useState<number>(() => {
    const p = searchParams.get('kwh');
    return p ? Number(p) : 100;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Find provider details
  const provider = useMemo(() => {
    if (!providerId) return null;
    
    // Check custom preset dictionary first
    if (PROVIDER_METADATA[providerId]) {
      return {
        _id: providerId,
        name: PROVIDER_METADATA[providerId].name,
        price: PROVIDER_METADATA[providerId].price,
        capacityKwh: PROVIDER_METADATA[providerId].capacityKwh,
        region: PROVIDER_METADATA[providerId].region,
        rating: PROVIDER_METADATA[providerId].rating
      };
    }

    // Fallback to query list
    if (!rawCompanies) return null;
    const found = rawCompanies.find((c: MockCompany) => c._id === providerId);
    if (!found) return null;

    return {
      _id: found._id,
      name: found.name,
      price: 0.52, // default price
      capacityKwh: 1000,
      region: found.region || "Sudeste",
      rating: found.rating || 4.5
    };
  }, [providerId, rawCompanies]);

  // Compute values
  const calculations = useMemo(() => {
    if (!provider) return { subtotal: 0, fee: 0, total: 0 };
    const subtotal = kwh * provider.price;
    const fee = subtotal * 0.05;
    const total = subtotal + fee;
    return { subtotal, fee, total };
  }, [provider, kwh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!providerId || !eventId || kwh <= 0) {
      setErrorMsg("Selecione um evento e informe uma quantidade de kWh válida.");
      return;
    }

    if (!user) {
      setErrorMsg("Sua sessão não foi carregada. Tente fazer login novamente.");
      return;
    }

    setIsSubmitting(true);
    try {
      const activeEvent = events?.find((e: MockEvent) => e._id === eventId);
      const clientCompanyId = activeEvent?.companyId || user.companyId || "company_ecovolt_client_001";

      await createContract({
        eventId: eventId as Id<"events">,
        providerCompanyId: providerId as Id<"companies">,
        clientCompanyId: clientCompanyId as Id<"companies">,
        value: calculations.total,
        ratePerKwh: provider!.price,
        status: "pending_signatures",
        userEmail: email
      });

      setSuccessMsg("✓ Contrato solicitado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push('/contratos');
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocorreu um erro ao solicitar o contrato.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  if (events === undefined || rawCompanies === undefined || user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <Typography className="text-white/40 font-black tracking-widest uppercase text-[10px]">Carregando parâmetros...</Typography>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-20 text-center border-dashed border-rose-500/20 rounded-3xl space-y-6">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <Typography variant="h3" className="text-xl font-bold text-white">Provedor não encontrado</Typography>
        <Typography className="text-white/40 text-sm max-w-sm">
          A fazenda solar selecionada é inválida ou não está cadastrada em nosso sistema.
        </Typography>
        <Button onClick={() => router.push('/buscar')} className="rounded-xl font-black uppercase text-[10px] tracking-widest">
          Voltar para Busca
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-luxury">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-muted cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <DollarSign size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
              Contratação
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Novo <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">Contrato</span>
          </Typography>
          <Typography className="text-text-muted max-w-2xl text-sm font-medium">
            Confirme os detalhes operacionais e envie a solicitação de suprimento energético para assinatura digital.
          </Typography>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Provider Card Info */}
          <div className="glass-card p-8 border-white/10 rounded-3xl bg-slate-950/20 space-y-6">
            <Typography variant="h3" className="text-xs font-black uppercase tracking-widest text-white/40">Provedora Selecionada</Typography>
            <div className="flex justify-between items-start">
              <div>
                <Typography className="text-xl font-bold text-white tracking-tight">{provider.name}</Typography>
                <Typography className="text-xs text-white/40 font-medium mt-1">{provider.region} · Solar</Typography>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <span>{provider.rating.toFixed(1)}</span>
                <span className="text-[10px]">★</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-wider block">Preço de Tabela</span>
                <span className="text-sm font-bold text-white">R$ {provider.price.toFixed(2)}/kWh</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-wider block">Geração Diária</span>
                <span className="text-sm font-bold text-white">{provider.capacityKwh.toLocaleString()} kWh</span>
              </div>
            </div>
          </div>

          {/* Form details card */}
          <div className="glass-card p-8 border-white/10 rounded-3xl bg-slate-950/20 space-y-6">
            <Typography variant="h3" className="text-xs font-black uppercase tracking-widest text-white/40">Configurações de Demanda</Typography>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Evento Vinculado</label>
              <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <select 
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold appearance-none cursor-pointer text-sm"
                >
                  <option value="">Selecione um evento ativo...</option>
                  {events?.map((ev: MockEvent) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.name} ({ev.estimatedConsumption} kWh)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Energia a Contratar (kWh)</label>
              <div className="relative group">
                <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="number" 
                  value={kwh}
                  onChange={(e) => setKwh(Math.max(1, Number(e.target.value)))}
                  placeholder="Ex: 500"
                  min="1"
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Financial Breakdown */}
        <div className="lg:col-span-5">
          <div className="glass-card border-white/10 rounded-3xl bg-slate-950/30 overflow-hidden flex flex-col justify-between min-h-[400px]">
            
            {/* Dark background simulation summary */}
            <div className="p-8 bg-black/60 space-y-6">
              <Typography variant="h3" className="text-xs font-black uppercase tracking-widest text-white/50">Resumo Financeiro</Typography>
              
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/40">Energia Contratada:</span>
                  <span className="text-white font-variant-numeric: tabular-nums">{kwh.toLocaleString()} kWh</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/40">Preço Base por kWh:</span>
                  <span className="text-white font-variant-numeric: tabular-nums">R$ {provider.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium border-t border-white/5 pt-4">
                  <span className="text-white/40">Subtotal de Energia:</span>
                  <span className="text-white font-variant-numeric: tabular-nums">R$ {calculations.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/40">Taxa de Intermediação (5%):</span>
                  <span className="text-white font-variant-numeric: tabular-nums">R$ {calculations.fee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-end border-t border-primary/20 pt-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Valor Total Previsto</span>
                  <span className="text-3xl font-black text-white tracking-tight font-variant-numeric: tabular-nums">
                    R$ {calculations.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Error or Success notification panel */}
            <div className="p-8 space-y-4">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-start gap-2.5">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-start gap-2.5">
                  <CheckCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting || !!successMsg} 
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processando Contrato...
                  </>
                ) : (
                  <>
                    Solicitar Fornecimento
                    <ChevronRight size={14} />
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
