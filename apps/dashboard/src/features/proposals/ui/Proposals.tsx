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
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight
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
      case 'accepted': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', icon: ShieldCheck, label: 'Aceita' };
      case 'rejected': return { color: 'text-red-400', bg: 'bg-red-400/10', glow: 'shadow-[0_0_20px_rgba(248,113,113,0.3)]', icon: XCircle, label: 'Recusada' };
      default: return { color: 'text-amber-400', bg: 'bg-amber-400/10', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]', icon: Clock, label: 'Pendente' };
    }
  };

  return (
    <div className="space-y-10 animate-luxury">
      {/* Header Section */}
      <header className="relative py-6">
        <div className="absolute -left-10 top-0 w-32 h-32 bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-primary glow-primary rounded-full" />
              <div>
                <Typography variant="h2" className="text-4xl font-black tracking-tighter text-white uppercase italic">
                  Registry <span className="text-primary">Negotiation</span>
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Typography variant="body" className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                    Terminal de Propostas Energéticas
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          
          {user?.role === 'provider' && (
            <Button 
              onClick={() => setShowNewProposalModal(true)}
              className="btn-premium-primary h-14 px-10 group"
            >
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" /> 
              Nova Oferta Comercial
            </Button>
          )}
        </div>
      </header>

      {/* Analytics Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Processamento Pendente', 
            value: allProposals?.filter(p => p.status === 'pending').length || 0,
            icon: Activity,
            color: 'text-amber-400',
            borderColor: 'border-amber-400/20',
            bg: 'bg-amber-400/5'
          },
          { 
            label: 'Acordos Firmados', 
            value: allProposals?.filter(p => p.status === 'accepted').length || 0,
            icon: ShieldCheck,
            color: 'text-emerald-400',
            borderColor: 'border-emerald-400/20',
            bg: 'bg-emerald-400/5'
          },
          { 
            label: 'Volume de Negociação', 
            value: allProposals?.length || 0,
            icon: Zap,
            color: 'text-blue-400',
            borderColor: 'border-blue-400/20',
            bg: 'bg-blue-400/5'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-thick p-8 relative overflow-hidden group border-l-4 ${stat.borderColor}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <Typography className={`text-[10px] font-black uppercase tracking-[0.2em] ${stat.color}`}>
                  {stat.label}
                </Typography>
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg border border-white/5`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <Typography variant="h3" className="text-5xl font-black text-white italic leading-none">
                  {stat.value.toString().padStart(2, '0')}
                </Typography>
                <Typography className="text-slate-600 text-xs font-bold uppercase tracking-widest">Unidades</Typography>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-6 p-2 bg-white/5 rounded-[2rem] border border-white/5">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="SCANNING DATABASE: EVENTO, FORNECEDOR OR ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-slate-600 outline-none focus:border-primary/30 focus:bg-slate-950 transition-all font-bold uppercase text-xs tracking-widest"
          />
        </div>
        <div className="flex gap-4 min-w-[300px]">
          <div className="relative flex-1">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-12 pr-10 text-white outline-none focus:border-primary/30 transition-all appearance-none cursor-pointer font-bold uppercase text-[10px] tracking-[0.2em]"
            >
              <option value="all">NEGOTIATION_STATUS: ALL</option>
              <option value="pending">NEGOTIATION_STATUS: PENDING</option>
              <option value="accepted">NEGOTIATION_STATUS: ACCEPTED</option>
              <option value="rejected">NEGOTIATION_STATUS: REJECTED</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <ChevronRight className="rotate-90" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Registry */}
      <div className="relative min-h-[400px]">
        {!filteredProposals ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
              </div>
            </div>
            <Typography className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
              Fetching Dossiers...
            </Typography>
          </div>
        ) : filteredProposals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-thick flex flex-col items-center justify-center py-32 text-center border-dashed border-2"
          >
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
              <FileText size={40} className="text-slate-700" />
            </div>
            <Typography className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              No Proposals Registered in Current Filter
            </Typography>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProposals.map((proposal, idx) => {
                const status = getStatusConfig(proposal.status);
                return (
                  <motion.div
                    key={proposal._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-thick group p-1 relative overflow-hidden transition-all duration-500 hover:border-primary/40"
                  >
                    <div className="p-8 space-y-8 relative z-10">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-1">
                          <Typography className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                            Dossier #{proposal._id.toString().slice(-6).toUpperCase()}
                          </Typography>
                          <Typography variant="h3" className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-primary transition-colors">
                            {proposal.eventName}
                          </Typography>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                            <Building2 size={12} className="text-slate-600" />
                            <span>{proposal.providerName}</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${status.bg} ${status.color} border border-current/20 ${status.glow}`}>
                          <status.icon size={14} />
                          {status.label}
                        </div>
                      </div>

                      {/* Technical Specs */}
                      <div className="grid grid-cols-2 gap-px bg-white/5 p-px rounded-2xl overflow-hidden border border-white/5">
                        <div className="bg-slate-950/40 p-5 space-y-1">
                          <Typography className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Offered Value</Typography>
                          <div className="flex items-center gap-2">
                            <Typography className="text-xl font-black text-white italic">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}
                            </Typography>
                            <ArrowUpRight size={16} className="text-emerald-500" />
                          </div>
                        </div>
                        <div className="bg-slate-950/40 p-5 space-y-1">
                          <Typography className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Registry Date</Typography>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-primary" />
                            <Typography className="text-sm font-bold text-slate-300">
                              {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="relative">
                        <Typography className="text-xs font-bold text-slate-500 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                          "{proposal.description || 'Nenhuma descrição técnica fornecida para este dossier.'}"
                        </Typography>
                      </div>

                      {/* Actions */}
                      <div className="pt-2">
                        {user?.role === 'event_company' && proposal.status === 'pending' ? (
                          <div className="flex gap-4">
                            <Button 
                              variant="ghost" 
                              onClick={() => handleReject(proposal._id)}
                              className="flex-1 h-12 rounded-xl border border-white/5 text-red-400 hover:bg-red-400/10 font-black uppercase tracking-widest text-[10px]"
                            >
                              Reject Dossier
                            </Button>
                            <Button 
                              onClick={() => handleAccept(proposal._id)}
                              className="flex-1 btn-premium-primary h-12 rounded-xl text-[10px]"
                            >
                              Finalize Agreement
                            </Button>
                          </div>
                        ) : proposal.status === 'accepted' ? (
                          <button 
                            onClick={() => window.location.href='/dashboard/contratos'}
                            className="w-full py-4 rounded-2xl bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all group/btn"
                          >
                            <ShieldCheck size={16} />
                            View Encrypted Contract
                            <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                          </button>
                        ) : (
                          <div className="w-full py-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                            <Typography className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                              Access Restricted / No Pending Actions
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showNewProposalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewProposalModal(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl glass-thick border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Modal Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>

              <div className="p-10 sm:p-14 relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div className="space-y-1">
                    <Typography className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Secure Portal</Typography>
                    <Typography variant="h3" className="text-3xl font-black text-white italic uppercase">
                      New <span className="text-primary">Negotiation</span> Dossier
                    </Typography>
                  </div>
                  <button 
                    onClick={() => setShowNewProposalModal(false)}
                    className="w-12 h-12 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateProposal} className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Target Registry Event</label>
                    <div className="relative group">
                      <select 
                        required
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer font-bold text-sm"
                      >
                        <option value="">SELECT TARGET...</option>
                        {events?.filter(e => e.status === 'planning').map(event => (
                          <option key={event._id} value={event._id}>
                            {event.name.toUpperCase()} — {event.location.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Economic Value (BRL)</label>
                      <div className="relative group">
                        <DollarSign size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                        <input 
                          type="number" 
                          required 
                          placeholder="0.00"
                          value={proposalValue}
                          onChange={(e) => setProposalValue(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all font-black text-lg italic"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Operational Integrity</label>
                      <div className="w-full h-16 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Secure Link Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Technical Conditions & Description</label>
                    <textarea 
                      rows={4}
                      placeholder="Specify energy load capacity, distribution terms, and compliance conditions..."
                      value={proposalDesc}
                      onChange={(e) => setProposalDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-3xl py-6 px-6 text-white outline-none focus:border-primary/50 transition-all resize-none font-bold text-sm italic"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1 h-16 rounded-2xl border border-white/10 hover:bg-white/5 font-black uppercase tracking-[0.2em] text-xs"
                      onClick={() => setShowNewProposalModal(false)}
                    >
                      Abort Mission
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-premium-primary h-16 rounded-2xl text-xs"
                    >
                      Transmit Proposal Dossier
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

