"use client";
import React from 'react';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileSearch,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

const mockProposals = [
  {
    id: 'PROP-102',
    event: 'Festival de VerÃ£o 2026',
    provider: 'GeraÃ§Ã£o Verde S.A.',
    value: 45000,
    status: 'accepted',
    date: '2026-04-10',
  },
  {
    id: 'PROP-105',
    event: 'ExpoTech 2026',
    provider: 'PowerRental Brasil',
    value: 12500,
    status: 'pending',
    date: '2026-04-12',
  },
  {
    id: 'PROP-108',
    event: 'Festival de VerÃ£o 2026',
    provider: 'SolarGrid Solutions',
    value: 48000,
    status: 'rejected',
    date: '2026-04-11',
  }
];

export const Proposals: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Send size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase">
              Negotiation Flow
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
            GestÃ£o de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Propostas</span>
          </Typography>
          <Typography className="text-slate-400 max-w-2xl">
            Acompanhe o status das negociaÃ§Ãµes comerciais entre empresas de eventos e provedores de energia.
          </Typography>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-slate-800/50 flex items-center justify-between">
          <div>
            <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pendentes</Typography>
            <Typography className="text-3xl font-bold text-white">04</Typography>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock size={24} />
          </div>
        </div>
        <div className="glass-card p-6 border-slate-800/50 flex items-center justify-between">
          <div>
            <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aceitas</Typography>
            <Typography className="text-3xl font-bold text-white">12</Typography>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="glass-card p-6 border-slate-800/50 flex items-center justify-between">
          <div>
            <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-500">Volume Total</Typography>
            <Typography className="text-3xl font-bold text-white">R$ 240k</Typography>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      <div className="glass-card border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/30">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">ID</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Evento</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Fornecedor</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Valor</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">AÃ§Ã£o</th>
              </tr>
            </thead>
            <tbody>
              {mockProposals.map((prop, idx) => (
                <tr key={prop.id} className="border-b border-slate-800/30 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{prop.id}</td>
                  <td className="p-6 text-sm font-bold text-white">{prop.event}</td>
                  <td className="p-6 text-sm font-medium text-slate-400">{prop.provider}</td>
                  <td className="p-6 text-sm font-bold text-white">R$ {prop.value.toLocaleString('pt-BR')}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      prop.status === 'accepted' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' :
                      prop.status === 'pending' ? 'text-amber-400 bg-amber-400/5 border-amber-400/20' :
                      'text-rose-400 bg-rose-400/5 border-rose-400/20'
                    }`}>
                      {prop.status === 'accepted' ? 'Aceita' : prop.status === 'pending' ? 'Pendente' : 'Recusada'}
                    </span>
                  </td>
                  <td className="p-6">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">
                      Detalhes
                      <ArrowRight size={14} />
                    </button>
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

