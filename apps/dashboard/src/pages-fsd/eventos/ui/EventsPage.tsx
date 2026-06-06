"use client";

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  MapPin, 
  Users, 
  Zap, 
  Edit, 
  Trash2, 
  X,
  Loader2,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useQuery, useMutation, MockEvent, MockCompany } from "@/shared/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useRouter } from 'next/navigation';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

// --- Types & Constants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const }
  }
};

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'completed': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Finalizado', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' };
    case 'active': return { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', label: 'Operação Ativa', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]' };
    case 'cancelled': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Descontinuado', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]' };
    case 'planning': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Planejamento', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]' };
    default: return { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', label: status, glow: '' };
  }
};

const getSizeFromAttendees = (attendees: number) => {
  if (attendees < 1000) return { label: 'Boutique', color: 'text-purple-400' };
  if (attendees < 5000) return { label: 'Standard', color: 'text-primary' };
  if (attendees < 15000) return { label: 'Enterprise', color: 'text-emerald-400' };
  return { label: 'Mega Event', color: 'text-rose-400' };
};

// --- Components ---

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: string;
  color: string;
  glowColor: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color, glowColor }: StatCardProps) => (
  <motion.div 
    variants={itemVariants}
    className="glass-card relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
  >
    {/* Animated background glow */}
    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${glowColor}`} />
    
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-black/40 border border-white/10 text-white/40 group-hover:text-primary group-hover:border-primary/30 transition-all duration-500 shadow-xl`}>
          <Icon size={22} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full backdrop-blur-md">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <Typography className="text-[10px] font-black tracking-[0.25em] text-white/40 uppercase">
          {title}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography className="text-3xl font-bold text-white tracking-tighter">
            {value}
          </Typography>
        </div>
      </div>

      <div className={`mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden`}>
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  </motion.div>
);

