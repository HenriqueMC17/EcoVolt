import React from 'react';
import { 
  UserPlus, 
  Search, 
  MoreVertical,
  Mail,
  Shield,
  Clock,
  User,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import './Usuarios.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operador' | 'cliente' | 'financeiro';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const usersData: UserData[] = [
  { id: 'USR-001', name: 'Carlos Andrade', email: 'carlos.andrade@ecovolt.com.br', role: 'admin', status: 'active', lastLogin: 'Hoje, 09:42' },
  { id: 'USR-002', name: 'Ana Oliveira', email: 'ana.oliveira@ecovolt.com.br', role: 'operador', status: 'active', lastLogin: 'Ontem, 16:20' },
  { id: 'USR-003', name: 'Roberto Silva', email: 'roberto@alimentos.sa', role: 'cliente', status: 'active', lastLogin: '05/05/2024' },
  { id: 'USR-004', name: 'Mariana Costa', email: 'mariana.costa@ecovolt.com.br', role: 'financeiro', status: 'active', lastLogin: '04/05/2024' },
  { id: 'USR-005', name: 'Joaquim Souza', email: 'joaquim@techlogix.com', role: 'cliente', status: 'inactive', lastLogin: '22/04/2024' },
];

const Usuarios: React.FC = () => {
  const columns = [
    { 
      header: 'Usuário', 
      accessor: 'name',
      render: (row: UserData) => (
        <div className="user-profile-cell">
          <div className="avatar-small">
            <User size={14} />
          </div>
          <div className="flex-col">
            <span className="font-bold text-primary">{row.name}</span>
            <div className="flex-center gap-1 text-xs text-muted">
              <Mail size={10} /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Perfil', 
      accessor: 'role',
      render: (row: UserData) => (
        <div className="flex-center gap-2">
          <Shield size={14} className="text-secondary" />
          <span className="capitalize">{row.role}</span>
        </div>
      )
    },
    { 
      header: 'Visto por último', 
      accessor: 'lastLogin',
      render: (row: UserData) => (
        <div className="flex-center gap-2">
          <Clock size={14} className="text-muted" />
          <span>{row.lastLogin}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: UserData) => (
        <div className={`status-pill ${row.status}`}>
          {row.status === 'active' ? (
            <><CheckCircle2 size={12} /> Ativo</>
          ) : (
            <><XCircle size={12} /> Inativo</>
          )}
        </div>
      )
    },
    {
      header: 'Ações',
      accessor: 'id',
      render: () => (
        <button className="icon-btn"><MoreVertical size={18} /></button>
      )
    }
  ];

  return (
    <div className="usuarios-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de Usuários</h1>
          <p className="page-subtitle">Administre os perfis de acesso e permissões da plataforma.</p>
        </div>
        <button className="btn btn-primary flex-center gap-2">
          <UserPlus size={18} /> Novo Usuário
        </button>
      </div>

      <div className="users-filters glass">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Buscar por nome, e-mail ou perfil..." />
        </div>
        <div className="filter-actions">
          <button className="chip active">Todos</button>
          <button className="chip">Admins</button>
          <button className="chip">Operadores</button>
          <button className="chip">Clientes</button>
        </div>
      </div>

      <div className="users-table">
        <DataTable 
          title="Colaboradores e Clientes"
          columns={columns}
          data={usersData}
        />
      </div>
    </div>
  );
};

export default Usuarios;
