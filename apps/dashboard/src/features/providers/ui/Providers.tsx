import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Star, 
  Zap, 
  Search, 
  Filter,
  MessageSquare,
  FileText,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Globe,
  Activity,
  Award,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from "@/../convex/_generated/api";
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

// --- Types & Constants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    variants={itemVariants}
    className="glass-card relative overflow-hidden group"
  >
    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`} />
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-all duration-300">
          <Icon size={20} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <Activity size={10} />
            {trend}
          </div>
        )}
      </div>
      <Typography className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-1">
        {title}
      </Typography>
      <Typography className="text-2xl font-bold text-white tracking-tight">
        {value}
      </Typography>
    </div>
  </motion.div>
);

export const Providers: React.FC = () => {
  const providers = useQuery(api.companies.getCompanies, { userEmail: "henrique@ecovolt.com", type: "provider" });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = useMemo(() => {
    return providers?.filter(provider => 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [providers, searchQuery]);

  const stats = useMemo(() => {
    if (!providers) return { total: 0, active: 0, verified: 0, capacity: 0 };
    return {
      total: providers.length,
      active: providers.filter(p => p.status === 'active').length,
      verified: Math.floor(providers.length * 0.85), // Simulated for UI
      capacity: 1.2, // Simulated GWh
    };
  }, [providers]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-20"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={itemVariants}>
          <Typography variant="h1" className="text-4xl font-black tracking-tight text-white mb-2 uppercase">
            Ecosistema <span className="text-emerald-500">Provedores</span>
          </Typography>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-emerald-500/50" />
            <Typography variant="body" className="text-slate-400 font-medium tracking-wide">
              Rede Exclusiva de Fornecimento Energético de Alta Performance
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button variant="ghost" className="h-12 px-8 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold tracking-widest uppercase text-[10px] rounded-2xl">
            <ShieldCheck className="w-5 h-5 mr-3 text-emerald-500" />
            Certificar Provedor
          </Button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Parceiros Ativos" 
          value={stats.total} 
          icon={Globe} 
          color="from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="Uptime Operacional" 
          value="99.9%" 
          icon={Activity} 
          trend="LIVE"
          color="from-emerald-500 to-teal-600"
        />
        <StatCard 
          title="Capacity Global" 
          value={`${stats.capacity} GWh`} 
          icon={Zap} 
          color="from-amber-500 to-orange-600"
        />
        <StatCard 
          title="Trust Score" 
          value="Elite" 
          icon={Award} 
          color="from-purple-500 to-pink-600"
        />
      </div>

      {/* Action Bar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Filtrar por região, capacidade ou tecnologia..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all font-medium text-sm"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="ghost" className="h-14 px-8 border border-slate-800/50 hover:bg-slate-800 text-slate-400 font-bold tracking-widest uppercase text-[10px] rounded-2xl flex items-center gap-3">
            <Filter size={16} />
            Refinar Busca
          </Button>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="relative">
        {providers === undefined ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative" />
            </div>
            <Typography className="text-slate-500 font-black tracking-[0.3em] uppercase text-xs">Escaneando Rede...</Typography>
          </div>
        ) : filteredProviders?.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="glass-card flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-slate-800/50"
          >
            <Typography className="text-slate-600 font-black tracking-[0.2em] uppercase text-sm">
              Nenhum provedor localizado nos parâmetros atuais.
            </Typography>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProviders?.map((provider) => (
                <motion.div 
                  key={provider._id} 
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="glass-card group flex flex-col h-full border border-slate-800/50 hover:border-emerald-500/40 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-700" />
                  
                  <div className="p-8 space-y-8 flex flex-col h-full relative z-10">
                    {/* Card Top */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl font-black shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {provider.name[0]}
                        </div>
                        <div>
                          <Typography variant="h3" className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 mb-1">
                            {provider.name}
                          </Typography>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={10} className={`${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} `} />
                              ))}
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Elite Provider</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current/10 ${
                        provider.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {provider.status === 'active' ? 'Active' : 'Offline'}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4 pt-6 border-t border-slate-800/50 flex-1">
                      <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover/item:text-blue-400 group-hover/item:bg-blue-400/10 transition-all duration-300 border border-slate-700/30">
                            <MapPin size={16} />
                          </div>
                          <span className="text-xs text-slate-400 font-medium">{provider.region || 'Latam Operations'}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-800 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                      </div>
                      
                      <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover/item:text-emerald-400 group-hover/item:bg-emerald-400/10 transition-all duration-300 border border-slate-700/30">
                            <Zap size={16} />
                          </div>
                          <span className="text-xs text-slate-400 font-medium">Capacidade: <strong className="text-slate-200">{provider.capacity || 'Tier-1 High'}</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover/item:text-purple-400 group-hover/item:bg-purple-400/10 transition-all duration-300 border border-slate-700/30">
                            <BarChart3 size={16} />
                          </div>
                          <span className="text-xs text-slate-400 font-medium">{provider.category || 'Renewable Mix'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 pt-8 mt-auto">
                      <button className="h-12 rounded-2xl bg-slate-800/30 hover:bg-slate-800 text-slate-400 hover:text-white font-bold tracking-widest uppercase text-[10px] transition-all border border-slate-800/50 flex items-center justify-center gap-2">
                        <MessageSquare size={14} />
                        Nexus
                      </button>
                      <button className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-widest uppercase text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                        Profile
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

