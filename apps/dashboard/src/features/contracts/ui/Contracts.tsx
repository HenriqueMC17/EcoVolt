import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  X,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  ArrowUpRight,
  Calendar,
  Building2,
  Zap,
  ShieldCheck,
  Terminal,
  Database,
  Lock,
  Cpu,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { Id } from "@/../convex/_generated/dataModel";
import { Typography } from '@/shared/ui/Typography';
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

const getStatusBadge = (status: string) => {
  const base = "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 transition-all duration-500 shadow-lg";
  switch (status) {
    case 'active': 
      return (
        <span className={cn(base, "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-emerald-400/5")}>
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE_NODE
        </span>
      );
    case 'completed': 
      return (
        <span className={cn(base, "text-blue-400 border-blue-400/20 bg-blue-400/5")}>
          <CheckCircle2 size={10} />
          EXECUTED
        </span>
      );
    case 'pending_signatures': 
      return (
        <span className={cn(base, "text-amber-400 border-amber-400/20 bg-amber-400/5")}>
          <Clock size={10} className="animate-spin [animation-duration:4s]" />
          AWAIT_SIG
        </span>
      );
    case 'draft': 
      return (
        <span className={cn(base, "text-slate-400 border-slate-400/20 bg-slate-400/5")}>
          <Terminal size={10} />
          DRAFT_INIT
        </span>
      );
    case 'terminated': 
      return (
        <span className={cn(base, "text-rose-400 border-rose-400/20 bg-rose-400/5 shadow-rose-400/5")}>
          <AlertTriangle size={10} />
          REVOKED
        </span>
      );
    default: 
      return <span className={cn(base, "text-slate-400 border-slate-400/20 bg-slate-400/5")}>{status.toUpperCase()}</span>;
  }
};

