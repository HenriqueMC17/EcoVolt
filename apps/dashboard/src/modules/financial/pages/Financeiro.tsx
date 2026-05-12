import React from 'react';
import { 
  DollarSign, 
  Wallet, 
  Download,
  FileText,
  TrendingUp,
  ChevronRight,
  Activity,
  History,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import './Financeiro.css';
import '../../../styles/enterprise-components.css';

const cashFlowData = [
  { name: 'Jan', entrada: 45000, saida: 32000 },
  { name: 'Fev', entrada: 52000, saida: 38000 },
  { name: 'Mar', entrada: 48000, saida: 41000 },
  { name: 'Abr', entrada: 61000, saida: 45000 },
  { name: 'Mai', entrada: 55000, saida: 42000 },
  { name: 'Jun', entrada: 67000, saida: 48000 },
];

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'concluded' | 'pending' | 'failed';
}

const transactions: Transaction[] = [
  { id: 'TR-9021', date: '2026-05-01', description: 'Crédito Evento GreenTech', category: 'Receita Operacional', amount: 15400.00, type: 'credit', status: 'concluded' },
  { id: 'TR-9022', date: '2026-05-02', description: 'Locação Geradores SolarTech', category: 'Custo Energia', amount: -4200.00, type: 'debit', status: 'pending' },
  { id: 'TR-9023', date: '2026-05-03', description: 'Reembolso Logística - EcoVolt', category: 'Logística', amount: -1250.50, type: 'debit', status: 'concluded' },
  { id: 'TR-9024', date: '2026-05-04', description: 'Aporte de Capital Energético', category: 'Investimento', amount: 8500.00, type: 'credit', status: 'concluded' },
  { id: 'TR-9025', date: '2026-05-05', description: 'Manutenção Rede de Distribuição', category: 'Manutenção', amount: -2800.00, type: 'debit', status: 'concluded' },
  { id: 'TR-9026', date: '2026-05-06', description: 'Pagamento AWS Cloud', category: 'Infraestrutura', amount: -450.00, type: 'debit', status: 'failed' },
];

const Financeiro: React.FC = () => {
  const columns = [
    { 
      header: 'Transação', 
      accessor: 'description' as keyof Transaction,
      sortable: true,
      render: (row: Transaction) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary">{row.description}</span>
          <span className="id-badge">{row.id}</span>
        </div>
      )
    },
    { 
      header: 'Categoria', 
      accessor: 'category' as keyof Transaction,
      sortable: true,
      render: (row: Transaction) => (
        <span className="px-2 py-1 bg-white/5 rounded text-xs font-medium">
          {row.category}
        </span>
      )
    },
    { 
      header: 'Data', 
      accessor: 'date' as keyof Transaction,
      sortable: true,
      render: (row: Transaction) => (
        <div className="flex items-center gap-2 text-muted text-sm">
          <History size={14} />
          <span>{new Date(row.date).toLocaleDateString('pt-BR')}</span>
        </div>
      )
    },
    { 
      header: 'Valor', 
      accessor: 'amount' as keyof Transaction,
      sortable: true,
      render: (row: Transaction) => (
        <span className={row.amount > 0 ? 'amount-positive' : 'amount-negative'}>
          {row.amount > 0 ? '+' : ''}
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.amount)}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof Transaction,
      sortable: true,
      render: (row: Transaction) => {
        const statusMap: Record<Transaction['status'], { type: StatusType; label: string }> = {
          concluded: { type: 'success', label: 'Liquidado' },
          pending: { type: 'warning', label: 'Processando' },
          failed: { type: 'error', label: 'Falhou' }
        };
        const config = statusMap[row.status];
        return <StatusBadge status={config.type} label={config.label} variant="glass" size="sm" />;
      }
    },
    {
      header: 'Ações',
      accessor: 'id' as keyof Transaction,
      render: () => (
        <button className="btn-icon-link">
          Detalhes <ChevronRight size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="financeiro-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Controladoria & Tesouraria</div>
          <h1 className="header-title">Intelligence Financeira</h1>
          <p className="header-subtitle">Gestão de fluxo de caixa, liquidação de contratos e saúde econômica da operação.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download size={18} /> 
            Exportar
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <FileText size={18} /> 
            Nova Fatura
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass finance-intelligence">
        <div className="banner-icon">
          <Activity className="text-secondary" />
        </div>
        <div className="banner-content">
          <h4>Previsão de Receita</h4>
          <p>Expectativa de entrada de <strong>R$ 158.400,00</strong> para os próximos 15 dias baseado em contratos ativos.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-text">Ver Projeção</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box primary">
              <Wallet size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +12.4%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Saldo em Conta</span>
            <h2 className="kpi-value">R$ 248.500</h2>
            <p className="kpi-desc">Liquidez imediata disponível</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box secondary">
              <DollarSign size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +8.1%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Receita do Mês</span>
            <h2 className="kpi-value">R$ 124.800</h2>
            <p className="kpi-desc">Faturamento bruto consolidado</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box error">
              <TrendingDown size={20} />
            </div>
            <div className="kpi-trend negative">
              <TrendingUp size={12} /> -2.5%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Despesas Operacionais</span>
            <h2 className="kpi-value">R$ 42.300</h2>
            <p className="kpi-desc">Custos fixos e variáveis</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Taxa de Inadimplência</span>
            <h2 className="kpi-value">0.8%</h2>
            <p className="kpi-desc">Nível crítico de segurança: <span className="text-success">Baixo</span></p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="content-card-enterprise">
          <div className="card-header">
            <div className="header-info">
              <h3>Fluxo de Caixa</h3>
              <p>Comparativo mensal de Entradas vs Saídas</p>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-enterprise">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--error)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--error)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--text-muted)', fontSize: 12}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--text-muted)', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-card)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--text-main)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="entrada" 
                    stroke="var(--primary)" 
                    fillOpacity={1} 
                    fill="url(#colorEntrada)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="saida" 
                    stroke="var(--error)" 
                    fillOpacity={1} 
                    fill="url(#colorSaida)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="content-card-enterprise">
          <div className="card-header">
            <div className="header-info">
              <h3>Composição de Custos</h3>
              <p>Distribuição por categoria</p>
            </div>
          </div>
          <div className="card-body flex items-center justify-center">
            {/* Simplified for now, could be a PieChart */}
            <div className="flex flex-col gap-4 w-full">
              {[
                { label: 'Energia', value: 45, color: 'var(--primary)' },
                { label: 'Operacional', value: 30, color: 'var(--secondary)' },
                { label: 'Logística', value: 15, color: 'var(--success)' },
                { label: 'Outros', value: 10, color: 'var(--warning)' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{item.label}</span>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Últimas Transações</h3>
            <p>Histórico detalhado de movimentações financeiras</p>
          </div>
          <div className="header-actions">
            <button className="btn-text">Ver Tudo</button>
          </div>
        </div>
        <div className="card-body">
          <DataTable data={transactions} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
