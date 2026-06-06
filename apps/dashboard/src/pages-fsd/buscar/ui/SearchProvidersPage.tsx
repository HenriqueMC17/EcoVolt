"use client";

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, MockCompany } from '@/shared/lib/convex';
import { api } from '@convex/_generated/api';
import { 
  Search, 
  Zap, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  ArrowRight,
  Sparkles,
  Loader2,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

// Mock pricing/capacity mappings to simulate dados.js business rules
const PROVIDER_METADATA: Record<string, { price: number; capacityKwh: number; desc: string }> = {
  "company_ecovolt_provider_001": { 
    price: 0.48, 
    capacityKwh: 5000, 
    desc: "Fazenda solar com 10 anos de experiência e alta estabilidade de rede." 
  },
  "company_ecovolt_provider_default_1": { 
    price: 0.51, 
    capacityKwh: 1200, 
    desc: "Geração focada em eventos de médio porte na região sudeste." 
  },
  "company_ecovolt_provider_default_2": { 
    price: 0.55, 
    capacityKwh: 800, 
    desc: "Energia limpa com compensação simplificada para pequenas demandas." 
  }
};

const getPrice = (id: string) => PROVIDER_METADATA[id]?.price || 0.52;
const getCapacity = (id: string, capacityStr?: string) => {
  if (PROVIDER_METADATA[id]) return PROVIDER_METADATA[id].capacityKwh;
  if (!capacityStr) return 1000;
  const num = parseFloat(capacityStr);
  if (capacityStr.includes("MWh")) return Math.round((num * 1000) / 30);
  return num;
};
const getDescription = (id: string) => PROVIDER_METADATA[id]?.desc || "Fornecedor homologado de energia limpa EcoVolt.";

export const SearchProvidersPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKwh = searchParams.get('kwh') || '';

  const user = { email: "admin@ecovolt.com" }; // Mock session email
  const [kwh, setKwh] = useState<string>(initialKwh);
  const [sortBy, setSortBy] = useState<'preco' | 'capacidade' | 'avaliacao'>('preco');
  const [isSearched, setIsSearched] = useState<boolean>(initialKwh !== '');

  // Fetch companies of type "provider"
  const rawProviders = useQuery(
    api.companies.getCompanies,
    user?.email ? { userEmail: user.email, type: "provider" } : "skip"
  );

  // Map and enrich raw provider data with mock business details
  const providers = useMemo(() => {
    if (!rawProviders) return [];
    
    // Add extra providers if the list is too short to show rich matching choices
    const list = [...(rawProviders as MockCompany[])];
    if (list.length === 1 && list[0]._id === "company_ecovolt_provider_001") {
      list.push(
        {
          _id: "company_ecovolt_provider_default_1",
          name: "SolarFarm Sorocaba",
          type: "provider",
          status: "active",
          region: "Sudeste",
          capacity: "1.2 MWh/mês",
          rating: 4.7,
          createdAt: 1716768000000
        },
        {
          _id: "company_ecovolt_provider_default_2",
          name: "EnerSol Campinas",
          type: "provider",
          status: "active",
          region: "Sudeste",
          capacity: "0.8 MWh/mês",
          rating: 4.5,
          createdAt: 1716768000000
        }
      );
    }

    return list.map(p => ({
      ...p,
      price: getPrice(p._id),
      capacityKwh: getCapacity(p._id, p.capacity),
      description: getDescription(p._id)
    }));
  }, [rawProviders]);

  const filteredAndSortedProviders = useMemo(() => {
    if (!kwh || isNaN(Number(kwh))) return [];
    
    const requiredKwh = Number(kwh);
    // Filter out providers that can't meet the daily/event demand
    const eligible = providers.filter(p => p.capacityKwh >= requiredKwh);

    // Sort by criteria
    if (sortBy === 'capacidade') {
      return eligible.sort((a, b) => b.capacityKwh - a.capacityKwh);
    }
    if (sortBy === 'avaliacao') {
      return eligible.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return eligible.sort((a, b) => a.price - b.price); // default: lowest price
  }, [providers, kwh, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (kwh && Number(kwh) > 0) {
      setIsSearched(true);
    }
  };

  const handleSelectProvider = (providerId: string) => {
    router.push(`/contrato?providerId=${providerId}&kwh=${kwh}`);
  };

  const renderStars = (rating?: number) => {
    const r = Math.round(rating || 5);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  };

  return (
    <div className="space-y-10 pb-20 animate-luxury">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Search size={18} />
          </div>
          <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
            Marketplace
          </Typography>
        </div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Buscar <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-400">Provedoras</span>
        </Typography>
        <Typography className="text-text-muted max-w-2xl text-sm font-medium">
          Conecte-se com usinas solares e fazendas eólicas certificadas para suprir a demanda técnica de sua infraestrutura.
        </Typography>
      </header>

      {/* Filter and Search controls */}
      <div className="glass-card bg-black/40 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-3 w-full">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Demanda Energética Necessária (kWh)</label>
            <div className="relative group">
              <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="number" 
                value={kwh}
                onChange={(e) => {
                  setKwh(e.target.value);
                  setIsSearched(false);
                }}
                placeholder="Ex: 420"
                min="1"
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold"
              />
            </div>
          </div>

          <div className="w-full md:w-64 space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Ordenar por</label>
            <div className="relative group">
              <SlidersHorizontal className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'preco' | 'capacidade' | 'avaliacao')}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold appearance-none cursor-pointer text-sm"
              >
                <option value="preco">Menor Preço / kWh</option>
                <option value="capacidade">Maior Capacidade</option>
                <option value="avaliacao">Melhor Avaliação</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] w-full md:w-auto">
            Buscar
          </Button>
        </form>
      </div>

      {/* Results Section */}
      <div className="relative min-h-[300px]">
        {rawProviders === undefined ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <Typography className="text-white/40 font-black tracking-widest uppercase text-[10px]">Sincronizando usinas solares...</Typography>
          </div>
        ) : !isSearched ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center border-dashed border-white/10 rounded-3xl">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white/30" />
            </div>
            <Typography variant="h3" className="text-xl font-bold text-white mb-2">Informe a demanda</Typography>
            <Typography className="text-white/40 text-sm max-w-sm">
              Insira a quantidade de kWh de consumo estimado para o seu evento e clique em buscar para encontrar os melhores matches.
            </Typography>
          </div>
        ) : filteredAndSortedProviders.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center border-dashed border-white/10 rounded-3xl">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <Typography variant="h3" className="text-xl font-bold text-white mb-2">Nenhuma Provedora Disponível</Typography>
            <Typography className="text-white/40 text-sm max-w-md">
              Não encontramos fazendas solares que consigam atender {kwh} kWh/dia de forma integrada. Tente diminuir a demanda de simulação.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredAndSortedProviders.map((p, idx) => {
                const isBestMatch = idx === 0;
                return (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`glass-card group relative p-8 border hover:border-primary/40 transition-all duration-500 flex flex-col justify-between overflow-hidden ${
                      isBestMatch ? 'border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-white/10'
                    }`}
                  >
                    {isBestMatch && (
                      <div className="absolute top-0 right-0 bg-primary text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1.5">
                        <Sparkles size={10} />
                        Melhor Match
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <Typography className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-1">
                          <MapPin size={10} className="text-primary" />
                          {p.region} · Solar
                        </Typography>
                        <Typography variant="h3" className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                          {p.name}
                        </Typography>
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs pt-1">
                          <Star size={14} className="fill-amber-400" />
                          <span>{p.rating?.toFixed(1) || '4.5'}</span>
                          <span className="text-white/20">|</span>
                          <span className="text-white/40 text-[10px] uppercase font-black tracking-widest">{renderStars(p.rating)}</span>
                        </div>
                      </div>

                      <p className="text-white/50 text-xs leading-relaxed font-medium">
                        {p.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div>
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-wider block">Capacidade</span>
                          <span className="text-sm font-bold text-white tracking-tight">{p.capacityKwh.toLocaleString()} kWh/dia</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-wider block">Tarifa</span>
                          <span className="text-sm font-bold text-primary tracking-tight">R$ {p.price.toFixed(2)}/kWh</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        onClick={() => handleSelectProvider(p._id)}
                        className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
                          isBestMatch 
                            ? 'bg-primary text-black' 
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        <FileCheck size={14} />
                        Solicitar Contrato
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
