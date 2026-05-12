import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map pathnames to human readable labels if needed
  const routeLabels: Record<string, string> = {
    'operations': 'Operação',
    'commercial': 'Comercial',
    'financial': 'Financeiro',
    'governance': 'Governança',
    'overview': 'Visão Geral',
    'empresas': 'Empresas',
    'propostas': 'Propostas',
    'contracts': 'Contratos',
    'consumo': 'Consumo',
    'auditoria': 'Auditoria',
    'events': 'Eventos',
    'estimativa': 'Estimativa',
    'provedores': 'Provedores',
    'reconciliacao': 'Reconciliação',
    'compliance': 'Compliance',
    'relatorios': 'Relatórios',
    'usuarios': 'Usuários',
    'configuracoes': 'Configurações'
  };

  return (
    <nav className="breadcrumbs animate-fade-in">
      <Link to="/operations/overview" className="breadcrumb-item home">
        <Home size={16} />
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight size={14} className="breadcrumb-separator" />
            {last ? (
              <span className="breadcrumb-item active">{label}</span>
            ) : (
              <Link to={to} className="breadcrumb-item">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
