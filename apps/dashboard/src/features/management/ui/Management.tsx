import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Plus, 
  Mail, 
  X, 
  Loader2,
  Trash2,
  Edit,
  Lock,
  Globe,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

// --- Constants & Animations ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const StatCard = ({ title, value, icon: Icon, color, glowColor }: any) => (
  <motion.div 
    variants={itemVariants}
    className="glass-card relative overflow-hidden group border-slate-800/50 hover:border-slate-700/50 transition-all duration-500"
  >
    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${glowColor}`} />
    
    <div className="p-8 relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-[1.5rem] bg-slate-900/50 border border-slate-800/50 text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-all duration-500 shadow-2xl`}>
          <Icon size={24} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
      
      <div className="space-y-1">
        <Typography className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">
          {title}
        </Typography>
        <Typography className="text-4xl font-bold text-white tracking-tighter">
          {value}
        </Typography>
      </div>

      <div className="mt-8 h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  </motion.div>
);

const Management: React.FC = () => {
  const { user } = useUser();
  const userEmail = user?.email || "";
  
  const companies = useQuery(api.companies.getCompanies, { userEmail });
  const users = useQuery(api.users.getUsers, { userEmail });
  const { showToast } = useToast();

  const createCompany = useMutation(api.companies.createCompany);
  const updateCompany = useMutation(api.companies.updateCompany);
  const removeCompany = useMutation(api.companies.removeCompany);
  
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const removeUser = useMutation(api.users.removeUser);

  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    type: 'client' as 'client' | 'provider',
    cnpj: '',
    status: 'active' as 'active' | 'inactive',
    region: '',
    category: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'event_company' as any,
    companyId: ''
  });

  if (!isAdmin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900/80 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.3)] animate-pulse">
              <Lock size={56} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white border-4 border-slate-950 shadow-xl">
              <X size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
              Terminal <span className="text-rose-500">Bloqueado</span>
            </Typography>
            <Typography variant="body" className="text-slate-400 font-medium leading-relaxed">
              Esta seção contém protocolos de governança de alta prioridade. Seu perfil atual não possui as credenciais "root" necessárias para modificação da rede.
            </Typography>
          </div>

          <button 
            onClick={() => window.history.back()}
            className="btn-premium-primary bg-slate-800 hover:bg-slate-700 border-slate-700 h-14 px-10 rounded-2xl"
          >
            Retornar ao Porto Seguro
          </button>
        </div>
      </motion.div>
    );
  }

  const handleOpenCompanyEdit = (company: any) => {
    setEditingCompanyId(company._id);
    setCompanyForm({
      name: company.name,
      type: company.type,
      cnpj: company.cnpj || '',
      status: company.status,
      region: company.region || '',
      category: company.category || ''
    });
    setCompanyModalOpen(true);
  };

  const handleOpenUserEdit = (user: any) => {
    setEditingUserId(user._id);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId || ''
    });
    setUserModalOpen(true);
  };

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name) {
      showToast('O nome da empresa é obrigatório', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCompanyId) {
        await updateCompany({
          userEmail,
          id: editingCompanyId as any,
          ...companyForm,
        });
        showToast('Matriz corporativa atualizada.', 'success');
      } else {
        await createCompany({
          userEmail,
          ...companyForm,
        });
        showToast('Nova entidade registrada na rede.', 'success');
      }
      setCompanyModalOpen(false);
      setEditingCompanyId(null);
      setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
    } catch (err) {
      showToast('Falha na operação de registro.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast('Credenciais incompletas.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUserId) {
        await updateUser({
          userEmail,
          id: editingUserId as any,
          ...userForm,
          companyId: userForm.companyId ? (userForm.companyId as any) : undefined
        });
        showToast('Perfil de usuário sincronizado.', 'success');
      } else {
        await createUser({
          userEmail,
          ...userForm,
          companyId: userForm.companyId ? (userForm.companyId as any) : undefined
        });
        showToast('Novo operador autenticado.', 'success');
      }
      setUserModalOpen(false);
      setEditingUserId(null);
      setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
    } catch (err) {
      showToast('Erro ao validar novas credenciais.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Atenção: A exclusão da matriz removerá todos os vínculos operacionais. Confirmar?')) {
      try {
        await removeCompany({ userEmail, id: id as any });
        showToast('Entidade removida do ledger.', 'success');
      } catch (err) {
        showToast('Erro ao purgar registro.', 'error');
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Revogar permanentemente o acesso deste usuário?')) {
      try {
        await removeUser({ userEmail, id: id as any });
        showToast('Acesso revogado com sucesso.', 'success');
      } catch (err) {
        showToast('Erro ao remover credenciais.', 'error');
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-20"
    >
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse" />
            <Typography className="text-[10px] font-black tracking-[0.4em] text-indigo-500 uppercase">
              Network Governance
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Control</span>
          </Typography>
          <Typography variant="body" className="text-slate-400 font-medium tracking-wide max-w-xl">
            Orquestração de permissões, perfis de segurança e hierarquia corporativa EcoVolt.
          </Typography>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex bg-slate-900/60 p-2 rounded-[2rem] border border-slate-800/50 backdrop-blur-3xl shadow-2xl"
        >
          <button 
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              activeTab === 'companies' 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Building2 size={18} /> Matriz
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-[0_0_25px_rgba(147,51,234,0.3)] scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Users size={18} /> Operadores
          </button>
        </motion.div>
      </div>

      {/* Stats QuickView */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Matrizes Registradas" 
          value={companies?.length || 0} 
          icon={Globe} 
          color="from-indigo-500 to-blue-600"
          glowColor="from-indigo-500/20"
        />
        <StatCard 
          title="Contas Autenticadas" 
          value={users?.length || 0} 
          icon={Users} 
          color="from-purple-500 to-pink-600"
          glowColor="from-purple-500/20"
        />
        <StatCard 
          title="Nível de Segurança" 
          value="99.8%" 
          icon={ShieldCheck} 
          color="from-emerald-500 to-teal-600"
          glowColor="from-emerald-500/20"
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        <motion.div variants={itemVariants} className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
          <div>
            <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">
              {activeTab === 'companies' ? 'Enterprise Ledger' : 'Identity Vault'}
            </Typography>
            <Typography className="text-sm text-slate-500 font-medium">
              {activeTab === 'companies' ? 'Gerencie as entidades que compõem sua rede de distribuição.' : 'Controle os perfis de acesso e privilégios dos usuários.'}
            </Typography>
          </div>
          <Button 
            className="btn-premium-primary rounded-2xl h-12 px-8"
            onClick={() => {
              if (activeTab === 'companies') {
                setEditingCompanyId(null);
                setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
                setCompanyModalOpen(true);
              } else {
                setEditingUserId(null);
                setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
                setUserModalOpen(true);
              }
            }}
          >
            <Plus size={20} className="mr-2" />
            {activeTab === 'companies' ? 'Registrar Matriz' : 'Criar Operador'}
          </Button>
        </motion.div>

        {activeTab === 'companies' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {companies?.map((company) => (
                <motion.div
                  key={company._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="glass-card group relative border border-slate-800/50 hover:border-indigo-500/40 transition-all duration-700"
                >
                  <div className="p-10 space-y-8 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-[2rem] bg-slate-900/80 flex items-center justify-center text-indigo-400 border border-slate-800/50 group-hover:border-indigo-500/30 transition-all duration-700 shadow-2xl">
                        {company.type === 'client' ? <Building2 size={28} /> : <Briefcase size={28} />}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => handleOpenCompanyEdit(company)} className="p-3 bg-slate-900/80 text-slate-500 hover:text-indigo-400 border border-slate-800/50 rounded-2xl transition-all shadow-xl"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteCompany(company._id)} className="p-3 bg-slate-900/80 text-slate-500 hover:text-rose-400 border border-slate-800/50 rounded-2xl transition-all shadow-xl"><Trash2 size={18} /></button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full border inline-block ${
                        company.status === 'active' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10' : 'text-amber-400 bg-amber-400/5 border-amber-400/10'
                      }`}>
                        {company.status === 'active' ? 'Ativo na Rede' : 'Bloqueado'}
                      </div>
                      <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">{company.name}</Typography>
                      <Typography className="text-xs text-slate-500 font-bold tracking-widest uppercase">{company.cnpj || 'Matriz Interna'}</Typography>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-800/50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="w-8 h-8 rounded-xl bg-slate-950/50 flex items-center justify-center border border-slate-800/50"><Globe size={14} className="text-slate-600" /></div>
                        <span className="text-sm font-medium tracking-tight">{company.region || 'Território Global'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="w-8 h-8 rounded-xl bg-slate-950/50 flex items-center justify-center border border-slate-800/50"><Briefcase size={14} className="text-slate-600" /></div>
                        <span className="text-sm font-medium tracking-tight uppercase text-[10px] font-black tracking-widest">{company.type === 'client' ? 'Organizador' : 'Provedor'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {users?.map((userItem) => (
                <motion.div
                  key={userItem._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="glass-card group relative border border-slate-800/50 hover:border-purple-500/40 transition-all duration-700"
                >
                  <div className="p-10 space-y-8 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-full bg-slate-900/80 flex items-center justify-center text-purple-400 border border-slate-800/50 group-hover:border-purple-500/30 transition-all duration-700 shadow-2xl">
                        <Users size={28} />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => handleOpenUserEdit(userItem)} className="p-3 bg-slate-900/80 text-slate-500 hover:text-purple-400 border border-slate-800/50 rounded-2xl transition-all shadow-xl"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteUser(userItem._id)} className="p-3 bg-slate-900/80 text-slate-500 hover:text-rose-400 border border-slate-800/50 rounded-2xl transition-all shadow-xl"><Trash2 size={18} /></button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full border border-purple-500/10 bg-purple-500/5 text-purple-400 inline-block">
                        {userItem.role === 'admin' ? 'Acesso Root' : userItem.role === 'provider' ? 'Perfil Provedor' : 'Nível Operador'}
                      </div>
                      <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">{userItem.name}</Typography>
                      <Typography className="text-sm text-slate-500 font-medium lowercase">{userItem.email}</Typography>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="w-8 h-8 rounded-xl bg-slate-950/50 flex items-center justify-center border border-slate-800/50"><Building2 size={14} className="text-slate-600" /></div>
                        <div>
                          <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Vínculo Corporativo</Typography>
                          <Typography className="text-sm font-bold text-white tracking-tight">{companies?.find(c => c._id === userItem.companyId)?.name || 'EcoVolt HQ'}</Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Enterprise Modals */}
      <AnimatePresence>
        {(isCompanyModalOpen || isUserModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setCompanyModalOpen(false); setUserModalOpen(false); }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-3xl bg-slate-900/80 border border-slate-700/50 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-3xl"
            >
              <div className="p-12 sm:p-16 relative z-10">
                <div className="flex items-start justify-between mb-16">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                      <Typography className="text-[10px] font-black tracking-[0.4em] text-indigo-500 uppercase">
                        Protocol: {isCompanyModalOpen ? 'Entity_Register_v2' : 'Identity_Provisioning_v1'}
                      </Typography>
                    </div>
                    <Typography variant="h2" className="text-4xl font-bold text-white tracking-tight">
                      {isCompanyModalOpen 
                        ? (editingCompanyId ? 'Ajustar Matriz' : 'Nova Entidade') 
                        : (editingUserId ? 'Modificar Operador' : 'Autenticar Operador')}
                    </Typography>
                  </div>
                  <button 
                    onClick={() => { setCompanyModalOpen(false); setUserModalOpen(false); }}
                    className="p-4 text-slate-500 hover:text-white hover:bg-slate-800/80 rounded-3xl transition-all border border-slate-800/50 shadow-2xl group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>

                {isCompanyModalOpen ? (
                  <form onSubmit={handleSubmitCompany} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Razão Social</label>
                      <input 
                        type="text" 
                        value={companyForm.name}
                        onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-bold text-lg placeholder-slate-700"
                        placeholder="Nome da Entidade"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Classificação</label>
                      <select 
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all appearance-none cursor-pointer font-bold"
                        value={companyForm.type}
                        onChange={e => setCompanyForm({...companyForm, type: e.target.value as any})}
                      >
                        <option value="client">Organizador de Eventos</option>
                        <option value="provider">Provedor de Energia</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Registro (CNPJ)</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-bold placeholder-slate-700"
                        value={companyForm.cnpj}
                        onChange={e => setCompanyForm({...companyForm, cnpj: e.target.value})}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Localização Global</label>
                      <div className="relative">
                        <Globe size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input 
                          type="text" 
                          className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-bold placeholder-slate-700"
                          value={companyForm.region}
                          onChange={e => setCompanyForm({...companyForm, region: e.target.value})}
                          placeholder="Cidade, País"
                        />
                      </div>
                    </div>

                    <div className="flex gap-6 md:col-span-2 pt-10">
                      <button type="button" onClick={() => setCompanyModalOpen(false)} className="flex-1 h-16 rounded-[1.5rem] border border-slate-800 text-slate-500 font-black tracking-[0.3em] uppercase text-[10px] hover:bg-slate-800/50 transition-all">Cancelar</button>
                      <button type="submit" disabled={isSubmitting} className="flex-[2] h-16 btn-premium-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingCompanyId ? 'Sincronizar Matriz' : 'Validar Registro')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitUser} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nome do Operador</label>
                      <input 
                        type="text" 
                        value={userForm.name}
                        onChange={e => setUserForm({...userForm, name: e.target.value})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-bold text-lg placeholder-slate-700"
                        placeholder="Nome completo"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Email de Autenticação</label>
                      <div className="relative">
                        <Mail size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input 
                          type="email" 
                          value={userForm.email}
                          onChange={e => setUserForm({...userForm, email: e.target.value})}
                          className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-bold placeholder-slate-700"
                          placeholder="email@corporativo.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nível de Permissão</label>
                      <select 
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all appearance-none cursor-pointer font-bold"
                        value={userForm.role}
                        onChange={e => setUserForm({...userForm, role: e.target.value as any})}
                      >
                        <option value="admin">Root / Administrador</option>
                        <option value="event_company">Organizador de Eventos</option>
                        <option value="provider">Provedor de Energia</option>
                        <option value="operator">Monitor de Rede</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Vínculo de Rede</label>
                      <select 
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all appearance-none cursor-pointer font-bold"
                        value={userForm.companyId}
                        onChange={e => setUserForm({...userForm, companyId: e.target.value})}
                      >
                        <option value="">EcoVolt (Interno)</option>
                        {companies?.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-6 md:col-span-2 pt-10">
                      <button type="button" onClick={() => setUserModalOpen(false)} className="flex-1 h-16 rounded-[1.5rem] border border-slate-800 text-slate-500 font-black tracking-[0.3em] uppercase text-[10px] hover:bg-slate-800/50 transition-all">Cancelar</button>
                      <button type="submit" disabled={isSubmitting} className="flex-[2] h-16 btn-premium-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingUserId ? 'Atualizar Operador' : 'Autenticar Acesso')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Management;
