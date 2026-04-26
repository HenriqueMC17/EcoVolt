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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { Id } from "@/../convex/_generated/dataModel";
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils';

// Stagger variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const getStatusBadge = (status: string) => {
  const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300";
  switch (status) {
    case 'active': 
      return <span className={cn(base, "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_12px_-2px_rgba(52,211,153,0.1)]")}>Ativo</span>;
    case 'completed': 
      return <span className={cn(base, "text-blue-400 border-blue-400/20 bg-blue-400/5")}>Finalizado</span>;
    case 'pending_signatures': 
      return <span className={cn(base, "text-amber-400 border-amber-400/20 bg-amber-400/5")}>Assinatura</span>;
    case 'draft': 
      return <span className={cn(base, "text-slate-400 border-slate-400/20 bg-slate-400/5")}>Rascunho</span>;
    case 'terminated': 
      return <span className={cn(base, "text-rose-400 border-rose-400/20 bg-rose-400/5")}>Rescindido</span>;
    default: 
      return <span className={cn(base, "text-slate-400 border-slate-400/20 bg-slate-400/5")}>{status}</span>;
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Compliance & Legal</span>
          </div>
          <Typography variant="h1" className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Gestão de <span className="text-gradient">Contratos</span>
          </Typography>
          <Typography variant="muted" className="max-w-xl text-lg">
            Monitoramento em tempo real de obrigações contratuais, SLAs de entrega e validade jurídica para o ecossistema energético.
          </Typography>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Saldo Contratado</span>
            <span className="text-xl font-black text-white">R$ {stats.value.toLocaleString('pt-BR')}</span>
          </div>
          {(user?.role === 'admin' || user?.role === 'event_company') && (
            <button className="btn-premium-primary" onClick={handleOpenCreate}>
              <Plus size={18} />
              Novo Contrato
            </button>
          )}
        </div>
      </motion.header>

      {/* Premium Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Ativos & Vigentes', value: stats.active, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: '+12% este mês' },
          { label: 'Aguardando Assinatura', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', trend: 'Média 3.2 dias' },
          { label: 'Eventos Cobertos', value: events?.length || 0, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '100% de cobertura' },
        ].map((stat, i) => (
          <div key={i} className="glass-card group flex flex-col gap-4 relative overflow-hidden">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity", stat.bg)}></div>
            <div className="flex items-start justify-between">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner", stat.bg, stat.color)}>
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
            <div>
              <Typography variant="h3" className="text-4xl font-black mb-1">{stat.value}</Typography>
              <Typography variant="muted" className="text-[10px] uppercase tracking-[0.2em] font-black">{stat.label}</Typography>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="glass-card flex flex-col md:flex-row gap-4 items-center !p-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por ID, Evento ou Provedor..." 
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50 font-medium"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest text-text-muted hover:text-white">
            <Filter size={16} />
            Filtros Avançados
          </button>
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-text-muted hover:text-primary">
            <Download size={18} />
          </button>
        </div>
      </motion.div>

      {/* Contracts Table */}
      <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden relative border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Referência / Escopo</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Parceiro Estratégico</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Volume & Capex</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contracts === undefined ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Sincronizando Dados...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <FileText size={48} className="text-text-muted" />
                      <Typography variant="muted" className="italic">Nenhum contrato localizado no diretório atual.</Typography>
                    </div>
                  </td>
                </tr>
              ) : filteredContracts.map((contract, i) => (
                <motion.tr 
                  key={contract._id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                  className="hover:bg-white/[0.04] transition-all duration-300 group cursor-default"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-primary font-black uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
                          CTR-{new Date(contract.createdAt).getFullYear()}-{contract._id.substring(contract._id.length - 4).toUpperCase()}
                        </span>
                        <Calendar size={12} className="text-text-muted" />
                      </div>
                      <Typography variant="h4" className="text-base font-bold group-hover:text-primary transition-colors">{contract.event}</Typography>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:border-primary/30 transition-all">
                        {contract.provider.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">{contract.provider}</span>
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                          <Building2 size={10} /> Fornecedor Homologado
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-white font-black text-sm mb-1">
                        <Zap size={14} className="text-secondary" />
                        {contract.energy}
                      </div>
                      <span className="text-xs text-text-muted font-medium">
                        Investimento: <span className="text-white">R$ {contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      {(user?.role === 'admin' || (user?.role === 'event_company' && user.companyId === contract.clientCompanyId)) && (
                        <button 
                          onClick={() => handleOpenEdit(contract)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-text-muted hover:text-primary transition-all shadow-lg"
                          title="Editar Termos"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => handleDelete(contract._id)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/50 text-text-muted hover:text-rose-400 transition-all shadow-lg"
                          title="Revogar Contrato"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black transition-all shadow-lg shadow-primary/10">
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal - Enhanced */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-xl glass p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Modal Glow Accent */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-1 bg-primary rounded-full"></span>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Formalização Digital</span>
                    </div>
                    <Typography variant="h2" className="text-3xl font-black">{isEditing ? 'Revisar Contrato' : 'Novo Instrumento'}</Typography>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 rounded-full bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Calendar size={12} className="text-primary" /> Evento Relacionado
                      </label>
                      <select 
                        value={formData.eventId} 
                        onChange={e => setFormData({...formData, eventId: e.target.value as Id<"events">})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 transition-all font-bold appearance-none"
                        required
                      >
                        <option value="" className="bg-bg-main">Selecione o ativo...</option>
                        {events?.map(event => (
                          <option key={event._id} value={event._id} className="bg-bg-main">{event.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Building2 size={12} className="text-primary" /> Provedor Estratégico
                      </label>
                      <select 
                        value={formData.providerId} 
                        onChange={e => setFormData({...formData, providerId: e.target.value as Id<"companies">})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 transition-all font-bold appearance-none"
                        required
                      >
                        <option value="" className="bg-bg-main">Selecione o parceiro...</option>
                        {companies?.filter(c => c.type === 'provider').map(provider => (
                          <option key={provider._id} value={provider._id} className="bg-bg-main">{provider.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Capex Total (R$)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">R$</span>
                        <input 
                          type="number" 
                          value={formData.value || ''}
                          onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-primary/50 transition-all font-black text-xl"
                          placeholder="0,00"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Taxa p/ kWh (R$)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">R$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.ratePerKwh}
                          onChange={e => setFormData({...formData, ratePerKwh: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-primary/50 transition-all font-black text-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Protocolo de Status</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { id: 'draft', label: 'Draft' },
                        { id: 'pending_signatures', label: 'Sign' },
                        { id: 'active', label: 'Active' },
                        { id: 'completed', label: 'Done' },
                        { id: 'terminated', label: 'Void' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setFormData({...formData, status: s.id})}
                          className={cn(
                            "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.status === s.id 
                              ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                              : "bg-white/5 border-white/10 text-text-muted hover:bg-white/10"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-text-muted"
                    >
                      Descartar Alterações
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-[1.5] btn-premium-primary justify-center !rounded-2xl !py-4 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)]"
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <span className="flex items-center gap-3">
                          <ShieldCheck size={20} />
                          {isEditing ? 'Confirmar Atualização' : 'Protocolar Contrato'}
                        </span>
                      )}
                    </button>
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

