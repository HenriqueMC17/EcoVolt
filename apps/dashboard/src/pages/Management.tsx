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
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';

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
      <div className="card glass" style={{ textAlign: 'center', padding: '64px' }}>
        <Lock size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>Acesso Restrito</h2>
        <p style={{ color: 'var(--text-muted)' }}>Apenas administradores podem acessar a gestão de usuários e empresas.</p>
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
    >
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Gestão de Acessos</h2>
        <p style={{ color: 'var(--text-muted)' }}>Controle de empresas parceiras e usuários da plataforma.</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button 
          onClick={() => setActiveTab('companies')}
          className={`btn ${activeTab === 'companies' ? 'btn-primary' : ''}`}
          style={{ padding: '8px 24px', background: activeTab === 'companies' ? '' : 'transparent', border: 'none' }}
        >
          <Building2 size={18} /> Empresas
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
          style={{ padding: '8px 24px', background: activeTab === 'users' ? '' : 'transparent', border: 'none' }}
        >
          <Users size={18} /> Usuários
        </button>
      </div>

      {activeTab === 'companies' ? (
        <div className="card glass" style={{ padding: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontWeight: 600 }}>Empresas Cadastradas</h4>
            <button className="btn btn-primary" onClick={() => {
              setEditingCompanyId(null);
              setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
              setCompanyModalOpen(true);
            }}>
              <Plus size={18} /> Nova Empresa
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>EMPRESA</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>TIPO</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>REGIÃO</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>STATUS</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {!companies ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center' }}><Loader2 className="spin" /></td></tr>
              ) : companies.map(company => (
                <tr key={company._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600 }}>{company.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{company.cnpj || 'CNPJ não informado'}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {company.type === 'client' ? 'Organizador' : 'Provedor'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>{company.region || '-'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`badge ${company.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {company.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => handleOpenCompanyEdit(company)}><Edit size={16} /></button>
                      <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => handleDeleteCompany(company._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card glass" style={{ padding: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontWeight: 600 }}>Usuários da Plataforma</h4>
            <button className="btn btn-primary" onClick={() => {
              setEditingUserId(null);
              setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
              setUserModalOpen(true);
            }}>
              <Plus size={18} /> Novo Usuário
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>NOME</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>EMAIL</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>CARGO</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>EMPRESA</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {!users ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center' }}><Loader2 className="spin" /></td></tr>
              ) : users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: '16px 24px' }}>{user.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'event_company' ? 'Empresa Eventos' :
                       user.role === 'provider' ? 'Provedor' : 'Operador'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {companies?.find(c => c._id === user.companyId)?.name || 'EcoVolt'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => handleOpenUserEdit(user)}><Edit size={16} /></button>
                      <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => handleDeleteUser(user._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Company Modal */}
      <AnimatePresence>
        {isCompanyModalOpen && (
          <div className="modal-overlay" onClick={() => setCompanyModalOpen(false)}>
            <motion.div 
              className="modal-content glass"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                  {editingCompanyId ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
                </h3>
                <button onClick={() => setCompanyModalOpen(false)} className="btn-icon"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmitCompany} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label">Nome da Empresa</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={companyForm.name}
                    onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="label">Tipo</label>
                    <select 
                      className="input-field"
                      value={companyForm.type}
                      onChange={e => setCompanyForm({...companyForm, type: e.target.value as any})}
                    >
                      <option value="client">Organizador de Eventos</option>
                      <option value="provider">Provedor de Energia</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">CNPJ</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={companyForm.cnpj}
                      onChange={e => setCompanyForm({...companyForm, cnpj: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Região / Localização</label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={companyForm.region}
                    onChange={e => setCompanyForm({...companyForm, region: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCompanyModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="spin" size={18} /> : (editingCompanyId ? 'Salvar Alterações' : 'Cadastrar')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="modal-overlay" onClick={() => setUserModalOpen(false)}>
            <motion.div 
              className="modal-content glass"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                  {editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
                </h3>
                <button onClick={() => setUserModalOpen(false)} className="btn-icon"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmitUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label">Nome Completo</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={userForm.name}
                    onChange={e => setUserForm({...userForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={userForm.email}
                    onChange={e => setUserForm({...userForm, email: e.target.value})}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="label">Perfil / Role</label>
                    <select 
                      className="input-field"
                      value={userForm.role}
                      onChange={e => setUserForm({...userForm, role: e.target.value as any})}
                    >
                      <option value="admin">Administrador</option>
                      <option value="event_company">Empresa de Eventos</option>
                      <option value="provider">Provedor de Energia</option>
                      <option value="operator">Financeiro/Jurídico</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Empresa Vinculada</label>
                    <select 
                      className="input-field"
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
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setUserModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="spin" size={18} /> : (editingUserId ? 'Salvar Alterações' : 'Cadastrar')}
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

export default Management;
