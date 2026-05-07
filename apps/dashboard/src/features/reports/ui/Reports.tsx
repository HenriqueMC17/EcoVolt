"use client";
import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Leaf, 
  Zap, 
  Users,
  Clock,
  Filter,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/Button';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BarChart3 size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-purple-500 uppercase">
              Business Intelligence
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
            Relatórios & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Indicadores</span>
          </Typography>
          <Typography className="text-slate-400 max-w-2xl">
            Análise profunda de performance operacional, impacto ambiental e eficiência financeira do ecossistema.
          </Typography>
        </div>
        
        <div className="flex gap-4">
           <button className="h-14 px-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-3 hover:text-white transition-all">
             <Calendar size={18} />
             Este Mês
           </button>
           <Button className="btn-premium-primary h-14 px-10 rounded-2xl">
             <Download className="mr-2" size={20} />
             Exportar BI
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sustainability Impact */}
        <div className="glass-card p-10 border-slate-800/50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Leaf size={24} />
              </div>
              <div>
                <Typography variant="h3" className="text-xl font-bold text-white tracking-tight">Impacto Ambiental</Typography>
                <Typography className="text-slate-500 text-xs">Emissões de CO2 e energia renovável</Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-950/50 border border-slate-800/50 space-y-2">
              <Typography className="text-slate-500 text-[10px] font-black uppercase tracking-widest">CO2 Evitado</Typography>
              <Typography className="text-3xl font-bold text-emerald-400">14.2 t</Typography>
            </div>
            <div className="p-6 rounded-3xl bg-slate-950/50 border border-slate-800/50 space-y-2">
              <Typography className="text-slate-500 text-[10px] font-black uppercase tracking-widest">% Renovável</Typography>
              <Typography className="text-3xl font-bold text-blue-400">78%</Typography>
            </div>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-[78%]" />
          </div>
          <Typography className="text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Meta de Sustentabilidade: 85%</Typography>
        </div>

        {/* Operational Efficiency */}
        <div className="glass-card p-10 border-slate-800/50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <TrendingUp size={24} />
              </div>
              <div>
                <Typography variant="h3" className="text-xl font-bold text-white tracking-tight">Eficiência Operacional</Typography>
                <Typography className="text-slate-500 text-xs">Custo por participante e otimização</Typography>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-6 rounded-3xl bg-slate-950/50 border border-slate-800/50">
               <div className="flex items-center gap-4">
                 <Users size={20} className="text-slate-500" />
                 <Typography className="text-slate-300 font-medium">Custo / Pax</Typography>
               </div>
               <Typography className="text-white font-bold">R$ 0.42</Typography>
            </div>
            <div className="flex justify-between items-center p-6 rounded-3xl bg-slate-950/50 border border-slate-800/50">
               <div className="flex items-center gap-4">
                 <Zap size={20} className="text-slate-500" />
                 <Typography className="text-slate-300 font-medium">kWh / Pax</Typography>
               </div>
               <Typography className="text-white font-bold">0.85 kWh</Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 border-slate-800/50">
        <div className="flex items-center gap-4 mb-10">
          <PieChart size={24} className="text-purple-400" />
          <Typography variant="h3" className="text-xl font-bold text-white tracking-tight">Distribuição de Carga por Categoria</Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'Climatização', value: 45, color: 'bg-blue-500' },
             { label: 'Iluminação', value: 25, color: 'bg-amber-500' },
             { label: 'Som & LED', value: 20, color: 'bg-purple-500' },
             { label: 'Outros', value: 10, color: 'bg-slate-700' },
           ].map(item => (
             <div key={item.label} className="space-y-3">
               <div className="flex justify-between items-end">
                 <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</Typography>
                 <Typography className="text-lg font-bold text-white">{item.value}%</Typography>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${item.value}%` }}
                   className={`h-full ${item.color}`} 
                 />
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

