"use client";

import React from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search,
  Eye,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Typography } from '@/shared/ui/Typography';
import { StatCard } from '@/shared/ui/StatCard';

const mockFinancials = [
  {
    id: 'FIN-5001',
    event: 'Festival de Verão 2026',
    client: 'EcoEvents Ltda',
    amount: 45000,
    type: 'invoice',
    status: 'paid',
    date: '2026-04-20',
  },
  {
    id: 'FIN-5002',
    event: 'ExpoTech 2026',
    client: 'TechConf Inc',
    amount: 12500,
    type: 'invoice',
    status: 'pending',
    date: '2026-05-01',
  },
  {
    id: 'FIN-5003',
    event: 'Grand Slam Final',
    client: 'Arena Multisports',
    amount: 3200,
    type: 'credit', // Credit for energy saving
    status: 'pending',
    date: '2026-05-15',
  }
];

export const FinancialPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="space-y-10 pb-20 animate-luxury">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <DollarSign size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase">
              Financial Clearing
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Gestão <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Financeira</span>
          </Typography>
          <Typography className="text-text-muted max-w-2xl text-sm font-medium">
            Reconciliação de faturas, créditos por economia de energia e fechamento financeiro de todas as operações.
          </Typography>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Receita Prevista"
          value="R$ 145.8k"
          progress={100}
          color="primary"
        />
        <StatCard 
          title="Recebido"
          value="R$ 82.3k"
          progress={56}
          color="secondary"
        />
        <StatCard 
          title="Pendente"
          value="R$ 63.5k"
          progress={43}
          color="neutral"
        />
        <StatCard 
          title="Economia Gerada"
          value="R$ 12.4k"
          progress={100}
          color="primary"
        />
      </div>

      <div className="glass-card border-white/5 overflow-hidden rounded-3xl">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-black/20">
          <Typography variant="h3" className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Transações Recentes</Typography>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filtrar transações..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-14 pr-4 text-white placeholder-text-muted outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">ID / Data</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Operação / Cliente</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Tipo</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Valor</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancials.map((fin) => (
                <tr key={fin.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="space-y-1">
                      <Typography className="text-[10px] font-black text-text-muted uppercase tracking-widest">{fin.id}</Typography>
                      <Typography className="text-xs text-text-muted">{new Date(fin.date).toLocaleDateString('pt-BR')}</Typography>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <Typography className="text-sm font-bold text-white tracking-tight">{fin.event}</Typography>
                      <Typography className="text-xs text-text-muted">{fin.client}</Typography>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                      fin.type === 'invoice' ? 'text-primary' : 'text-secondary'
                    }`}>
                      {fin.type === 'invoice' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      {fin.type === 'invoice' ? 'Faturamento' : 'Crédito'}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <Typography className="text-sm font-black text-white tracking-tighter">R$ {fin.amount.toLocaleString('pt-BR')}</Typography>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      fin.status === 'paid' ? 'text-secondary bg-secondary/5 border-secondary/20' : 'text-amber-400 bg-amber-400/5 border-amber-400/20'
                    }`}>
                      {fin.status === 'paid' ? 'Liquidado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => router.push('/events')}
                        className="p-3 rounded-xl bg-black/40 border border-white/10 text-text-muted hover:text-white transition-all shadow-xl"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-3 rounded-xl bg-black/40 border border-white/10 text-text-muted hover:text-white transition-all shadow-xl">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
