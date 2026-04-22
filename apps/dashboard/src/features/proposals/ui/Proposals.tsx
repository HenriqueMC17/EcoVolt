import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from "@/../convex/_generated/api";
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Filter, 
  Search,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  X,
  Loader2,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

export const Proposals: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [proposalValue, setProposalValue] = useState<string>('');
  const [proposalDesc, setProposalDesc] = useState('');

  // Queries
  const allProposals = useQuery(api.proposals.getProposals, { 
    userEmail: user?.email || undefined 
  });
  
  const events = useQuery(api.events.getEvents, {
    userEmail: user?.email || undefined
  });
  
  // Mutations
  const createProposal = useMutation(api.proposals.createProposal);
  const acceptProposal = useMutation(api.proposals.acceptProposal);
  const rejectProposal = useMutation(api.proposals.rejectProposal);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.companyId || !selectedEventId) return;

    try {
      await createProposal({
        eventId: selectedEventId as any,
        providerCompanyId: user.companyId as any,
        value: Number(proposalValue),
        description: proposalDesc,
        userEmail: user.email
      });
      showToast('Proposta enviada com sucesso!', 'success');
      setShowNewProposalModal(false);
      resetForm();
    } catch (error) {
      showToast('Erro ao enviar proposta.', 'error');
    }
  };

  const handleAccept = async (id: any) => {
    if (!user?.email) return;
    try {
      await acceptProposal({ 
        proposalId: id,
        userEmail: user.email 
      });
      showToast('Proposta aceita! Contrato gerado.', 'success');
    } catch (error) {
      showToast('Erro ao aceitar proposta.', 'error');
    }
  };

  const handleReject = async (id: any) => {
    if (!user?.email) return;
    try {
      await rejectProposal({ 
        proposalId: id,
        userEmail: user.email
      });
      showToast('Proposta recusada.', 'info');
    } catch (error) {
      showToast('Erro ao recusar proposta.', 'error');
    }
  };

  const resetForm = () => {
    setSelectedEventId('');
    setProposalValue('');
    setProposalDesc('');
  };

  const filteredProposals = allProposals?.filter(p => {
    const matchesSearch = p.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2, label: 'Aceita' };
      case 'rejected': return { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Recusada' };
      default: return { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock, label: 'Pendente' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2" className="text-3xl font-bold tracking-tight text-white">
            Gestão de Propostas
          </Typography>
          <Typography variant="body" className="text-slate-400 mt-1">
            Negociação e aprovação de fornecimento energético.
          </Typography>
        </div>
        
        {user?.role === 'provider' && (
          <Button 
            onClick={() => setShowNewProposalModal(true)}
            className="btn-premium-primary"
          >
            <Plus className="w-5 h-5 mr-2" /> 
            Nova Proposta
          </Button>
        )}
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { 
            label: 'Pendentes', 
            value: allProposals?.filter(p => p.status === 'pending').length || 0,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10'
          },
          { 
            label: 'Aceitas', 
            value: allProposals?.filter(p => p.status === 'accepted').length || 0,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
          },
          { 
            label: 'Total Geral', 
            value: allProposals?.length || 0,
            icon: FileText,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-5 border border-slate-800"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current/10 shadow-lg shadow-current/5`}>
              <stat.icon size={28} />
            </div>
            <div>
              <Typography className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</Typography>
              <Typography variant="h3" className="text-3xl font-black text-white mt-0.5">{stat.value}</Typography>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por evento ou fornecedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-8 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="accepted">Aceita</option>
              <option value="rejected">Recusada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="relative">
        {!filteredProposals ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <Typography className="text-slate-400">Processando propostas...</Typography>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center border border-slate-800">
            <FileText size={48} className="text-slate-700 mb-4" />
            <Typography className="text-slate-500">Nenhuma proposta encontrada no momento.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProposals.map((proposal) => {
                const status = getStatusConfig(proposal.status);
                return (
                  <motion.div
                    key={proposal._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    className="glass-card group overflow-hidden border border-slate-800 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Typography variant="h3" className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {proposal.eventName}
                          </Typography>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Building2 size={12} />
                            <span>{proposal.providerName}</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.color} border border-current/10`}>
                          <status.icon size={12} />
                          {status.label}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
                        <div className="space-y-1">
                          <Typography className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Valor da Oferta</Typography>
                          <div className="flex items-center gap-1.5 text-white font-bold">
                            <DollarSign size={14} className="text-blue-400" />
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Typography className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Data de Emissão</Typography>
                          <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                            <Calendar size={14} className="text-slate-500" />
                            <span>{new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>

                      {proposal.description && (
                        <Typography className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                          {proposal.description}
                        </Typography>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        {user?.role === 'event_company' && proposal.status === 'pending' ? (
                          <div className="flex gap-3 w-full">
                            <Button 
                              variant="ghost" 
                              onClick={() => handleReject(proposal._id)}
                              className="flex-1 text-red-400 hover:bg-red-400/10 border border-slate-800"
                            >
                              Recusar
                            </Button>
                            <Button 
                              onClick={() => handleAccept(proposal._id)}
                              className="flex-1 btn-premium-primary"
                            >
                              Aceitar Proposta
                            </Button>
                          </div>
                        ) : proposal.status === 'accepted' ? (
                          <button 
                            onClick={() => window.location.href='/dashboard/contratos'}
                            className="w-full py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group/btn"
                          >
                            Ver Contrato Ativo
                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                          <Typography className="text-xs text-slate-600 italic italic">Nenhuma ação disponível</Typography>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showNewProposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewProposalModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Typography variant="h3" className="text-xl font-bold text-white">
                      Nova Proposta Comercial
                    </Typography>
                    <Typography className="text-sm text-slate-400 mt-1">
                      Envie sua oferta competitiva para o evento selecionado.
                    </Typography>
                  </div>
                  <button 
                    onClick={() => setShowNewProposalModal(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateProposal} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evento Alvo</label>
                    <select 
                      required
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Selecione um evento...</option>
                      {events?.filter(e => e.status === 'planning').map(event => (
                        <option key={event._id} value={event._id}>
                          {event.name} ({event.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor da Proposta (R$)</label>
                    <div className="relative group">
                      <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input 
                        type="number" 
                        required 
                        placeholder="0,00"
                        value={proposalValue}
                        onChange={(e) => setProposalValue(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição / Condições</label>
                    <textarea 
                      rows={4}
                      placeholder="Detalhes sobre o fornecimento de energia, prazos e condições comerciais..."
                      value={proposalDesc}
                      onChange={(e) => setProposalDesc(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1 border border-slate-700 hover:bg-slate-800"
                      onClick={() => setShowNewProposalModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-premium-primary"
                    >
                      Enviar Proposta
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
