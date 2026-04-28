import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
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
  
  const pipelineData = useQuery(
    api.events.getEventPipeline, 
    isValidId && user?.email ? { eventId: id as Id<"events">, userEmail: user.email } : 'skip'
  );

  if (pipelineData === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (pipelineData === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-center space-y-4">
          <Typography variant="h2" className="text-white">Operação não encontrada</Typography>
          <Typography className="text-slate-400 max-w-xs mx-auto">Não foi possível localizar os dados desta operação ou você não possui permissão de acesso.</Typography>
          <button 
            onClick={() => navigate('/events')} 
            className="flex items-center gap-2 mx-auto text-primary font-bold uppercase text-[10px] tracking-widest hover:underline"
          >
            <ArrowLeft size={14} />
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const { event, proposals, contract, consumption, financial } = pipelineData;

  // Navigation handlers with context
  const handleNavigate = (path: string) => {
    navigate(`${path}?eventId=${id}`);
  };

  // Calculate pipeline progress
  const getProgress = () => {
    let progress = 25; // Base estimation step
    if (proposals.hasAccepted) progress = 50;
    if (contract?.status === 'active') progress = 75;
    if (consumption) progress = 100;
    return progress;
  };

  const getNextAction = () => {
    if (event.estimatedConsumption === 0) {
      return {
        title: 'Calcular Demanda Energética',
        description: 'Defina a infraestrutura do evento para provisionar a carga necessária.',
        icon: <Calculator className="text-blue-400" />,
        action: () => handleNavigate('/estimation'),
        color: 'blue'
      };
    }
    if (proposals.count === 0) {
      return {
        title: 'Solicitar Propostas',
        description: 'O cálculo está pronto. Agora, conecte sua demanda aos provedores da rede.',
        icon: <Zap className="text-amber-400" />,
        action: () => handleNavigate('/providers'),
        color: 'amber'
      };
    }
    if (!proposals.hasAccepted) {
      return {
        title: 'Analisar Propostas Recebidas',
        description: `Você recebeu ${proposals.count} propostas. Selecione a melhor oferta para prosseguir.`,
        icon: <FileText className="text-emerald-400" />,
        action: () => handleNavigate('/proposals'),
        color: 'emerald'
      };
    }
    if (!contract) {
      return {
        title: 'Gerar Instrumento Jurídico',
        description: 'A proposta foi aceita. Formalize a contratação para garantir o fornecimento.',
        icon: <FileCheck className="text-purple-400" />,
        action: () => handleNavigate('/contracts'),
        color: 'purple'
      };
    }
    if (event.status !== 'active') {
      return {
        title: 'Ativar Operação',
        description: 'Contrato assinado. O evento está pronto para iniciar o monitoramento.',
        icon: <Activity className="text-primary" />,
        action: () => {}, // Mutation to start event
        color: 'primary'
      };
    }
    return null;
  };

  const nextAction = getNextAction();

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-20"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
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
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-slate-900/40 p-2 rounded-2xl border border-white/5">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
              event.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              event.status === 'planning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-slate-500/10 border-slate-500/20 text-slate-400'
            }`}>
              Status: {event.status === 'active' ? 'Em Andamento' : event.status === 'planning' ? 'Planejamento' : event.status}
            </div>
          </div>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </motion.div>

      {/* Action Center - Guided Workflow */}
      {nextAction && (
        <motion.div 
          variants={itemVariants}
          className={`p-1 rounded-[2.5rem] bg-gradient-to-r ${
            nextAction.color === 'blue' ? 'from-blue-500/20 via-indigo-500/20 to-transparent border-blue-500/30' :
            nextAction.color === 'amber' ? 'from-amber-500/20 via-orange-500/20 to-transparent border-amber-500/30' :
            nextAction.color === 'emerald' ? 'from-emerald-500/20 via-teal-500/20 to-transparent border-emerald-500/30' :
            'from-primary/20 via-secondary/20 to-transparent border-primary/30'
          } border shadow-2xl`}
        >
          <div className="glass-card p-8 rounded-[2.4rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border ${
                nextAction.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
                nextAction.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20' :
                nextAction.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20' :
                'bg-primary/10 border-primary/20'
              }`}>
                {React.cloneElement(nextAction.icon as React.ReactElement, { size: 32 })}
              </div>
              <div className="space-y-1">
                <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Próxima Ação Recomentada</Typography>
                <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">{nextAction.title}</Typography>
                <Typography className="text-slate-400 text-sm">{nextAction.description}</Typography>
              </div>
            </div>
            <button 
              onClick={nextAction.action}
              className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 ${
                nextAction.color === 'blue' ? 'bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-blue-500/50' :
                nextAction.color === 'amber' ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-amber-500/50' :
                nextAction.color === 'emerald' ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/50' :
                'bg-primary text-black shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/50'
              }`}
            >
              Executar Agora
            </button>
          </div>
        </motion.div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="glass-card p-6 border border-white/5 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Calculator size={18} />
            <Typography className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Demanda</Typography>
          </div>
          <Typography className="text-2xl font-black text-white">{event.estimatedConsumption.toLocaleString()} <span className="text-xs font-medium text-slate-500">kWh</span></Typography>
          <Typography className="text-[10px] text-slate-500 mt-1">Provisionamento Técnico</Typography>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 border border-white/5 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <FileText size={18} />
            <Typography className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Propostas</Typography>
          </div>
          <Typography className="text-2xl font-black text-white">{proposals.count} <span className="text-xs font-medium text-slate-500">recebidas</span></Typography>
          <Typography className={`text-[10px] mt-1 ${proposals.hasAccepted ? 'text-emerald-400' : 'text-slate-500'}`}>
            {proposals.hasAccepted ? 'Provedor Adjudicado' : 'Em fase de cotação'}
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 border border-white/5 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <DollarSign size={18} />
            <Typography className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Financeiro</Typography>
          </div>
          <Typography className="text-2xl font-black text-white">
            {financial ? `R$ ${financial.totalValue.toLocaleString()}` : '--'}
          </Typography>
          <Typography className="text-[10px] text-slate-500 mt-1">
            {financial?.ratePerKwh ? `Taxa: R$ ${financial.ratePerKwh}/kWh` : 'Aguardando Contrato'}
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 border border-white/5 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 text-amber-400">
            <Activity size={18} />
            <Typography className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Consumo Real</Typography>
          </div>
          <Typography className="text-2xl font-black text-white">
            {consumption ? `${consumption.totalActual.toLocaleString()}` : '--'} <span className="text-xs font-medium text-slate-500">kWh</span>
          </Typography>
          <div className="flex items-center justify-between mt-1">
             <Typography className="text-[10px] text-slate-500">
              {consumption ? `${((consumption.totalActual / consumption.totalPredicted) * 100).toFixed(1)}% do previsto` : 'Sem telemetria'}
            </Typography>
            {consumption && (consumption.totalActual > consumption.totalPredicted) && (
              <span className="text-[8px] font-black uppercase text-rose-500 animate-pulse">Risco de Excesso</span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Info Básica */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-white/5 rounded-[2rem] space-y-6">
            <Typography variant="h3" className="text-lg font-bold text-white mb-4">Dossier Técnico</Typography>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-xl bg-white/5 text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Local</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">{event.location}</Typography>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-xl bg-white/5 text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cronograma</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">
                    {new Date(event.startDate).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-xl bg-white/5 text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                  <Users size={20} />
                </div>
                <div>
                  <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Público Pax</Typography>
                  <Typography className="text-sm text-slate-200 font-medium">{event.expectedAttendees.toLocaleString()} pessoas</Typography>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
               <button 
                onClick={() => handleNavigate('/reports')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-transparent hover:border-white/10"
               >
                 <span>Gerar Relatório PDF</span>
                 <FileText size={16} />
               </button>
               
               <button 
                onClick={() => handleNavigate('/documents')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-transparent hover:border-white/10"
               >
                 <span>Repositório de Docs</span>
                 <ArrowLeft size={16} className="rotate-180" />
               </button>
            </div>
          </div>

          {/* Explainability Section */}
          <div className="glass-card p-6 border border-white/5 rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="text-sm font-bold text-white uppercase tracking-wider">Transparência da Carga</Typography>
              <Zap size={14} className="text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Climatização</span>
                  <span className="text-slate-200">45%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[45%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Iluminação & LED</span>
                  <span className="text-slate-200">30%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[30%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Som & Palco</span>
                  <span className="text-slate-200">15%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[15%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Miscelânea (TI/Pax)</span>
                  <span className="text-slate-200">10%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 w-[10%]" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mt-4">
              <Typography className="text-[9px] font-bold text-amber-500/80 uppercase leading-relaxed">
                Atenção: A margem de segurança atual é de 20%. Recomendamos manter acima de 15% para picos térmicos.
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Coluna Direita: Fluxo de Trabalho (Pipeline) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 border border-white/5 rounded-[2rem] h-full">
            <div className="flex items-center justify-between mb-8">
              <Typography variant="h3" className="text-xl font-bold text-white">Fluxo de Trabalho Operacional</Typography>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronizado</Typography>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Step 1: Estimativa */}
              <button 
                onClick={() => handleNavigate('/estimation')} 
                className={`w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all group flex items-center justify-between ${
                  event.estimatedConsumption > 0 ? 'opacity-100' : 'border-blue-400/30 bg-blue-500/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    event.estimatedConsumption > 0 ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    <Calculator size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white group-hover:text-primary transition-colors">Cálculo de Demanda</Typography>
                    <Typography className="text-xs text-slate-400">
                      {event.estimatedConsumption > 0 ? 'Provisionamento técnico validado' : 'Requer definição de infraestrutura'}
                    </Typography>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  event.estimatedConsumption > 0 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse'
                }`}>
                  {event.estimatedConsumption > 0 ? 'Concluído' : 'Pendente'}
                </div>
              </button>

              {/* Step 2: Propostas */}
              <button 
                onClick={() => handleNavigate('/proposals')} 
                disabled={event.estimatedConsumption === 0}
                className={`w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group flex items-center justify-between ${
                  event.estimatedConsumption === 0 ? 'opacity-50 cursor-not-allowed' :
                  proposals.hasAccepted ? 'opacity-100' : 
                  proposals.count > 0 ? 'border-blue-400/30 bg-blue-500/5' : 'border-amber-400/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    proposals.hasAccepted ? 'bg-emerald-500/10 text-emerald-400' : 
                    proposals.count > 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <Typography className={`text-base font-bold text-white transition-colors ${
                      proposals.hasAccepted ? 'group-hover:text-emerald-400' : 'group-hover:text-blue-400'
                    }`}>
                      Propostas de Fornecimento ({proposals.count})
                    </Typography>
                    <Typography className="text-xs text-slate-400">
                      {proposals.hasAccepted ? 'Provedor selecionado' : proposals.count > 0 ? 'Analisando ofertas comerciais' : 'Aguardando envio de RFPs'}
                    </Typography>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  proposals.hasAccepted 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : proposals.count > 0 
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                }`}>
                  {proposals.hasAccepted ? 'Definido' : proposals.count > 0 ? 'Em Análise' : 'Aguardando'}
                </div>
              </button>

              {/* Step 3: Contrato */}
              <button 
                onClick={() => contract && handleNavigate('/contracts')} 
                disabled={!proposals.hasAccepted}
                className={`w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 transition-all group flex items-center justify-between ${
                  !proposals.hasAccepted ? 'opacity-50 cursor-not-allowed' :
                  contract?.status === 'active' ? 'opacity-100' : 
                  contract ? 'border-purple-400/30 bg-purple-500/5' : 'border-purple-400/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    contract?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white">Instrumento Jurídico</Typography>
                    <Typography className="text-xs text-slate-400">
                      {!proposals.hasAccepted ? 'Requer proposta aceita' : contract ? `Status: ${contract.status}` : 'Aguardando emissão da minuta'}
                    </Typography>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  contract?.status === 'active' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : contract 
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 animate-pulse'
                      : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                }`}>
                  {contract?.status === 'active' ? 'Ativo' : contract ? 'Pendente' : 'Bloqueado'}
                </div>
              </button>

              {/* Step 4: Consumo */}
              <button 
                onClick={() => contract?.status === 'active' && handleNavigate('/consumption')} 
                disabled={contract?.status !== 'active'}
                className={`w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 transition-all group flex items-center justify-between ${
                  contract?.status !== 'active' ? 'opacity-50 cursor-not-allowed' :
                  consumption ? 'opacity-100 border-primary/30 bg-primary/5' : 'border-amber-400/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    consumption ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <Typography className="text-base font-bold text-white">Telemetria & Consumo (Live)</Typography>
                    <Typography className="text-xs text-slate-400">Monitoramento de carga em tempo real</Typography>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  consumption 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : contract?.status === 'active'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                      : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                }`}>
                  {consumption ? 'Monitorando' : contract?.status === 'active' ? 'Aguardando Início' : 'Indisponível'}
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
