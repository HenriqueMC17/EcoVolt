import React, { useState } from 'react';
import { 
  Zap, 
  Sun, 
  Wind, 
  Droplets, 
  Truck, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Search, 
  Filter,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

const mockProviders = [
  {
    id: 1,
    name: 'Geração Verde S.A.',
    type: 'Renovável',
    specialties: ['Solar', 'Baterias'],
    rating: 4.9,
    location: 'São Paulo, SP',
    capacity: '10 MW',
    icon: Sun,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 2,
    name: 'PowerRental Brasil',
    type: 'Logística / Diesel',
    specialties: ['Geradores a Diesel', 'Híbridos'],
    rating: 4.7,
    location: 'Rio de Janeiro, RJ',
    capacity: '5 MW',
    icon: Truck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    id: 3,
    name: 'SolarGrid Solutions',
    type: 'Renovável',
    specialties: ['Solar', 'Eólica'],
    rating: 4.8,
    location: 'Belo Horizonte, MG',
    capacity: '8 MW',
    icon: Wind,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    id: 4,
    name: 'BlueEnergy Infra',
    type: 'Hídrica / Redes',
    specialties: ['Subestações', 'Cabeamento'],
    rating: 4.6,
    location: 'Curitiba, PR',
    capacity: '15 MW',
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  }
];

export const Providers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Zap size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
              Marketplace
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
            Ecossistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Provedores</span>
          </Typography>
          <Typography className="text-slate-400 max-w-2xl">
            Conecte seu evento aos melhores fornecedores de energia do Brasil. Filtre por tecnologia, capacidade e reputação técnica.
          </Typography>
        </div>
      </header>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-5 items-center bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-3 rounded-[2.5rem]">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nome, especialidade ou região..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="h-14 px-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-3 hover:text-white transition-all">
             <Filter size={18} />
             Tecnologia
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {mockProviders.map((provider, idx) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card group p-8 border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className={`w-16 h-16 rounded-2xl ${provider.bg} flex items-center justify-center ${provider.color} border border-white/5`}>
                  <provider.icon size={32} />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800/50">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-white">{provider.rating}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Typography variant="h3" className="text-2xl font-bold text-white group-hover:text-blue-50 transition-colors">
                  {provider.name}
                </Typography>
                <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-500">{provider.type}</Typography>
              </div>

              <div className="flex flex-wrap gap-2">
                {provider.specialties.map(spec => (
                  <span key={spec} className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="pt-4 space-y-3 border-t border-slate-800/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} />
                    <span>Sede</span>
                  </div>
                  <span className="text-slate-200 font-medium">{provider.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck size={14} />
                    <span>Capacidade</span>
                  </div>
                  <span className="text-slate-200 font-medium">{provider.capacity}</span>
                </div>
              </div>
            </div>

            <Button className="w-full mt-8 h-14 bg-slate-900 border border-slate-800 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all font-black uppercase tracking-[0.2em] text-[10px] group/btn">
              Solicitar Proposta
              <ChevronRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
