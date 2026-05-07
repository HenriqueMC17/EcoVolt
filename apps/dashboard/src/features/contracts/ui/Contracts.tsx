'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Download, 
  Eye, 
  History, 
  Filter,
  Search,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

const mockContracts = [
  {
    id: 'CTR-2026-001',
    title: 'Fornecimento Festival VerÃ£o',
    provider: 'GeraÃ§Ã£o Verde S.A.',
    client: 'EcoEvents Ltda',
    event: 'Festival de VerÃ£o 2026',
    value: 45000,
    status: 'active',
    date: '2026-04-15',
    expiry: '2026-05-30',
  },
  {
    id: 'CTR-2026-002',
    title: 'Backup Emergencial ExpoTech',
    provider: 'PowerRental Brasil',
    client: 'TechConf Inc',
    event: 'ExpoTech 2026',
    value: 12500,
    status: 'pending',
    date: '2026-05-10',
    expiry: '2026-05-15',
  },
  {
    id: 'CTR-2026-003',
    title: 'OperaÃ§Ã£o HÃ­brida Stadium',
    provider: 'SolarGrid Solutions',
    client: 'Arena Multisports',
    event: 'Grand Slam Final',
    value: 89000,
    status: 'draft',
    date: '2026-06-20',
    expiry: '2026-07-10',
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return { label: 'Ativo / Vigente', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    case 'pending': return { label: 'Aguardando Assinatura', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    case 'draft': return { label: 'Rascunho', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
    default: return { label: status, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
  }
};

export const Contracts: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase">
              Legal Compliance
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
            GestÃ£o de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Contratos</span>
          </Typography>
          <Typography className="text-slate-400 max-w-2xl">
            Centralize o controle jurÃ­dico de propostas, SLAs e termos de responsabilidade tÃ©cnica de todas as operaÃ§Ãµes.
          </Typography>
        </div>
        
        <Button className="btn-premium-primary h-14 px-10 rounded-2xl">
          <FileText className="mr-2" size={20} />
          Nova Minuta
        </Button>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-5 items-center bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-3 rounded-[2.5rem]">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por ID, fornecedor ou evento..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="h-14 px-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-3 hover:text-white transition-all">
             <Filter size={18} />
             Filtros AvanÃ§ados
           </button>
        </div>
      </div>

      {/* Contracts Table/Grid */}
      <div className="grid grid-cols-1 gap-6">
        {mockContracts.map((contract, idx) => {
          const status = getStatusBadge(contract.status);
          return (
            <motion.div 
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card group p-8 border-slate-800/50 hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="flex flex-col xl:flex-row justify-between gap-10">
                <div className="flex gap-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500">
                    <FileText size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Typography className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">{contract.id}</Typography>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.border} ${status.bg} ${status.color}`}>
                        {status.label}
                      </div>
                    </div>
                    <Typography variant="h3" className="text-2xl font-bold text-white group-hover:text-emerald-50 transition-colors">
                      {contract.title}
                    </Typography>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <UserCheck size={14} />
                        <span className="text-xs font-medium">Fornecedor: <span className="text-slate-300">{contract.provider}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <History size={14} />
                        <span className="text-xs font-medium">VigÃªncia atÃ©: <span className="text-slate-300">{new Date(contract.expiry).toLocaleDateString('pt-BR')}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 xl:min-w-[400px]">
                  <div className="flex-1 text-right md:text-left xl:text-right">
                    <Typography className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Valor do Contrato</Typography>
                    <Typography className="text-2xl font-bold text-white">R$ {contract.value.toLocaleString('pt-BR')}</Typography>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all">
                      <Eye size={20} />
                    </button>
                    <button className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all">
                      <Download size={20} />
                    </button>
                    <Button 
                      onClick={() => router.push('/events')}
                      className="h-14 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      Ver Dossier
                      <ArrowUpRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
