import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Zap, 
  Users, 
  FileCheck, 
  BarChart3, 
  DollarSign, 
  ShieldCheck, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  LogOut,
  Activity,
  History,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    {
      group: 'Operação',
      items: [
        { name: 'Visão Geral', icon: <LayoutDashboard size={18} />, path: '/' },
        { name: 'Empresas', icon: <Briefcase size={18} />, path: '/empresas' },
        { name: 'Usuários', icon: <Users size={18} />, path: '/usuarios' },
        { name: 'Eventos', icon: <Calendar size={18} />, path: '/eventos' },
        { name: 'Estimativas', icon: <Zap size={18} />, path: '/estimativa' },
        { name: 'Consumo', icon: <Activity size={18} />, path: '/consumo' },
        { name: 'Auditoria', icon: <History size={18} />, path: '/auditoria' },
      ]
    },
    {
      group: 'Comercial',
      items: [
        { name: 'Provedores', icon: <Users size={18} />, path: '/provedores' },
        { name: 'Propostas', icon: <Briefcase size={18} />, path: '/propostas' },
        { name: 'Contratos', icon: <FileCheck size={18} />, path: '/contratos' },
      ]
    },
    {
      group: 'Financeiro',
      items: [
        { name: 'Financeiro', icon: <DollarSign size={18} />, path: '/financeiro' },
        { name: 'Reconciliação', icon: <TrendingUp size={18} />, path: '/reconciliacao' },
      ]
    },
    {
      group: 'Governança',
      items: [
        { name: 'Documentos', icon: <ShieldCheck size={18} />, path: '/compliance' },
        { name: 'Relatórios', icon: <BarChart3 size={18} />, path: '/relatorios' },
      ]
    }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'} glass`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">EV</div>
            <span className="logo-text">EcoVolt</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((group, gIdx) => (
            <div key={gIdx} className="nav-group">
              {isSidebarOpen && <span className="nav-group-title">{group.group}</span>}
              {group.items.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/configuracoes" className="nav-item">
            <span className="nav-icon"><Settings size={20} /></span>
            <span className="nav-text">Configurações</span>
          </NavLink>
          <button className="nav-item logout">
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-text">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`main-area ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Topbar */}
        <header className="topbar glass">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Buscar operações, contratos..." />
          </div>

          <div className="topbar-actions">
            <button className="action-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Carlos Andrade</span>
                <span className="user-role">Administrador</span>
              </div>
              <div className="user-avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="content-scroll">
          <div className="page-content animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
