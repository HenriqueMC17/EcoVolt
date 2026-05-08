import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Zap, 
  Download, 
  Calendar as CalendarIcon,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import './Relatorios.css';

const performanceData = [
  { month: 'Jan', economia: 1200, impacto: 450 },
  { month: 'Fev', economia: 1900, impacto: 520 },
  { month: 'Mar', economia: 1500, impacto: 480 },
  { month: 'Abr', economia: 2400, impacto: 610 },
  { month: 'Mai', economia: 2100, impacto: 550 },
  { month: 'Jun', economia: 2800, impacto: 670 },
];

const Relatorios: React.FC = () => {
  return (
    <div className="relatorios-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Relatórios Executivos</h1>
          <p className="page-subtitle">Análise consolidada de performance, sustentabilidade e economia.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline flex-center gap-2">
            <CalendarIcon size={18} /> Últimos 6 Meses <ChevronDown size={14} />
          </button>
          <button className="btn btn-primary flex-center gap-2">
            <Download size={18} /> Baixar PDF
          </button>
        </div>
      </div>

      <div className="executive-summary">
        <div className="summary-card glass">
          <div className="summary-info">
            <span className="label">CO2 Evitado</span>
            <span className="value">12.5 Tons</span>
            <span className="sub">Equivalente a 850 árvores</span>
          </div>
          <div className="summary-icon green"><Leaf size={24} /></div>
        </div>
        <div className="summary-card glass">
          <div className="summary-info">
            <span className="label">Economia Gerada</span>
            <span className="value">R$ 45.800</span>
            <span className="sub">+15% vs semestre anterior</span>
          </div>
          <div className="summary-icon blue"><TrendingUp size={24} /></div>
        </div>
        <div className="summary-card glass">
          <div className="summary-info">
            <span className="label">Energia Limpa</span>
            <span className="value">94.2%</span>
            <span className="sub">Meta: 100% até 2027</span>
          </div>
          <div className="summary-icon yellow"><Zap size={24} /></div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="chart-card glass">
          <div className="chart-header">
            <h3>Economia Mensal (R$)</h3>
            <BarChart3 size={18} className="text-muted" />
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--slate-900)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="economia" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass">
          <div className="chart-header">
            <h3>Impacto Ambiental (Pontuação)</h3>
            <TrendingUp size={18} className="text-muted" />
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--slate-900)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="impacto" name="Score Sustentável" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--secondary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="insights-section glass">
        <h3>Insights da Operação</h3>
        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-bullet green"></div>
            <p>O uso de <strong>energia solar</strong> no evento GreenTech reduziu os custos operacionais em 22% em comparação à média histórica.</p>
          </div>
          <div className="insight-item">
            <div className="insight-bullet blue"></div>
            <p>A conformidade documental dos provedores atingiu <strong>98%</strong>, garantindo segurança jurídica para os próximos contratos.</p>
          </div>
          <div className="insight-item">
            <div className="insight-bullet orange"></div>
            <p>Recomendado: Migrar o excedente de consumo do mês de Julho para o mercado livre para otimizar a carga tributária.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
