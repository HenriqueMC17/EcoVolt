import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert,
  Upload,
  Search,
  MoreVertical,
  Check
} from 'lucide-react';
import './Compliance.css';

const documents = [
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
  return (
    <div className="compliance-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance e Documentos</h1>
          <p className="page-subtitle">Gestão de conformidade regulatória e validade de certificados.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary flex-center gap-2">
            <Upload size={18} /> Subir Documento
          </button>
        </div>
      </div>

      <div className="compliance-overview">
        <div className="overview-card glass">
          <div className="icon-box success"><CheckCircle2 size={24} /></div>
          <div className="info">
            <h3>85%</h3>
            <p>Conformidade Geral</p>
          </div>
        </div>
        <div className="overview-card glass">
          <div className="icon-box warning"><Clock size={24} /></div>
          <div className="info">
            <h3>12</h3>
            <p>Documentos a vencer</p>
          </div>
        </div>
        <div className="overview-card glass">
          <div className="icon-box error"><ShieldAlert size={24} /></div>
          <div className="info">
            <h3>03</h3>
            <p>Irregularidades graves</p>
          </div>
        </div>
        <div className="overview-card glass">
          <div className="icon-box info"><FileText size={24} /></div>
          <div className="info">
            <h3>48</h3>
            <p>Total de documentos</p>
          </div>
        </div>
      </div>

      <div className="document-filters glass">
        <div className="search-input">
          <Search size={18} />
          <input type="text" placeholder="Buscar por documento ou provedor..." />
        </div>
        <div className="filter-chips">
          <button className="chip active">Todos</button>
          <button className="chip">Legais</button>
          <button className="chip">Sustentabilidade</button>
          <button className="chip">Operacionais</button>
        </div>
      </div>

      <div className="documents-grid">
        {documents.map((doc) => (
          <div key={doc.id} className={`document-card glass ${doc.status}`}>
            <div className="card-header">
              <div className="doc-icon">
                <FileText size={20} />
              </div>
              <div className="doc-meta">
                <span className="doc-id">{doc.id}</span>
                <span className="doc-category">{doc.category}</span>
              </div>
              <button className="btn-icon"><MoreVertical size={18} /></button>
            </div>
            
            <div className="card-body">
              <h4>{doc.name}</h4>
              <p className="provider">{doc.provider}</p>
            </div>

            <div className="card-footer">
              <div className="expiry-info">
                <span className="label">Validade:</span>
                <span className="value">{doc.expiry}</span>
              </div>
              <div className={`status-tag ${doc.status}`}>
                {doc.status === 'valid' && <><Check size={14} /> Válido</>}
                {doc.status === 'expiring' && <><Clock size={14} /> Próximo ao vencimento</>}
                {doc.status === 'expired' && <><AlertCircle size={14} /> Expirado</>}
                {doc.status === 'pending' && <><Clock size={14} /> Pendente</>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compliance;
