import React from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CreditCard,
  Download,
  Filter
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
import './Financeiro.css';

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
  amount: number;
  type: string;
  status: string;
}

const transactions: Transaction[] = [
  { id: 'TR-9021', date: '2026-05-01', description: 'Crédito Evento GreenTech', amount: 15400.00, type: 'credit', status: 'concluded' },
  { id: 'TR-9022', date: '2026-05-02', description: 'Locação Geradores SolarTech', amount: -4200.00, type: 'debit', status: 'pending' },
  { id: 'TR-9023', date: '2026-05-03', description: 'Reembolso Logística - EcoVolt', amount: -1250.50, type: 'debit', status: 'concluded' },
  { id: 'TR-9024', date: '2026-05-04', description: 'Aporte de Capital Energético', amount: 8500.00, type: 'credit', status: 'concluded' },
  { id: 'TR-9025', date: '2026-05-05', description: 'Manutenção Rede de Distribuição', amount: -2800.00, type: 'debit', status: 'concluded' },
];

const Financeiro: React.FC = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Data', accessor: 'date' },
    { header: 'Descrição', accessor: 'description' },
    { 
      header: 'Valor', 
      accessor: 'amount',
      render: (row: Transaction) => (
        <span className={row.amount > 0 ? 'text-success' : 'text-error'}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.amount)}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Transaction) => (
        <span className={`status-pill ${row.status}`}>
          {row.status === 'concluded' ? 'Concluído' : 'Pendente'}
        </span>
      )
    }
  ];

  return (
    <div className="financeiro-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão Financeira</h1>
          <p className="page-subtitle">Acompanhamento de fluxo de caixa, receitas e reembolsos operacionais.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline flex-center gap-2">
            <Download size={18} /> Exportar
          </button>
          <button className="btn btn-primary flex-center gap-2">
            <Filter size={18} /> Filtrar
          </button>
        </div>
      </div>

      <div className="financial-kpis">
        <div className="kpi-card glass">
          <div className="kpi-icon blue"><DollarSign size={24} /></div>
          <div className="kpi-data">
            <span className="label">Receita Bruta</span>
            <span className="value">R$ 328.400</span>
            <span className="trend positive"><ArrowUpRight size={14} /> 12% vs mês anterior</span>
          </div>
        </div>
        <div className="kpi-card glass">
          <div className="kpi-icon orange"><CreditCard size={24} /></div>
          <div className="kpi-data">
            <span className="label">Custos de Energia</span>
            <span className="value">R$ 142.200</span>
            <span className="trend negative"><ArrowDownRight size={14} /> 5% vs mês anterior</span>
          </div>
        </div>
        <div className="kpi-card glass">
          <div className="kpi-icon green"><Wallet size={24} /></div>
          <div className="kpi-data">
            <span className="label">Margem Operacional</span>
            <span className="value">56.7%</span>
            <span className="trend positive"><ArrowUpRight size={14} /> 3% vs mês anterior</span>
          </div>
        </div>
        <div className="kpi-card glass">
          <div className="kpi-icon purple"><DollarSign size={24} /></div>
          <div className="kpi-data">
            <span className="label">Reembolsos Pendentes</span>
            <span className="value">R$ 12.850</span>
            <span className="trend">Aguardando aprovação</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container glass">
          <div className="chart-header">
            <h3>Fluxo de Caixa (Entradas vs Saídas)</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `R$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--slate-900)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="entrada" stroke="var(--primary)" fillOpacity={1} fill="url(#colorEntrada)" strokeWidth={2} />
                <Area type="monotone" dataKey="saida" stroke="var(--error)" fillOpacity={1} fill="url(#colorSaida)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <DataTable 
          title="Transações Recentes" 
          columns={columns} 
          data={transactions} 
        />
      </div>
    </div>
  );
};

export default Financeiro;
