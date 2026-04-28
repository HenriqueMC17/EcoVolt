import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { Id } from '@/../convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Zap, 
  FileText, 
  Calculator, 
  FileCheck,
  Activity,
  DollarSign
} from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';

import { useUser } from '@/context/UserContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
  }
};

export const EventHub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  // Validate ID format before querying
  const isValidId = id && typeof id === 'string' && id.length > 0;
  
  const event = useQuery(
    api.events.getEventById, 
    isValidId && user?.email ? { eventId: id as Id<"events">, userEmail: user.email } : 'skip'
  );

  if (event === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Typography variant="h2" className="text-white">Evento não encontrado</Typography>
        <button onClick={() => navigate('/events')} className="text-primary hover:underline">Voltar para eventos</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-20"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/events')}
          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
              Hub da Operação
            </Typography>
            <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-white/10 text-slate-300">
              {event.companyName}
            </span>
          </div>
          <Typography variant="h1" className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            {event.name}
          </Typography>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Info Básica */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-white/5 rounded-[2rem] space-y-6">
            <Typography variant="h3" className="text-lg font-bold text-white mb-4">Detalhes Técnicos</Typography>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-blue-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Local</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">{event.location}</Typography>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-emerald-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Programada</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">
                    {new Date(event.startDate).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-purple-400">
                  <Users size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Público Estimado</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">{event.expectedAttendees.toLocaleString()} pessoas</Typography>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-amber-400">
                  <Zap size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Demanda de Energia</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">{event.estimatedConsumption.toLocaleString()} kWh</Typography>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coluna Direita: Fluxo de Trabalho (Pipeline) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="glass-card p-8 border border-white/5 rounded-[2rem] h-full">
            <Typography variant="h3" className="text-xl font-bold text-white mb-8">Pipeline da Operação</Typography>
            
            <div className="space-y-4">
              <button onClick={() => navigate('/estimation')} className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white group-hover:text-primary transition-colors">Estimativa de Consumo</Typography>
                    <Typography className="text-xs text-slate-400">Calcular carga necessária e perfis de geradores</Typography>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  Concluído
                </div>
              </button>

              <button onClick={() => navigate('/proposals')} className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">Propostas (3)</Typography>
                    <Typography className="text-xs text-slate-400">Analisar ofertas de provedores de energia</Typography>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                  Ação Necessária
                </div>
              </button>

              <button onClick={() => navigate('/contracts')} className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/30 transition-all group flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white">Contrato</Typography>
                    <Typography className="text-xs text-slate-400">Firmar acordo com o provedor selecionado</Typography>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Bloqueado
                </div>
              </button>

              <button onClick={() => navigate('/consumption')} className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all group flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Activity size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white">Consumo em Tempo Real</Typography>
                    <Typography className="text-xs text-slate-400">Monitorar energia durante o evento</Typography>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Aguardando
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
