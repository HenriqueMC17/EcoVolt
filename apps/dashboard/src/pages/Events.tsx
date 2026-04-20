import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  MoreVertical, 
  MapPin, 
  Users, 
  Zap, 
  Link as LinkIcon,
  Copy,
  Archive,
  Edit,
  ExternalLink,
  Loader2,
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../context/ToastContext";
import { Id } from "../../convex/_generated/dataModel";

import { useUser } from '../context/UserContext';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'completed': return { color: '#4ade80', bg: 'rgba(34, 197, 94, 0.1)', label: 'Finalizado' };
    case 'active': return { color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.1)', label: 'Ativo' };
    case 'cancelled': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Cancelado' };
    case 'planning': return { color: '#94a3b8', bg: 'rgba(100, 116, 139, 0.1)', label: 'Planejamento' };
    default: return { color: 'white', bg: 'rgba(255, 255, 255, 0.1)', label: status };
  }
};

const getSizeFromAttendees = (attendees: number) => {
  if (attendees < 1000) return 'Pequeno';
  if (attendees < 5000) return 'Médio';
  if (attendees < 15000) return 'Grande';
  return 'Extra G';
};

const Events: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const events = useQuery(api.events.getEvents, { 
    userEmail: user?.email || undefined 
  });
  const companies = useQuery(api.companies.getCompanies);
  
  const createEvent = useMutation(api.events.createEvent);
  const updateEvent = useMutation(api.events.updateEvent);
  const removeEvent = useMutation(api.events.removeEvent);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<Id<"events"> | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'cancelled',
    startDate: '',
    endDate: '',
    location: '',
    expectedAttendees: 0,
    estimatedConsumption: 0,
    companyId: '' as Id<"companies"> | ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      location: '',
      expectedAttendees: 0,
      estimatedConsumption: 0,
      companyId: user?.companyId || '' as any
    });
    setIsEditing(false);
    setCurrentEventId(null);
  };

  const handleOpenCreate = () => {
    if (user?.role !== 'event_company' && user?.role !== 'admin') {
      showToast('Apenas organizadores podem criar eventos.', 'error');
      return;
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: any) => {
    if (user?.role !== 'admin' && user?.companyId !== event.companyId) {
      showToast('Você não tem permissão para editar este evento.', 'error');
      return;
    }
    setFormData({
      name: event.name,
      status: event.status,
      startDate: new Date(event.startDate).toISOString().split('T')[0],
      endDate: new Date(event.endDate).toISOString().split('T')[0],
      location: event.location,
      expectedAttendees: event.expectedAttendees,
      estimatedConsumption: event.estimatedConsumption,
      companyId: event.companyId
    });
    setIsEditing(true);
    setCurrentEventId(event._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyId || !user?.email) {
      showToast('Por favor, verifique os dados.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        startDate: new Date(formData.startDate).getTime(),
        endDate: new Date(formData.endDate).getTime(),
        location: formData.location,
        expectedAttendees: Number(formData.expectedAttendees),
        estimatedConsumption: Number(formData.estimatedConsumption),
        companyId: formData.companyId as Id<"companies">,
        userEmail: user.email
      };

      if (isEditing && currentEventId) {
        await updateEvent({ eventId: currentEventId, ...payload });
        showToast('Evento atualizado com sucesso!', 'success');
      } else {
        await createEvent(payload);
        showToast('Evento criado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar evento.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"events">, eventCompanyId: string) => {
    if (user?.role !== 'admin' && user?.companyId !== eventCompanyId) {
      showToast('Você não tem permissão para excluir este evento.', 'error');
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
      try {
        await removeEvent({ 
          eventId: id,
          userEmail: user!.email
        });
        showToast('Evento excluído com sucesso!', 'success');
      } catch (error: any) {
        showToast(error.message || 'Erro ao excluir evento.', 'error');
      }
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Gerenciamento de Eventos</h2>
          <p style={{ color: 'var(--text-muted)' }}>Crie, acompanhe e gerencie a infraestrutura energética de todos os seus eventos.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Novo Evento</span>
        </button>
      </header>

      <div className="card glass" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome, local ou empresa..." 
            style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px 10px 40px', color: 'white', outline: 'none' }}
          />
        </div>
        <select style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 12px', color: 'white' }}>
          <option>Todos os Status</option>
          <option>Planejamento</option>
          <option>Ativo</option>
          <option>Finalizado</option>
        </select>
      </div>

      {events === undefined ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Nenhum evento encontrado.</p>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Criar o Primeiro Evento</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {events.map((event) => {
            const style = getStatusStyle(event.status);
            return (
              <motion.div 
                key={event._id} 
                className="card"
                whileHover={{ scale: 1.01 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: 'var(--bg-surface-elevated)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Calendar size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px' }}>{event.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Organizado por: <span style={{ color: 'white' }}>{event.companyName}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleOpenEdit(event)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDelete(event._id, event.companyId)}
                      style={{ color: '#fb7185' }}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={16} />
                    {event.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Users size={16} />
                    Porte: {getSizeFromAttendees(event.expectedAttendees)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Zap size={16} />
                    {event.estimatedConsumption} kWh
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={16} />
                    {new Date(event.startDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border)' 
                }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: style.color, 
                    background: style.bg 
                  }}>
                    {style.label}
                  </span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline" style={{ padding: '6px', borderRadius: '8px' }} title="Detalhes"><ExternalLink size={16} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Criar/Editar Evento */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card glass"
              style={{ width: '100%', maxWidth: '600px', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {isEditing ? 'Editar Evento' : 'Novo Evento'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nome do Evento</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                    placeholder="Ex: Rock in Rio 2026"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Empresa Organizadora</label>
                    <select 
                      value={formData.companyId} 
                      onChange={e => setFormData({...formData, companyId: e.target.value as Id<"companies">})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      required
                    >
                      <option value="">Selecione...</option>
                      {companies?.filter(c => c.type === 'client').map(company => (
                        <option key={company._id} value={company._id}>{company.name}</option>
                      ))}
                    </select>
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
                      <option value="planning">Planejamento</option>
                      <option value="active">Ativo</option>
                      <option value="completed">Finalizado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Data de Início</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Data de Término</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Localização</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                    placeholder="Cidade, Estado ou Local Específico"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Público Esperado</label>
                    <input 
                      type="number" 
                      value={formData.expectedAttendees || ''}
                      onChange={e => setFormData({...formData, expectedAttendees: Number(e.target.value)})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      placeholder="Ex: 50000"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consumo Estimado (kWh)</label>
                    <input 
                      type="number" 
                      value={formData.estimatedConsumption || ''}
                      onChange={e => setFormData({...formData, estimatedConsumption: Number(e.target.value)})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      placeholder="Ex: 15000"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : isEditing ? 'Atualizar Evento' : 'Criar Evento'}
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

export default Events;
