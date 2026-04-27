import React, { useState, useMemo } from 'react';
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
  ArrowUpRight,
  Terminal,
  Database,
  Lock,
  Cpu,
  Layers,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';

// --- Animation Variants ---

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

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

  const filteredProposals = useMemo(() => {
    if (!allProposals) return null;
    return allProposals.filter(p => {
      const matchesSearch = p.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.providerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [allProposals, searchTerm, filterStatus]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted': return { color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/20', glow: 'shadow-emerald-400/5', icon: ShieldCheck, label: 'PROTOCOL_APPROVED' };
      case 'rejected': return { color: 'text-rose-400', bg: 'bg-rose-400/5', border: 'border-rose-400/20', glow: 'shadow-rose-400/5', icon: XCircle, label: 'NEGOTIATION_REVOKED' };
      default: return { color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20', glow: 'shadow-amber-400/5', icon: Clock, label: 'AWAIT_VALIDATION' };
    }
  };

  if (allProposals === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
        <div className="p-8 glass-thick rounded-full border-primary/30 relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
        <Typography className="text-primary font-black tracking-[0.5em] uppercase text-[10px] animate-pulse">
          Syncing Negotiation Stream...
        </Typography>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-24 relative"
    >
      {/* HUD Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <motion.div variants={itemVariants} className="relative pl-8">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
          <div className="flex items-center gap-2 mb-2">
            <Network size={12} className="text-primary animate-pulse" />
            <Typography className="text-[10px] font-black italic uppercase tracking-[0.5em] text-primary">
              Negotiation Engine v4.0.12
            </Typography>
          </div>
          <Typography variant="h1" className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
            Registry <span className="text-primary glow-text">Negotiation</span>
          </Typography>
          <div className="flex items-center gap-4">
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Database size={14} className="text-primary/50" />
              BUFFER-MODE: PERSISTENT
            </Typography>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Lock size={14} className="text-primary/50" />
              SSL-ENDPOINT: SECURE
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          {user?.role === 'provider' && (
            <Button 
              onClick={() => setShowNewProposalModal(true)}
              className="btn-premium-primary h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <Plus size={18} className="mr-2" />
              Nova Oferta Comercial
            </Button>
          )}
        </motion.div>
      </header>

      {/* Analytics HUD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            label: 'Processamento Pendente', 
            value: allProposals?.filter(p => p.status === 'pending').length || 0,
            icon: Clock,
            color: 'text-amber-400',
            trend: 'AWAITING'
          },
          { 
            label: 'Acordos Firmados', 
            value: allProposals?.filter(p => p.status === 'accepted').length || 0,
            icon: ShieldCheck,
            color: 'text-emerald-400',
            trend: '+5.4%'
          },
          { 
            label: 'Volume de Negociação', 
            value: allProposals?.length || 0,
            icon: Zap,
            color: 'text-blue-400',
            trend: 'STABLE'
          }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="glass-thick p-6 relative overflow-hidden group border-l-2 border-primary/30"
          >
            <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-3 rounded-xl bg-neutral-900/80 border border-white/5 shadow-2xl group-hover:border-primary/50 transition-all", stat.color)}>
                <stat.icon size={22} className="group-hover:animate-pulse" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn("text-[10px] font-black italic uppercase tracking-tighter px-2 py-0.5 rounded-full bg-white/5 border border-white/5", stat.color)}>
                  {stat.trend}
                </span>
                <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-1">
                  <Activity size={8} className="animate-pulse" />
                  REALTIME
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <Typography className="text-[10px] font-black italic uppercase tracking-[0.3em] text-primary/70 mb-1 block">
                {stat.label}
              </Typography>
              <Typography className="text-4xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-none">
                {stat.value.toString().padStart(2, '0')}
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Control Terminal */}
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="glass-thick p-4 flex flex-wrap gap-4 items-center bg-neutral-900/40 backdrop-blur-xl relative z-10 overflow-hidden">
          <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
          
          <div className="relative flex-1 min-w-[300px] group/search">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-primary transition-all group-focus-within/search:scale-110" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SCANNING DATABASE: EVENTO, FORNECEDOR OR DOSSIER_ID..." 
              className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 focus:bg-black/80 transition-all text-[11px] font-black tracking-widest uppercase text-white placeholder:text-white/10 shadow-inner"
            />
          </div>
          
          <div className="flex gap-4 min-w-[240px]">
            <div className="relative flex-1 group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer font-black uppercase text-[10px] tracking-[0.2em]"
              >
                <option value="all">NEGOTIATION_STATUS: ALL</option>
                <option value="pending">NEGOTIATION_STATUS: PENDING</option>
                <option value="accepted">NEGOTIATION_STATUS: ACCEPTED</option>
                <option value="rejected">NEGOTIATION_STATUS: REJECTED</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                <ChevronRight className="rotate-90" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="relative min-h-[400px]">
          {filteredProposals && filteredProposals.length === 0 ? (
            <div className="glass-thick flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-white/5">
              <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 border border-white/5 relative">
                <div className="absolute inset-0 scanline opacity-[0.1] pointer-events-none" />
                <Terminal size={40} className="text-white/10" />
              </div>
              <Typography className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
                No Negotiation Dossiers Found in Current Session
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProposals?.map((proposal, idx) => {
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
                      <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
                      
                      <div className="p-8 space-y-8 relative z-10">
                        {/* Dossier Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">
                                DOSSIER #{proposal._id.toString().slice(-6).toUpperCase()}
                              </span>
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                                v1.2
                              </span>
                            </div>
                            <Typography variant="h3" className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors leading-none pt-2">
                              {proposal.eventName}
                            </Typography>
                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-black uppercase tracking-[0.2em] pt-1">
                              <Building2 size={12} className="text-primary/50" />
                              <span>{proposal.providerName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Hub */}
                        <div className={cn(
                          "w-full py-2.5 px-4 rounded-xl flex items-center justify-between border transition-all duration-500",
                          status.bg, status.color, status.border, status.glow
                        )}>
                          <div className="flex items-center gap-3">
                            <status.icon size={16} className={cn(proposal.status === 'pending' && "animate-pulse")} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{status.label}</span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={cn("w-1 h-1 rounded-full", i === 1 ? "bg-current" : "bg-white/10")} />
                            ))}
                          </div>
                        </div>

                        {/* Technical Metrics Grid */}
                        <div className="grid grid-cols-2 gap-px bg-white/5 p-px rounded-2xl overflow-hidden border border-white/5 relative">
                          <div className="bg-neutral-900/60 p-5 space-y-1 relative group/stat overflow-hidden">
                            <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                            <Typography className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Offered CAPEX</Typography>
                            <div className="flex items-center gap-2">
                              <Typography className="text-xl font-black text-white italic tracking-tighter group-hover/stat:text-primary transition-colors">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}
                              </Typography>
                              <ArrowUpRight size={16} className="text-primary animate-pulse" />
                            </div>
                          </div>
                          <div className="bg-neutral-900/60 p-5 space-y-1 relative group/stat overflow-hidden">
                            <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                            <Typography className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Registry Timestamp</Typography>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-primary/60" />
                              <Typography className="text-sm font-black text-white/80 uppercase tracking-widest">
                                {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                              </Typography>
                            </div>
                          </div>
                        </div>

                        {/* Encrypted Conditions */}
                        <div className="relative group/desc">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover/desc:bg-primary transition-colors" />
                          <Typography className="text-[11px] font-bold text-white/40 leading-relaxed italic pl-6 py-1 group-hover/desc:text-white/60 transition-all">
                            "{proposal.description || 'TECHNICAL_SPECIFICATIONS_NOT_FOUND. DEFAULT_PROTOCOL_APPLIED.'}"
                          </Typography>
                        </div>

                        {/* Action Terminal */}
                        <div className="pt-2">
                          {user?.role === 'event_company' && proposal.status === 'pending' ? (
                            <div className="flex gap-4">
                              <Button 
                                variant="ghost" 
                                onClick={() => handleReject(proposal._id)}
                                className="flex-1 h-14 rounded-2xl border border-white/5 text-rose-400 hover:bg-rose-400/10 font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                              >
                                Revoke Dossier
                              </Button>
                              <Button 
                                onClick={() => handleAccept(proposal._id)}
                                className="flex-1 btn-premium-primary h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
                              >
                                Execute Agreement
                              </Button>
                            </div>
                          ) : proposal.status === 'accepted' ? (
                            <button 
                              onClick={() => window.location.href='/dashboard/contratos'}
                              className="w-full py-4 rounded-2xl bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all group/btn relative overflow-hidden"
                            >
                              <div className="absolute inset-0 scanline opacity-[0.1] pointer-events-none" />
                              <ShieldCheck size={16} />
                              Access Encrypted Ledger
                              <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                            </button>
                          ) : (
                            <div className="w-full py-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 relative overflow-hidden">
                              <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                              <Typography className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
                                NODE_LOCKED // ACCESS_RESTRICTED
                              </Typography>
                            </div>
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
      </motion.div>

      {/* Creation Modal - Enhanced Forensic HUD */}
      <AnimatePresence>
        {showNewProposalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewProposalModal(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl glass-thick border-white/10 shadow-[0_0_150px_rgba(16,185,129,0.15)] overflow-hidden rounded-[2rem]"
            >
              <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-teal-500 to-blue-500" />
              
              <div className="p-12 relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={14} className="text-primary" />
                      <Typography className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Secure Link Initialized</Typography>
                    </div>
                    <Typography variant="h2" className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                      New <span className="text-primary">Negotiation</span> Dossier
                    </Typography>
                  </div>
                  <button 
                    onClick={() => setShowNewProposalModal(false)}
                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 border border-white/5 transition-all hover:rotate-90"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateProposal} className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Target Registry Event</label>
                    <div className="relative group">
                      <select 
                        required
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest appearance-none cursor-pointer group-hover:bg-black/80 shadow-inner"
                      >
                        <option value="">SELECT_TARGET_NODE</option>
                        {events?.filter(e => e.status === 'planning').map(event => (
                          <option key={event._id} value={event._id}>
                            {event.name.toUpperCase()} // {event.location.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Economic Value (BRL)</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-sm">R$</div>
                        <input 
                          type="number" 
                          required 
                          placeholder="0.00"
                          value={proposalValue}
                          onChange={(e) => setProposalValue(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-primary/50 transition-all font-black text-lg italic group-hover:bg-black/80 shadow-inner"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Integrity Status</label>
                      <div className="w-full h-[68px] bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3">
                        <ShieldCheck size={20} className="text-emerald-500 animate-pulse" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Technical Conditions & Specs</label>
                    <textarea 
                      rows={4}
                      placeholder="Input operational capacity, load distribution protocols, and regulatory compliance markers..."
                      value={proposalDesc}
                      onChange={(e) => setProposalDesc(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-8 text-white outline-none focus:border-primary/50 transition-all resize-none font-black text-sm italic group-hover:bg-black/80 shadow-inner"
                    ></textarea>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1 h-16 border border-white/5 text-white/20 font-black uppercase text-[10px] tracking-[0.4em] rounded-[1.5rem] hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setShowNewProposalModal(false)}
                    >
                      Abort Transmission
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-premium-primary h-16 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                    >
                      Transmit Dossier
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