export const Contracts: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  
  const contracts = useQuery(api.contracts.getContracts, { 
    userEmail: user?.email || undefined 
  });
  const events = useQuery(api.events.getEvents);
  const companies = useQuery(api.companies.getCompanies);
  
  const createContract = useMutation(api.contracts.createContract);
  const updateContract = useMutation(api.contracts.updateContract);
  const removeContract = useMutation(api.contracts.removeContract);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContractId, setCurrentContractId] = useState<Id<"contracts"> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    eventId: '' as Id<"events"> | '',
    providerId: '' as Id<"companies"> | '',
    value: 0,
    ratePerKwh: 1.5,
    status: 'draft' as any
  });

  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    if (!searchQuery) return contracts;
    const query = searchQuery.toLowerCase();
    return contracts.filter(c => 
      c.event?.toLowerCase().includes(query) || 
      c.provider?.toLowerCase().includes(query) ||
      c._id.toLowerCase().includes(query)
    );
  }, [contracts, searchQuery]);

  const stats = useMemo(() => {
    if (!contracts) return { active: 0, pending: 0, value: 0 };
    return {
      active: contracts.filter(c => c.status === 'active').length,
      pending: contracts.filter(c => c.status === 'pending_signatures').length,
      value: contracts.reduce((acc, c) => acc + (c.value || 0), 0)
    };
  }, [contracts]);

  const resetForm = () => {
    setFormData({
      eventId: '',
      providerId: '',
      value: 0,
      ratePerKwh: 1.5,
      status: 'draft'
    });
    setIsEditing(false);
    setCurrentContractId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contract: any) => {
    setFormData({
      eventId: contract.eventId,
      providerId: contract.providerCompanyId,
      value: contract.value,
      ratePerKwh: contract.ratePerKwh || 1.5,
      status: contract.status
    });
    setIsEditing(true);
    setCurrentContractId(contract._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventId || !formData.providerId || formData.value <= 0) {
      showToast("Por favor, preencha todos os campos corretamente.", "error");
      return;
    }

    setIsSaving(true);
    try {
      if (!user) throw new Error("Usuário não autenticado.");

      const payload = {
        eventId: formData.eventId as Id<"events">,
        providerCompanyId: formData.providerId as Id<"companies">,
        clientCompanyId: user.companyId as Id<"companies">,
        value: formData.value,
        ratePerKwh: formData.ratePerKwh,
        status: formData.status,
        userEmail: user.email
      };

      if (isEditing && currentContractId) {
        await updateContract({ contractId: currentContractId, ...payload });
        showToast("Contrato atualizado com sucesso!", "success");
      } else {
        await createContract(payload);
        showToast("Contrato criado com sucesso!", "success");
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Erro ao salvar contrato.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"contracts">) => {
    if (window.confirm("Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.")) {
      try {
        if (!user) throw new Error("Usuário não autenticado.");
        await removeContract({ 
          contractId: id,
          userEmail: user.email
        });
        showToast("Contrato excluído com sucesso!", "success");
      } catch (error: any) {
        showToast(error.message || "Erro ao excluir contrato.", "error");
      }
    }
  };

  if (contracts === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
        <div className="p-8 glass-thick rounded-full border-primary/30 relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
        <Typography className="text-primary font-black tracking-[0.5em] uppercase text-[10px] animate-pulse">
          Decrypting Legal Database...
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
            <ShieldCheck size={12} className="text-primary animate-pulse" />
            <Typography className="text-[10px] font-black italic uppercase tracking-[0.5em] text-primary">
              Compliance & Legal Vault v2.1.4
            </Typography>
          </div>
          <Typography variant="h1" className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
            Digital <span className="text-primary glow-text">Trust</span> Protocol
          </Typography>
          <div className="flex items-center gap-4">
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Database size={14} className="text-primary/50" />
              SLA-LEVEL: EXTREME
            </Typography>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Lock size={14} className="text-primary/50" />
              AES-256 HASH VERIFIED
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <div className="glass-thick bg-neutral-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md hidden xl:flex items-center gap-6 mr-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Total Asset Value</span>
              <span className="text-lg font-black text-white italic tracking-tighter">R$ {stats.value.toLocaleString('pt-BR')}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Global Stability</span>
              <span className="text-lg font-black text-primary italic tracking-tighter">98.4%</span>
            </div>
          </div>
          
          {(user?.role === 'admin' || user?.role === 'event_company') && (
            <Button 
              onClick={handleOpenCreate}
              className="btn-premium-primary h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <Plus size={18} className="mr-2" />
              Protocolar Contrato
            </Button>
          )}
        </motion.div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Ativos & Vigentes', value: stats.active, icon: ShieldCheck, trend: '+12%', color: 'text-emerald-400' },
          { label: 'Aguardando Assinatura', value: stats.pending, icon: Clock, trend: 'AWAIT', color: 'text-amber-400' },
          { label: 'Eventos Cobertos', value: events?.length || 0, icon: Zap, trend: '100%', color: 'text-blue-400' },
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

      {/* Filters & Grid */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="glass-thick p-4 flex flex-wrap gap-4 items-center bg-neutral-900/40 backdrop-blur-xl relative z-10 overflow-hidden">
          <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
          
          <div className="relative flex-1 min-w-[300px] group/search">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-primary transition-all group-focus-within/search:scale-110" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="BUSCAR CTR_ID / PARCEIRO / EVENTO..." 
              className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 focus:bg-black/80 transition-all text-[11px] font-black tracking-widest uppercase text-white placeholder:text-white/10 shadow-inner"
            />
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" className="glass-thick border-white/5 h-14 px-8 text-white/60 font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl flex items-center gap-3 hover:text-primary hover:border-primary/30 transition-all">
              <Filter size={16} /> Filtros
            </Button>
            <Button variant="outline" className="glass-thick border-white/5 w-14 h-14 p-0 text-white/60 hover:text-primary hover:border-primary/30 transition-all rounded-2xl flex items-center justify-center">
              <Download size={18} />
            </Button>
          </div>
        </div>

        {/* Forensic Ledger Table */}
        <div className="glass-thick overflow-hidden border-t-4 border-primary relative group">
          <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Protocolo // Referência</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Ativo Estratégico</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Métricas & Capex</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-center">Status Hub</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-right">Governança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-50">
                        <Terminal size={48} className="text-white/10" />
                        <Typography variant="muted" className="italic font-black text-[10px] uppercase tracking-[0.3em]">No valid protocols detected in current directory.</Typography>
                      </div>
                    </td>
                  </tr>
                ) : filteredContracts.map((contract, i) => (
                  <tr key={contract._id} className="hover:bg-primary/5 group transition-all duration-500">
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-primary font-black uppercase tracking-tighter bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg group-hover:bg-primary/20 transition-all">
                            CTR-{new Date(contract.createdAt).getFullYear()}-{contract._id.substring(contract._id.length - 4).toUpperCase()}
                          </span>
                          <Typography className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest">
                            SHA-256 Verified
                          </Typography>
                        </div>
                        <Typography className="text-base font-black italic uppercase text-white group-hover:text-primary transition-colors">{contract.event}</Typography>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:border-primary/30 transition-all overflow-hidden relative">
                          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                          <span className="relative z-10">{contract.provider.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black italic text-white uppercase tracking-tight leading-tight">{contract.provider}</span>
                          <span className="text-[9px] text-primary/60 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Building2 size={10} /> FORNECEDOR HOMOLOGADO
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-black text-sm italic tracking-tighter">
                          <Zap size={14} className="text-primary group-hover:animate-bounce" />
                          {contract.energy || 'PROVISIONAL'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">VALOR:</span>
                          <span className="text-[11px] text-primary font-black italic tracking-tighter">R$ {contract.value.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-center">
                        {getStatusBadge(contract.status)}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-500">
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all"><Eye size={18} /></button>
                        {(user?.role === 'admin' || (user?.role === 'event_company' && user.companyId === contract.clientCompanyId)) && (
                          <button onClick={() => handleOpenEdit(contract)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all"><Edit size={18} /></button>
                        )}
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDelete(contract._id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-rose-500 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all"><Trash2 size={18} /></button>
                        )}
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all border border-primary/20"><ArrowUpRight size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-white/20 uppercase tracking-[0.4em] relative z-10">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Integrity Active</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Sync: 100%</span>
            </div>
            <div className="flex items-center gap-2">
              System Audit Status: <span className="text-primary">NOMINAL</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal - Enhanced Forensic HUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                      <Lock size={14} className="text-primary" />
                      <Typography className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Secure Protocol Input</Typography>
                    </div>
                    <Typography variant="h2" className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                      {isEditing ? 'Modify <span className="text-primary">Terms</span>' : 'Initialize <span className="text-primary">Protocol</span>'}
                    </Typography>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 border border-white/5 transition-all hover:rotate-90"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Strategic Asset</label>
                      <div className="relative group">
                        <select 
                          value={formData.eventId} 
                          onChange={e => setFormData({...formData, eventId: e.target.value as Id<"events">})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest appearance-none cursor-pointer group-hover:bg-black/80 shadow-inner"
                          required
                        >
                          <option value="">SELECT_ASSET</option>
                          {events?.map(event => (
                            <option key={event._id} value={event._id}>{event.name.toUpperCase()}</option>
                          ))}
                        </select>
                        <ArrowRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Strategic Partner</label>
                      <div className="relative group">
                        <select 
                          value={formData.providerId} 
                          onChange={e => setFormData({...formData, providerId: e.target.value as Id<"companies">})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest appearance-none cursor-pointer group-hover:bg-black/80 shadow-inner"
                          required
                        >
                          <option value="">SELECT_PARTNER</option>
                          {companies?.filter(c => c.type === 'provider').map(provider => (
                            <option key={provider._id} value={provider._id}>{provider.name.toUpperCase()}</option>
                          ))}
                        </select>
                        <ArrowRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Total Capex (BRL)</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-sm">R$</div>
                        <input 
                          type="number" 
                          value={formData.value || ''}
                          onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-primary/50 transition-all font-black text-lg group-hover:bg-black/80 shadow-inner"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Rate per kWh</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-sm">R$</div>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.ratePerKwh}
                          onChange={e => setFormData({...formData, ratePerKwh: Number(e.target.value)})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-primary/50 transition-all font-black text-lg group-hover:bg-black/80 shadow-inner"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Liquidation Protocol Hub</label>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { id: 'draft', label: 'DRAFT' },
                        { id: 'pending_signatures', label: 'SIGN' },
                        { id: 'active', label: 'ACTIVE' },
                        { id: 'completed', label: 'DONE' },
                        { id: 'terminated', label: 'VOID' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setFormData({...formData, status: s.id})}
                          className={cn(
                            "py-4 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all shadow-lg",
                            formData.status === s.id 
                              ? "bg-primary text-black border-primary shadow-primary/20" 
                              : "bg-black/40 border-white/5 text-white/20 hover:border-white/20 hover:text-white"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-16 border border-white/5 text-white/20 font-black uppercase text-[10px] tracking-[0.4em] rounded-[1.5rem] hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Abort Protocol
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-[1.5] h-16 btn-premium-primary rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                      loading={isSaving}
                    >
                      <span className="flex items-center gap-3">
                        <ShieldCheck size={20} className="group-hover:animate-bounce" />
                        {isEditing ? 'Patch Legal Node' : 'Initialize Trust Protocol'}
                      </span>
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
