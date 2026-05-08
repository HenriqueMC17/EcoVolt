import React from 'react';
import { ShieldCheck, Zap, Award, Star, Search, MapPin } from 'lucide-react';
import './Provedores.css';

interface Provider {
  name: string;
  type: string;
  location: string;
  rating: number;
  capacity: string;
  status: string;
  verified: boolean;
}

const providers: Provider[] = [
  { 
    name: 'SolarTech Energia', 
    type: 'Solar / Fotovoltaica', 
    location: 'São Paulo, SP', 
    rating: 4.9, 
    capacity: '1.2 GWh/ano', 
    status: 'Homologado',
    verified: true
  },
  { 
    name: 'WindFlow Brasil', 
    type: 'Eólica', 
    location: 'Fortaleza, CE', 
    rating: 4.8, 
    capacity: '500 MWh/ano', 
    status: 'Homologado',
    verified: true
  },
  { 
    name: 'BioGen Sustentável', 
    type: 'Biomassa', 
    location: 'Curitiba, PR', 
    rating: 4.5, 
    capacity: '200 MWh/ano', 
    status: 'Em Análise',
    verified: false
  },
  { 
    name: 'EcoLight Solutions', 
    type: 'Consultoria / Distribuição', 
    location: 'Rio de Janeiro, RJ', 
    rating: 4.7, 
    capacity: 'N/A', 
    status: 'Homologado',
    verified: true
  }
];

const ProviderCard = ({ provider }: { provider: Provider }) => (
  <div className="provider-card glass animate-fade-in">
    <div className="provider-header">
      <div className="provider-info-main">
        <h3>{provider.name}</h3>
        <p className="type">{provider.type}</p>
      </div>
      {provider.verified && <ShieldCheck size={20} className="text-primary" />}
    </div>
    
    <div className="provider-stats">
      <div className="stat">
        <MapPin size={14} />
        <span>{provider.location}</span>
      </div>
      <div className="stat">
        <Star size={14} className="text-warning" />
        <span>{provider.rating}</span>
      </div>
      <div className="stat">
        <Zap size={14} />
        <span>{provider.capacity}</span>
      </div>
    </div>

    <div className="provider-footer">
      <span className={`status-pill ${provider.status === 'Homologado' ? 'success' : 'warning'}`}>
        {provider.status}
      </span>
      <button className="btn-text">Ver Portfólio</button>
    </div>
  </div>
);

const Provedores: React.FC = () => {
  return (
    <div className="provedores-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Provedores de Energia</h1>
          <p className="page-subtitle">Rede de parceiros homologados para fornecimento sustentável.</p>
        </div>
        <button className="btn btn-primary flex-center gap-2"><Award size={18} /> Novo Credenciamento</button>
      </div>

      <div className="filters-bar glass">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Filtrar por nome, tipo ou região..." />
        </div>
        <div className="select-filters">
          <select><option>Todos os tipos</option></select>
          <select><option>Todas as regiões</option></select>
          <select><option>Status: Homologados</option></select>
        </div>
      </div>

      <div className="providers-grid">
        {providers.map((p, i) => (
          <ProviderCard key={i} provider={p} />
        ))}
      </div>
    </div>
  );
};

export default Provedores;
