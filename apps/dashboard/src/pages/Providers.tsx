import React from 'react';
import { 
  Users, 
  MapPin, 
  Star, 
  Zap, 
  CheckCircle, 
  Search, 
  Filter,
  MessageSquare,
  FileText,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Providers: React.FC = () => {
  const providers = useQuery(api.companies.getCompanies, { type: "provider" });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Provedores de Energia</h2>
          <p style={{ color: 'var(--text-muted)' }}>Encontre e conecte-se com fornecedores de energia limpa homologados.</p>
        </div>
        <button className="btn btn-outline">
          <CheckCircle size={18} />
          Seja um Provedor
        </button>
      </header>

      <div className="card glass" style={{ marginBottom: '32px', display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por região, capacidade ou tipo..." 
            style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px 10px 40px', color: 'white', outline: 'none' }}
          />
        </div>
        <button className="btn btn-outline" style={{ padding: '8px 16px' }}><Filter size={18} /> Filtrar</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {providers === undefined ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center' }}>
            <Loader2 className="spin" size={32} />
          </div>
        ) : providers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum provedor encontrado.
          </div>
        ) : providers.map((provider) => (
          <motion.div 
            key={provider._id} 
            className="card"
            whileHover={{ y: -5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: 'white'
                }}>
                  {provider.name[0]}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700 }}>{provider.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fbbf24' }}>
                    <Star size={12} fill="#fbbf24" />
                    {provider.rating || 'N/A'}
                    <span style={{ color: 'var(--text-muted)' }}>(Homologado)</span>
                  </div>
                </div>
              </div>
              <span className={`badge ${provider.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                {provider.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span>{provider.region || 'Região não informada'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <Zap size={16} color="var(--primary)" />
                <span>Capacidade: <strong>{provider.capacity || 'Sob consulta'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <FileText size={16} color="var(--secondary)" />
                <span>Tipo: {provider.category || 'Energia Limpa'}</span>
              </div>
            </div>

            <div style={{ 
              marginTop: 'auto', 
              paddingTop: '16px', 
              borderTop: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                <MessageSquare size={16} />
                Chat
              </button>
              <button className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                Ver Perfil
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Providers;
