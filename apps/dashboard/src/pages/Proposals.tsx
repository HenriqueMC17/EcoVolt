import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
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
  ArrowRight
} from 'lucide-react';

const Proposals: React.FC = () => {
  const { user } = useUser();
  const { addToast } = useToast();
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
      addToast('Proposta enviada com sucesso!', 'success');
      setShowNewProposalModal(false);
      resetForm();
    } catch (error) {
      addToast('Erro ao enviar proposta.', 'error');
    }
  };

  const handleAccept = async (id: any) => {
    if (!user?.email) return;
    try {
      await acceptProposal({ 
        proposalId: id,
        userEmail: user.email 
      });
      addToast('Proposta aceita! Contrato gerado.', 'success');
    } catch (error) {
      addToast('Erro ao aceitar proposta.', 'error');
    }
  };

  const handleReject = async (id: any) => {
    if (!user?.email) return;
    try {
      await rejectProposal({ 
        proposalId: id,
        userEmail: user.email
      });
      addToast('Proposta recusada.', 'info');
    } catch (error) {
      addToast('Erro ao recusar proposta.', 'error');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceita';
      case 'rejected': return 'Recusada';
      default: return 'Pendente';
    }
  };

  return (
    <div className="proposals-container">
      <header className="page-header">
        <div>
          <h1>Gestão de Propostas</h1>
          <p className="subtitle">Acompanhe e gerencie propostas comerciais de energia</p>
        </div>
        
        <div className="header-actions">
          {user?.role === 'provider' && (
            <button 
              className="btn-primary"
              onClick={() => setShowNewProposalModal(true)}
            >
              <Plus size={18} /> Nova Proposta
            </button>
          )}
        </div>
      </header>

      <section className="stats-overview">
        <div className="stat-card glass">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pendentes</span>
            <span className="stat-value">
              {allProposals?.filter(p => p.status === 'pending').length || 0}
            </span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Aceitas</span>
            <span className="stat-value">
              {allProposals?.filter(p => p.status === 'accepted').length || 0}
            </span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total</span>
            <span className="stat-value">{allProposals?.length || 0}</span>
          </div>
        </div>
      </section>

      <div className="content-filters glass">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por evento ou fornecedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="accepted">Aceita</option>
            <option value="rejected">Recusada</option>
          </select>
        </div>
      </div>

      <div className="proposals-grid">
        {!filteredProposals ? (
          <div className="loading-state">Carregando propostas...</div>
        ) : filteredProposals.length === 0 ? (
          <div className="empty-state card glass">
            <FileText size={48} opacity={0.5} />
            <p>Nenhuma proposta encontrada.</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div key={proposal._id} className="proposal-card glass">
              <div className="proposal-header">
                <div className="proposal-main-info">
                  <h3>{proposal.eventName}</h3>
                  <div className="provider-info">
                    <Building2 size={14} />
                    <span>{proposal.providerName}</span>
                  </div>
                </div>
                <div 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(proposal.status)}20`,
                    color: getStatusColor(proposal.status)
                  }}
                >
                  {getStatusIcon(proposal.status)}
                  <span>{translateStatus(proposal.status)}</span>
                </div>
              </div>

              <div className="proposal-details">
                <div className="detail-item">
                  <DollarSign size={14} />
                  <span>Valor: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}</strong></span>
                </div>
                <div className="detail-item">
                  <Calendar size={14} />
                  <span>Enviada em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {proposal.description && (
                <div className="proposal-description">
                  <p>{proposal.description}</p>
                </div>
              )}

              <div className="proposal-actions">
                {user?.role === 'event_company' && proposal.status === 'pending' && (
                  <>
                    <button 
                      className="btn-outline btn-sm btn-danger"
                      onClick={() => handleReject(proposal._id)}
                    >
                      Recusar
                    </button>
                    <button 
                      className="btn-primary btn-sm"
                      onClick={() => handleAccept(proposal._id)}
                    >
                      Aceitar Proposta
                    </button>
                  </>
                )}
                
                {proposal.status === 'accepted' && (
                  <button className="btn-ghost btn-sm" onClick={() => window.location.href='/contratos'}>
                    Ver Contrato <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nova Proposta */}
      {showNewProposalModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>Nova Proposta Comercial</h2>
              <button className="btn-close" onClick={() => setShowNewProposalModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateProposal}>
              <div className="form-group">
                <label>Selecione o Evento</label>
                <select 
                  required
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  <option value="">Selecione um evento...</option>
                  {events?.filter(e => e.status === 'planning').map(event => (
                    <option key={event._id} value={event._id}>
                      {event.name} ({event.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Valor da Proposta (R$)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="0,00"
                  value={proposalValue}
                  onChange={(e) => setProposalValue(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Descrição / Observações</label>
                <textarea 
                  rows={4}
                  placeholder="Detalhes sobre o fornecimento de energia, prazos e condições..."
                  value={proposalDesc}
                  onChange={(e) => setProposalDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-outline"
                  onClick={() => setShowNewProposalModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Enviar Proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .proposals-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-radius: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .content-filters {
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-box input {
          background: none;
          border: none;
          color: white;
          width: 100%;
          outline: none;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-group select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          outline: none;
        }

        .proposals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .proposal-card {
          padding: 24px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .proposal-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(255, 255, 255, 0.04);
        }

        .proposal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .proposal-main-info h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .provider-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 4px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .proposal-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .proposal-description {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .proposal-actions {
          display: flex;
          gap: 12px;
          margin-top: auto;
          padding-top: 12px;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 0.875rem;
          flex: 1;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .btn-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-group input, .form-group select, .form-group textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px;
          border-radius: 12px;
          outline: none;
        }

        .modal-footer {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }

        .modal-footer button {
          flex: 1;
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px;
          gap: 16px;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Proposals;
