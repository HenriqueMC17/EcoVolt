import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  CheckCircle, 
  X, 
  Loader2,
  Trash2,
  Edit,
  Lock,
  Search,
  Globe,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

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
    role: 'event_company' as 'admin' | 'event_company' | 'provider' | 'operator',
    companyId: ''
  });

  if (!isAdmin) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-400/10 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_50px_rgba(244,63,94,0.2)]">
          <Lock size={40} />
        </div>
        <Typography variant="h2">Acesso Restrito</Typography>
        <Typography variant="muted" className="max-w-md mx-auto">
          Apenas administradores podem acessar a gestão de usuários e empresas. Entre em contato com o suporte se acreditar que isso é um erro.
        </Typography>
        <Button variant="outline" onClick={() => window.history.back()}>
          Voltar para Início
        </Button>
      </div>
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
        showToast('Empresa atualizada com sucesso!', 'success');
      } else {
        await createCompany({
          userEmail,
          ...companyForm,
        });
        showToast('Empresa cadastrada com sucesso!', 'success');
      }
      setCompanyModalOpen(false);
      setEditingCompanyId(null);
      setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
    } catch (err) {
      showToast(editingCompanyId ? 'Erro ao atualizar empresa' : 'Erro ao cadastrar empresa', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast('Nome e email são obrigatórios', 'error');
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
        showToast('Usuário atualizado com sucesso!', 'success');
      } else {
        await createUser({
          userEmail,
          ...userForm,
          companyId: userForm.companyId ? (userForm.companyId as any) : undefined
        });
        showToast('Usuário cadastrado com sucesso!', 'success');
      }
      setUserModalOpen(false);
      setEditingUserId(null);
      setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
    } catch (err) {
      showToast(editingUserId ? 'Erro ao atualizar usuário' : 'Erro ao cadastrar usuário', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await removeCompany({ userEmail, id: id as any });
        showToast('Empresa excluída com sucesso!', 'success');
      } catch (err) {
        showToast('Erro ao excluir empresa', 'error');
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await removeUser({ userEmail, id: id as any });
        showToast('Usuário excluído com sucesso!', 'success');
      } catch (err) {
        showToast('Erro ao excluir usuário', 'error');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2">Gestão de Acessos</Typography>
          <Typography variant="muted">Controle de empresas parceiras e usuários da plataforma.</Typography>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-border-glass">
          <button 
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'companies' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'
            }`}
          >
            <Building2 size={18} /> Empresas
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'users' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'
            }`}
          >
            <Users size={18} /> Usuários
          </button>
        </div>
      </div>

      {activeTab === 'companies' ? (
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border-glass flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <Typography variant="h4">Empresas Cadastradas</Typography>
            <Button onClick={() => {
              setEditingCompanyId(null);
              setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
              setCompanyModalOpen(true);
            }}>
              <Plus size={18} /> Nova Empresa
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Região</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {!companies ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin inline-block text-primary" size={32} />
                    </td>
                  </tr>
                ) : companies.map(company => (
                  <tr key={company._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <Typography className="font-semibold text-sm">{company.name}</Typography>
                          <Typography variant="small" className="text-text-muted text-[10px] uppercase font-bold tracking-widest">{company.cnpj || 'CNPJ não informado'}</Typography>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                        company.type === 'client' ? 'bg-blue-400/10 text-blue-400' : 'bg-purple-400/10 text-purple-400'
                      }`}>
                        {company.type === 'client' ? 'Organizador' : 'Provedor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-main">
                      {company.region || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                        company.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                      }`}>
                        {company.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400" onClick={() => handleOpenCompanyEdit(company)}>
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-rose-400/10 rounded-lg transition-colors text-rose-400" onClick={() => handleDeleteCompany(company._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border-glass flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <Typography variant="h4">Usuários da Plataforma</Typography>
            <Button onClick={() => {
              setEditingUserId(null);
              setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
              setUserModalOpen(true);
            }}>
              <Plus size={18} /> Novo Usuário
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {!users ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin inline-block text-primary" size={32} />
                    </td>
                  </tr>
                ) : users.map(userItem => (
                  <tr key={userItem._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <Users size={20} />
                        </div>
                        <Typography className="font-semibold text-sm">{userItem.name}</Typography>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-main">
                      {userItem.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-text-muted font-bold uppercase tracking-wider">
                        {userItem.role === 'admin' ? 'Administrador' : 
                         userItem.role === 'event_company' ? 'Empresa Eventos' :
                         userItem.role === 'provider' ? 'Provedor' : 'Operador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-main font-medium">
                      {companies?.find(c => c._id === userItem.companyId)?.name || 'EcoVolt'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400" onClick={() => handleOpenUserEdit(userItem)}>
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-rose-400/10 rounded-lg transition-colors text-rose-400" onClick={() => handleDeleteUser(userItem._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Company Modal */}
      <AnimatePresence>
        {isCompanyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompanyModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-xl p-8 relative z-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h3">
                  {editingCompanyId ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
                </Typography>
                <button onClick={() => setCompanyModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitCompany} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome da Empresa</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all" 
                    value={companyForm.name}
                    onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Tipo</label>
                    <select 
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                      value={companyForm.type}
                      onChange={e => setCompanyForm({...companyForm, type: e.target.value as any})}
                    >
                      <option value="client">Organizador de Eventos</option>
                      <option value="provider">Provedor de Energia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">CNPJ</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all"
                      value={companyForm.cnpj}
                      onChange={e => setCompanyForm({...companyForm, cnpj: e.target.value})}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Região / Localização</label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-border-glass rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none transition-all"
                      value={companyForm.region}
                      onChange={e => setCompanyForm({...companyForm, region: e.target.value})}
                      placeholder="Ex: São Paulo, Brasil"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setCompanyModalOpen(false)} type="button">
                    Cancelar
                  </Button>
                  <Button className="flex-1" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingCompanyId ? 'Salvar Alterações' : 'Cadastrar Empresa')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUserModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-xl p-8 relative z-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h3">
                  {editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
                </Typography>
                <button onClick={() => setUserModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all" 
                    value={userForm.name}
                    onChange={e => setUserForm({...userForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Corporativo</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-border-glass rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none transition-all" 
                      value={userForm.email}
                      onChange={e => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Perfil / Permissão</label>
                    <select 
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                      value={userForm.role}
                      onChange={e => setUserForm({...userForm, role: e.target.value as any})}
                    >
                      <option value="admin">Administrador</option>
                      <option value="event_company">Empresa de Eventos</option>
                      <option value="provider">Provedor de Energia</option>
                      <option value="operator">Operador / Monitor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Empresa Vinculada</label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <select 
                        className="w-full bg-white/5 border border-border-glass rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                        value={userForm.companyId}
                        onChange={e => setUserForm({...userForm, companyId: e.target.value})}
                      >
                        <option value="">EcoVolt (Interno)</option>
                        {companies?.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setUserModalOpen(false)} type="button">
                    Cancelar
                  </Button>
                  <Button className="flex-1" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Management;
