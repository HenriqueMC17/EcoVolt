import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Upload,
  ExternalLink,
  Download,
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import './Compliance.css';
import '../../../styles/enterprise-components.css';

interface Document {
  id: string;
  name: string;
  category: string;
  provider: string;
  expiry: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending';
}

const documents: Document[] = [
  { 
    id: 'DOC-001', 
    name: 'Licença Ambiental de Operação', 
    category: 'Legal', 
    provider: 'SolarTech Energia',
    expiry: '2027-12-31', 
    status: 'valid' 
  },
  { 
    id: 'DOC-002', 
    name: 'Certificado de Origem Renovável', 
    category: 'Sustentabilidade', 
    provider: 'SolarTech Energia',
    expiry: '2026-06-15', 
    status: 'expiring' 
  },
  { 
    id: 'DOC-003', 
    name: 'Apólice de Seguro de Risco', 
    category: 'Financeiro', 
    provider: 'WindFlow Brasil',
    expiry: '2025-10-20', 
    status: 'expired' 
  },
  { 
    id: 'DOC-004', 
    name: 'Contrato de Fornecimento de Energia', 
    category: 'Legal', 
    provider: 'BioGen Sustentável',
    expiry: '2028-01-01', 
    status: 'valid' 
  },
  { 
    id: 'DOC-005', 
    name: 'Laudo de Conformidade Técnica', 
    category: 'Operacional', 
    provider: 'EcoLight Solutions',
    expiry: 'N/A', 
    status: 'pending' 
  }
];

const Compliance: React.FC = () => {
  const getStatusInfo = (status: Document['status']): { type: StatusType; label: string } => {
    switch (status) {
      case 'valid':
        return { type: 'success', label: 'Válido' };
      case 'expiring':
        return { type: 'warning', label: 'A Vencer' };
      case 'expired':
        return { type: 'error', label: 'Expirado' };
      case 'pending':
        return { type: 'info', label: 'Pendente' };
      default:
        return { type: 'neutral', label: status };
    }
  };

  const columns = [
    { 
      header: 'Identificador', 
      accessor: 'id' as keyof Document,
      sortable: true,
      render: (row: Document) => <span className="id-badge">{row.id}</span>
    },
    { 
      header: 'Documento', 
      accessor: 'name' as keyof Document,
      sortable: true,
      render: (row: Document) => (
        <div className="flex items-center gap-3">
          <div className="text-primary"><FileText size={18} /></div>
          <span className="font-bold text-sm">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Categoria', 
      accessor: 'category' as keyof Document,
      sortable: true,
      render: (row: Document) => (
        <span className="px-2 py-1 bg-white/5 rounded text-xs font-medium uppercase tracking-wider">
          {row.category}
        </span>
      )
    },
    { 
      header: 'Provedor', 
      accessor: 'provider' as keyof Document,
      sortable: true,
      render: (row: Document) => <span className="text-sm text-muted">{row.provider}</span>
    },
    { 
      header: 'Vencimento', 
      accessor: 'expiry' as keyof Document,
      sortable: true,
      render: (row: Document) => (
        <span className={`text-sm ${row.status === 'expired' ? 'text-error font-bold' : ''}`}>
          {row.expiry}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof Document,
      sortable: true,
      render: (row: Document) => {
        const { type, label } = getStatusInfo(row.status);
        return <StatusBadge status={type} label={label} variant="glass" size="sm" />;
      }
    },
    { 
      header: 'Ações', 
      accessor: 'id' as keyof Document,
      render: () => (
        <div className="flex gap-2">
          <button className="icon-btn-glass" title="Visualizar"><ExternalLink size={16} /></button>
          <button className="icon-btn-glass" title="Baixar"><Download size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="compliance-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Governança & Risco</div>
          <h1 className="header-title">Compliance e Documentos</h1>
          <p className="header-subtitle">Monitoramento de conformidade regulatória, validade de certificados e governança de dados.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Search size={18} /> Buscar
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Upload size={18} /> Subir Documento
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <CheckCircle2 size={20} />
            </div>
            <div className="kpi-trend positive">
              Excelente
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Índice de Conformidade</span>
            <h2 className="kpi-value">85%</h2>
            <p className="kpi-desc">Meta: 90% (Auditado)</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <Clock size={20} />
            </div>
            <div className="kpi-trend warning">
              Atenção
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Vencendo em 30d</span>
            <h2 className="kpi-value">12</h2>
            <p className="kpi-desc">Certificados e apólices</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box error">
              <ShieldAlert size={20} />
            </div>
            <div className="kpi-trend negative">
              Crítico
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Irregularidades</span>
            <h2 className="kpi-value">03</h2>
            <p className="kpi-desc">Exige ação imediata</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Documentos Ativos</span>
            <h2 className="kpi-value">48</h2>
            <p className="kpi-desc">Base de dados consolidada</p>
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Gestão de Documentos</h3>
            <p>Repositório centralizado de licenças, contratos e conformidade técnica</p>
          </div>
          <div className="header-actions">
            <button className="btn-text flex items-center gap-2">
              <Filter size={14} /> Filtrar
            </button>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={documents}
          />
        </div>
      </div>
    </div>
  );
};

export default Compliance;
