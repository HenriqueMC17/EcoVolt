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
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../context/ToastContext";
import { useUser } from "../context/UserContext";
import { Id } from "../../convex/_generated/dataModel";


const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return <span className="badge badge-success">Ativo</span>;
    case 'completed': return <span className="badge badge-info">Finalizado</span>;
    case 'pending_signatures': return <span className="badge badge-warning">Aguardando Assinatura</span>;
    case 'draft': return <span className="badge" style={{ background: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8' }}>Rascunho</span>;
    case 'terminated': return <span className="badge badge-error">Rescindido</span>;
    default: return <span className="badge">{status}</span>;
  }
};

const Contracts: React.FC = () => {
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
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Gestão de Contratos</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie a camada jurídica e operacional dos seus serviços de energia.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'event_company') && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <FileText size={18} />
            Novo Contrato
          </button>
        )}
      </header>

      {/* Filters & Search */}
      <div className="card glass" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por ID, evento ou provedor..." 
            style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px 10px 40px', color: 'white', outline: 'none' }}
          />
        </div>
        <button className="btn btn-outline" style={{ padding: '8px 16px' }}>
          <Filter size={18} />
          Filtros
        </button>
        <button className="btn btn-outline" style={{ padding: '8px 16px' }}>
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Contracts Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ID / EVENTO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>PROVEDOR</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ENERGIA / VALOR</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {contracts === undefined ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={24} color="var(--primary)" style={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhum contrato encontrado.
                </td>
              </tr>
            ) : contracts.map((contract) => (
              <tr key={contract._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }} className="table-row-hover">
                <td style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                    CTR-{new Date(contract.createdAt).getFullYear()}-{contract._id.substring(contract._id.length - 4).toUpperCase()}
                  </p>
                  <p style={{ fontWeight: 600 }}>{contract.event}</p>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                      {contract.provider.charAt(0)}
                    </div>
                    <span>{contract.provider}</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <p style={{ fontWeight: 600 }}>{contract.energy}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total: R$ {contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                    Taxa: R$ {contract.ratePerKwh.toFixed(2)}/kWh
                  </p>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  {getStatusBadge(contract.status)}
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(user?.role === 'admin' || (user?.role === 'event_company' && user.companyId === contract.clientCompanyId)) && (
                      <>
                        <button className="btn-icon" onClick={() => handleOpenEdit(contract)} title="Editar">
                          <Edit size={18} />
                        </button>
                      </>
                    )}
                    {user?.role === 'admin' && (
                      <button className="btn-icon" onClick={() => handleDelete(contract._id)} style={{ color: '#fb7185' }} title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button className="btn-icon" title="Ver Detalhes">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="card glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contratos Ativos</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {contracts ? contracts.filter(c => c.status === 'active').length : 0}
            </p>
          </div>
        </div>
        <div className="card glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Clock size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aguardando Retorno</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {contracts ? contracts.filter(c => c.status === 'pending_signatures').length : 0}
            </p>
          </div>
        </div>
        <div className="card glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contratos em Litígio</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>0</p>
          </div>
        </div>
      </div>

      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
      `}</style>

      {/* Modal Novo/Editar Contrato */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card glass"
              style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {isEditing ? 'Editar Contrato' : 'Novo Contrato'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Evento Relacionado</label>
                  <select 
                    value={formData.eventId} 
                    onChange={e => setFormData({...formData, eventId: e.target.value as Id<"events">})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                    required
                  >
                    <option value="">Selecione um evento...</option>
                    {events?.map(event => (
                      <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Provedor de Energia</label>
                  <select 
                    value={formData.providerId} 
                    onChange={e => setFormData({...formData, providerId: e.target.value as Id<"companies">})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                    required
                  >
                    <option value="">Selecione um provedor...</option>
                    {companies?.filter(c => c.type === 'provider').map(provider => (
                      <option key={provider._id} value={provider._id}>{provider.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valor (R$)</label>
                    <input 
                      type="number" 
                      value={formData.value || ''}
                      onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      placeholder="Ex: 5000"
                      required
                      min="1"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Taxa por kWh (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.ratePerKwh}
                      onChange={e => setFormData({...formData, ratePerKwh: Number(e.target.value)})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      placeholder="Ex: 1.50"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      required
                    >
                      <option value="draft">Rascunho</option>
                      <option value="pending_signatures">Aguardando Assinatura</option>
                      <option value="active">Ativo</option>
                      <option value="completed">Finalizado</option>
                      <option value="terminated">Rescindido</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving || !events || !companies}>
                    {isSaving ? 'Salvando...' : isEditing ? 'Atualizar Contrato' : 'Criar Contrato'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contracts;
