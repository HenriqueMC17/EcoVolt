import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Zap, 
  Search, 
  Filter,
  MessageSquare,
  FileText,
  Loader2,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from "@/../convex/_generated/api";
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

export const Providers: React.FC = () => {
  const providers = useQuery(api.companies.getCompanies, { userEmail: "henrique@ecovolt.com", type: "provider" });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = providers?.filter(provider => 
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2" className="text-3xl font-bold tracking-tight text-white">
            Provedores de Energia
          </Typography>
          <Typography variant="p" className="text-slate-400 mt-1">
            Rede exclusiva de fornecedores de energia limpa homologados.
          </Typography>
        </div>
        <Button variant="ghost" className="border border-slate-800 hover:bg-slate-800 text-slate-300">
          <ShieldCheck className="w-5 h-5 mr-2 text-blue-400" />
          Seja um Provedor
        </Button>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por região, capacidade ou tipo..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
        <Button variant="ghost" className="border border-slate-800 text-slate-400">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>

      {/* Content */}
      <div className="relative">
        {providers === undefined ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <Typography className="text-slate-400">Localizando provedores...</Typography>
          </div>
        ) : filteredProviders?.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <Typography className="text-slate-500">Nenhum provedor encontrado para sua busca.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProviders?.map((provider) => (
                <motion.div 
                  key={provider._id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  className="glass-card group flex flex-col h-full border border-slate-800 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="p-6 space-y-6 flex flex-col h-full">
                    {/* Card Top */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                          {provider.name[0]}
                        </div>
                        <div>
                          <Typography variant="h3" className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {provider.name}
                          </Typography>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-yellow-400">{provider.rating || '5.0'}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Homologado</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                        provider.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {provider.status === 'active' ? 'Online' : 'Offline'}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/50 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm text-slate-400">{provider.region || 'Abrangência Nacional'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                          <Zap size={16} />
                        </div>
                        <span className="text-sm text-slate-400">Capacidade: <strong className="text-slate-200">{provider.capacity || 'Alta'}</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-purple-400 transition-colors">
                          <FileText size={16} />
                        </div>
                        <span className="text-sm text-slate-400">{provider.category || 'Energia Sustentável'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-6 mt-auto">
                      <Button variant="ghost" className="bg-slate-800/30 hover:bg-slate-800 border-none text-slate-300">
                        <MessageSquare size={16} className="mr-2" />
                        Chat
                      </Button>
                      <Button className="btn-premium-primary">
                        Perfil
                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