export const EventsPage: React.FC = () => {
  const router = useRouter();
  
  const user = useQuery(api.users.getMe, {}); 
  
  const events = useQuery(
    api.events.getEvents, 
    user?.email ? { userEmail: user.email } : 'skip'
  );
  const companies = useQuery(
    api.companies.getCompanies,
    user?.email ? { userEmail: user.email } : 'skip'
  );
  
  const createEvent = useMutation(api.events.createEvent);
  const updateEvent = useMutation(api.events.updateEvent);
  const removeEvent = useMutation(api.events.removeEvent);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<Id<"events"> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
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

  const showToast = (msg: string, _type?: string) => alert(msg); // Placeholder

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      location: '',
      expectedAttendees: 0,
      estimatedConsumption: 0,
      companyId: (user?.companyId || '') as Id<"companies"> | ''
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

  const handleOpenEdit = (event: MockEvent) => {
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
      companyId: event.companyId as Id<"companies">
    });
    setIsEditing(true);
    setCurrentEventId(event._id as Id<"events">);
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
    } catch (error) {
      showToast((error as Error).message || 'Erro ao salvar evento.', 'error');
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
      } catch (error) {
        showToast((error as Error).message || 'Erro ao excluir evento.', 'error');
      }
    }
  };

  const stats = useMemo(() => {
    if (!events) return { total: 0, active: 0, consumption: 0, attendees: 0 };
    return {
      total: events.length,
      active: events.filter((e: MockEvent) => e.status === 'active').length,
      consumption: events.reduce((acc: number, curr: MockEvent) => acc + (curr.estimatedConsumption || 0), 0),
      attendees: events.reduce((acc: number, curr: MockEvent) => acc + (curr.expectedAttendees || 0), 0),
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events?.filter((event: MockEvent) => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-20 animate-luxury"
    >
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-primary flex items-center justify-center text-black shadow-lg">
                <Globe size={18} />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-black bg-black/40 flex items-center justify-center text-white/40 shadow-lg">
                <Activity size={18} />
              </div>
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
              Operations Center
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none italic">
            Managed <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Events</span>
          </Typography>
          <Typography variant="p" className="text-white/60 font-medium tracking-wide max-w-xl">
            Orquestração de infraestrutura de alto impacto e eficiência energética para grandes operações.
          </Typography>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button onClick={handleOpenCreate} className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px]">
            <Plus className="w-5 h-5 mr-3" />
            Provisionar Operação
          </Button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total de Operações" 
          value={stats.total} 
          icon={Globe} 
          color="from-primary to-teal-400"
          glowColor="from-primary/20"
        />
        <StatCard 
          title="Eventos em Atividade" 
          value={stats.active} 
          icon={Activity} 
          trend="+12%"
          color="from-emerald-400 to-emerald-600"
          glowColor="from-emerald-500/20"
        />
        <StatCard 
          title="Consumo Estimado" 
          value={`${(stats.consumption / 1000).toFixed(1)} MWh`} 
          icon={Zap} 
          color="from-amber-400 to-orange-500"
          glowColor="from-amber-500/20"
        />
        <StatCard 
          title="Alcance de Público" 
          value={stats.attendees.toLocaleString()} 
          icon={Users} 
          color="from-purple-400 to-pink-500"
          glowColor="from-purple-500/20"
        />
      </div>

      {/* Action Bar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-5 items-center bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por operação, local ou entidade..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none rounded-full py-4 pl-14 pr-4 text-white placeholder-white/40 outline-none focus:ring-0 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto pr-2">
          <div className="relative flex-1 md:w-64 group">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full py-4 pl-12 pr-10 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none cursor-pointer font-medium text-sm"
            >
              <option value="all">Filtro: Global</option>
              <option value="planning">Status: Planejamento</option>
              <option value="active">Status: Em Operação</option>
              <option value="completed">Status: Finalizado</option>
              <option value="cancelled">Status: Descontinuado</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-primary transition-colors">
              <ArrowRight size={14} className="rotate-90" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Content */}
      <div className="relative">
        {events === undefined ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full animate-pulse" />
              <Loader2 className="w-16 h-16 text-primary animate-spin relative" />
            </div>
            <div className="text-center space-y-2">
              <Typography className="text-white font-bold text-xl tracking-tight">Sincronizando Ecossistema</Typography>
              <Typography className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px]">Aguardando Resposta do Protocolo...</Typography>
            </div>
          </div>
        ) : filteredEvents?.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="glass-card flex flex-col items-center justify-center py-40 text-center border-dashed border-white/10"
          >
            <div className="w-28 h-28 bg-black/40 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors" />
              <Calendar className="w-12 h-12 text-white/40 relative group-hover:text-white/60 transition-colors" />
            </div>
            <Typography variant="h3" className="text-3xl font-bold text-white mb-3 tracking-tight">
              Nenhum Registro Localizado
            </Typography>
            <Typography className="text-white/40 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
              {searchQuery ? `Não existem operações vinculadas ao termo "${searchQuery}" nesta camada de dados.` : "O protocolo de eventos está vazio. Inicie um novo provisionamento para monitorar sua infraestrutura."}
            </Typography>
            {!searchQuery && (
              <Button onClick={handleOpenCreate} className="rounded-full h-14 px-10 text-[10px] font-black uppercase tracking-widest">
                Ativar Provisionamento
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents?.map((event: MockEvent) => {
                const status = getStatusDetails(event.status);
                const size = getSizeFromAttendees(event.expectedAttendees);
                return (
                  <motion.div
                    key={event._id}
                    layout
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    className="glass-card group relative border border-white/10 hover:border-primary/40 transition-all duration-700 overflow-hidden"
                  >
                    {/* Refined gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    <div className="p-10 space-y-10 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-6">
                          <div className="w-20 h-20 rounded-[2rem] bg-black/40 flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-700 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <Calendar size={32} className="relative group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Globe size={12} className="text-white/40" />
                              <Typography className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">
                                {event.companyName}
                              </Typography>
                            </div>
                            <Typography variant="h3" className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-500 tracking-tight">
                              {event.name}
                            </Typography>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleOpenEdit(event)}
                            className="p-3.5 bg-black/40 text-white/40 hover:text-primary hover:bg-primary/10 border border-white/10 rounded-2xl transition-all shadow-xl"
                            title="Editar Operação"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id as Id<"events">, event.companyId)}
                            className="p-3.5 bg-black/40 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 border border-white/10 rounded-2xl transition-all shadow-xl"
                            title="Descontinuar"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/40 mb-1">
                            <MapPin size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Geolocal</span>
                          </div>
                          <span className="text-sm text-white/80 font-bold tracking-tight line-clamp-1">{event.location}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/40 mb-1">
                            <Users size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Magnitude</span>
                          </div>
                          <span className={`text-sm font-bold tracking-tight ${size.color}`}>{size.label}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-400/50 mb-1">
                            <Zap size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Provision</span>
                          </div>
                          <span className="text-sm text-white font-bold tracking-tight">{event.estimatedConsumption.toLocaleString()} kWh</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/40 mb-1">
                            <Calendar size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Scheduled</span>
                          </div>
                          <span className="text-sm text-white/80 font-bold tracking-tight">{new Date(event.startDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${status.border} ${status.bg} ${status.color} ${status.glow} backdrop-blur-md`}>
                          {status.label}
                        </div>
                        <button 
                          onClick={() => router.push(`/eventos/${event._id}`)}
                          className="h-12 px-8 rounded-full bg-black/40 text-white/40 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3 hover:bg-primary/10 hover:text-primary border border-white/10 hover:border-primary/30 transition-all group/btn shadow-xl"
                        >
                          Ver Dossier
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-3xl glass-card border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="p-12 sm:p-16 relative z-10">
                <div className="flex items-start justify-between mb-16">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                      <Typography className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">
                        Protocol System v2.0
                      </Typography>
                    </div>
                    <Typography variant="h2" className="text-4xl font-bold text-white tracking-tight italic">
                      {isEditing ? 'Ajustar Operação' : 'Provisionar Operação'}
                    </Typography>
                    <Typography className="text-white/40 font-medium tracking-wide">Configure os parâmetros técnicos para o novo ativo.</Typography>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/10 shadow-2xl group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Designação da Operação</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-lg placeholder-white/20"
                      placeholder="Ex: Festival de Verão 2026"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Entidade Responsável</label>
                    <div className="relative group">
                      <select 
                        value={formData.companyId} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, companyId: e.target.value as Id<"companies">})}
                        className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none cursor-pointer font-bold text-sm"
                        required
                      >
                        <option value="">Selecione a Entidade</option>
                        {companies?.filter((c: MockCompany) => c.type === 'client').map((company: MockCompany) => (
                          <option key={company._id} value={company._id}>{company.name}</option>
                        ))}
                      </select>
                      <ArrowRight size={16} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-white/40 pointer-events-none group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Estado do Protocolo</label>
                    <div className="relative group">
                      <select 
                        value={formData.status} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, status: e.target.value as 'planning' | 'active' | 'completed' | 'cancelled'})}
                        className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none cursor-pointer font-bold text-sm"
                        required
                      >
                        <option value="planning">Planejamento</option>
                        <option value="active">Operação Ativa</option>
                        <option value="completed">Finalizado</option>
                        <option value="cancelled">Descontinuado</option>
                      </select>
                      <ArrowRight size={16} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-white/40 pointer-events-none group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Início Scheduled</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Término Scheduled</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Coordenadas / Localização</label>
                    <div className="relative">
                      <MapPin size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold placeholder-white/20 text-sm"
                        placeholder="Local exato da operação física"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Magnitude de Público</label>
                    <div className="relative">
                      <Users size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        type="number" 
                        value={formData.expectedAttendees || ''}
                        onChange={e => setFormData({...formData, expectedAttendees: Number(e.target.value)})}
                        className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold placeholder-white/20 text-sm"
                        placeholder="Qtd. Estimada"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Provision Energético (kWh)</label>
                    <div className="relative">
                      <Zap size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-amber-500/50" />
                      <input 
                        type="number" 
                        value={formData.estimatedConsumption || ''}
                        onChange={e => setFormData({...formData, estimatedConsumption: Number(e.target.value)})}
                        className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold placeholder-white/20 text-sm"
                        placeholder="Carga Prevista"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 md:col-span-2 pt-10">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-16 rounded-full border border-white/10 text-white/40 font-black tracking-[0.3em] uppercase text-[10px] hover:bg-white/5 hover:text-white transition-all shadow-xl"
                    >
                      Descartar
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-[2] h-16 bg-primary text-black hover:bg-primary/90 rounded-full font-black tracking-widest uppercase text-[10px] disabled:opacity-50 transition-all" 
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center gap-4">
                          <Loader2 size={24} className="animate-spin" />
                          Processando Protocolo...
                        </span>
                      ) : isEditing ? 'Confirmar Ajuste' : 'Ativar Provisionamento'}
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
