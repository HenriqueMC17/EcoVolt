import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { Id } from "@/../convex/_generated/dataModel";
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': 
      return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-emerald-400 border-emerald-400/20 bg-emerald-400/5">Ativo</span>;
    case 'completed': 
      return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-blue-400 border-blue-400/20 bg-blue-400/5">Finalizado</span>;
    case 'pending_signatures': 
      return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-amber-400 border-amber-400/20 bg-amber-400/5">Aguardando Assinatura</span>;
    case 'draft': 
      return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-slate-400 border-slate-400/20 bg-slate-400/5">Rascunho</span>;
    case 'terminated': 
      return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-rose-400 border-rose-400/20 bg-rose-400/5">Rescindido</span>;
    default: 
      return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-slate-400 border-slate-400/20 bg-slate-400/5">{status}</span>;
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

  const [formData, setFormData] = useState({
    eventId: '' as Id<"events"> | '',
    providerId: '' as Id<"companies"> | '',
    value: 0,
    ratePerKwh: 1.5,
    status: 'draft' as any
  });

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
    <div className="space-y-8 animate-orchestrated">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2" className="text-3xl mb-1">Gestão de Contratos</Typography>
          <Typography variant="muted">Gerencie a camada jurídica e operacional dos seus serviços de energia.</Typography>
        </div>
        {(user?.role === 'admin' || user?.role === 'event_company') && (
          <button className="btn-premium-primary" onClick={handleOpenCreate}>
            <FileText size={18} />
            Novo Contrato
          </button>
        )}
      </header>

      {/* Filters & Search */}
      <div className="glass-card flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por ID, evento ou provedor..." 
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
            <Filter size={16} />
            Filtros
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Contracts Grid/Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">ID / Evento</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Provedor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Energia / Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contracts === undefined ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              ) : contracts.map((contract) => (
                <tr key={contract._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-[10px] text-primary font-black uppercase mb-1 tracking-tighter">
                      CTR-{new Date(contract.createdAt).getFullYear()}-{contract._id.substring(contract._id.length - 4).toUpperCase()}
                    </p>
                    <Typography variant="h4" className="text-sm">{contract.event}</Typography>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-primary">
                        {contract.provider.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{contract.provider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold">{contract.energy}</p>
                    <p className="text-xs text-text-muted">
                      Total: R$ {contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(user?.role === 'admin' || (user?.role === 'event_company' && user.companyId === contract.clientCompanyId)) && (
                        <button 
                          onClick={() => handleOpenEdit(contract)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 text-text-muted hover:text-primary transition-all"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => handleDelete(contract._id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-rose-500/50 text-text-muted hover:text-rose-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/50 text-text-muted hover:text-secondary transition-all">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Contratos Ativos', value: contracts ? contracts.filter(c => c.status === 'active').length : 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Aguardando Retorno', value: contracts ? contracts.filter(c => c.status === 'pending_signatures').length : 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Contratos em Litígio', value: 0, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card flex items-center gap-6">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <Typography variant="muted" className="text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</Typography>
              <Typography variant="h3" className="text-2xl font-bold">{stat.value}</Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card p-8 border border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h3">{isEditing ? 'Editar Contrato' : 'Novo Contrato'}</Typography>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Evento Relacionado</label>
                  <select 
                    value={formData.eventId} 
                    onChange={e => setFormData({...formData, eventId: e.target.value as Id<"events">})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                    required
                  >
                    <option value="" className="bg-bg-main">Selecione um evento...</option>
                    {events?.map(event => (
                      <option key={event._id} value={event._id} className="bg-bg-main">{event.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Provedor de Energia</label>
                  <select 
                    value={formData.providerId} 
                    onChange={e => setFormData({...formData, providerId: e.target.value as Id<"companies">})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                    required
                  >
                    <option value="" className="bg-bg-main">Selecione um provedor...</option>
                    {companies?.filter(c => c.type === 'provider').map(provider => (
                      <option key={provider._id} value={provider._id} className="bg-bg-main">{provider.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Valor (R$)</label>
                    <input 
                      type="number" 
                      value={formData.value || ''}
                      onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                      placeholder="Ex: 5000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Taxa p/ kWh (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.ratePerKwh}
                      onChange={e => setFormData({...formData, ratePerKwh: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                    required
                  >
                    <option value="draft" className="bg-bg-main">Rascunho</option>
                    <option value="pending_signatures" className="bg-bg-main">Aguardando Assinatura</option>
                    <option value="active" className="bg-bg-main">Ativo</option>
                    <option value="completed" className="bg-bg-main">Finalizado</option>
                    <option value="terminated" className="bg-bg-main">Rescindido</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 btn-premium-primary justify-center"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : isEditing ? 'Atualizar' : 'Criar Contrato'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
