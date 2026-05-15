'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Zap, DollarSign, AlertTriangle, ArrowUpRight, 
  Calendar, Clock, Activity, FileText, TrendingUp, 
  ShieldAlert, ArrowRight, Leaf, Target 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/ui/card';
import { Badge } from '../../../../shared/ui/badge';
import { Button } from '../../../../shared/ui/button';
import { cn } from '../../../../shared/lib/utils';

const dataPerformance = [
  { name: 'Jan', previsto: 4000, realizado: 2400 },
  { name: 'Fev', previsto: 3000, realizado: 1398 },
  { name: 'Mar', previsto: 2000, realizado: 9800 },
  { name: 'Abr', previsto: 2780, realizado: 3908 },
  { name: 'Mai', previsto: 1890, realizado: 4800 },
  { name: 'Jun', previsto: 2390, realizado: 3800 },
];

const dataContratos = [
  { name: 'Ativos', value: 45, color: '#aa3bff' },       // primary
  { name: 'Assinatura', value: 25, color: '#00d2ff' },   // secondary
  { name: 'NegociaÃ§Ã£o', value: 20, color: '#f59e0b' },   // warning
  { name: 'Encerrados', value: 10, color: '#6b6375' },   // muted
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function OverviewPage() {
  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Badge variant="success" className="mb-2 bg-success/20 text-success uppercase tracking-widest text-[10px]">
            Centro de Comando AI
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Centro de Comando</h1>
          <p className="text-muted mt-1 text-sm">
            VisÃ£o executiva da operaÃ§Ã£o energÃ©tica, contratos e eventos em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText size={16} /> RelatÃ³rio Executivo
          </Button>
          <Button className="gap-2">
            <TrendingUp size={16} /> Simular CenÃ¡rios
          </Button>
        </div>
      </motion.div>

      {/* Intelligence Banner */}
      <motion.div variants={itemVariants}>
        <div className="glass-card bg-warning/5 border-warning/20 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-12 h-12 shrink-0 rounded-xl bg-warning/20 flex items-center justify-center text-warning shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <ShieldAlert size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warning">Alerta AI</span>
              <h4 className="text-base font-semibold text-foreground">AtenÃ§Ã£o NecessÃ¡ria na OperaÃ§Ã£o</h4>
            </div>
            <p className="text-sm text-muted">
              Existem <strong className="text-foreground">3 desvios crÃ­ticos</strong> identificados na reconciliaÃ§Ã£o financeira e <strong className="text-foreground">2 contratos</strong> vencendo nos prÃ³ximos 7 dias.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0 relative z-10">
            <Button variant="outline" size="sm" className="border-warning/50 hover:bg-warning hover:text-white">Ver Detalhes</Button>
            <Button variant="ghost" size="icon" className="rounded-full text-warning hover:bg-warning/20">
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Eventos Ativos', value: '12', trend: '+2', trendLabel: 'Novos eventos esta semana', icon: Users, color: 'text-success', bg: 'bg-success/10', trendColor: 'text-success' },
          { label: 'InjeÃ§Ã£o Total', value: '450', unit: 'MWh', trend: '+15%', trendLabel: 'vs mÃªs anterior', icon: Zap, color: 'text-primary', bg: 'bg-primary/10', trendColor: 'text-success' },
          { label: 'Economia Gerada', value: 'R$ 42.5k', trend: '12.4%', trendLabel: 'OtimizaÃ§Ã£o de custos', icon: DollarSign, color: 'text-warning', bg: 'bg-warning/10', trendColor: 'text-success', isTarget: true },
          { label: 'CO2 Evitado', value: '15.8', unit: 't', trend: '92%', trendLabel: 'Meta de sustentabilidade', icon: Leaf, color: 'text-secondary', bg: 'bg-secondary/10', trendColor: 'text-success' },
        ].map((kpi, idx) => (
          <Card key={idx} className="hover:border-white/20 transition-all duration-300 group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300", kpi.bg, kpi.color)}>
                <kpi.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted mb-1">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {kpi.value} <span className="text-sm font-normal text-muted">{kpi.unit}</span>
                  </h3>
                  <div className={cn("flex items-center text-[11px] font-bold", kpi.trendColor)}>
                    {kpi.isTarget ? <Target size={12} className="mr-1" /> : <ArrowUpRight size={12} className="mr-1" />}
                    {kpi.trend}
                  </div>
                </div>
                <p className="text-xs text-muted mt-1">{kpi.trendLabel}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              <CardTitle className="text-lg">Performance EnergÃ©tica</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary"></div> Previsto
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(170,59,255,0.8)]"></div> Realizado
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataPerformance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#aa3bff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b6375', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b6375', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(26,29,36,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="previsto" stroke="#00d2ff" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" />
                <Area type="monotone" dataKey="realizado" stroke="#aa3bff" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-secondary" />
              <CardTitle className="text-lg">Lifecycle de Contratos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataContratos}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataContratos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(26,29,36,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ fontSize: '13px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text for the donut chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">100</span>
                <span className="text-[10px] text-muted uppercase">Total</span>
              </div>
            </div>
            
            <div className="w-full mt-6 space-y-2">
              {dataContratos.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-medium text-muted">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grids */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              <CardTitle className="text-base">PendÃªncias CrÃ­ticas</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-semibold">Ver Painel</Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 pt-4">
            {[
              { title: 'Contrato #459 expira em 48h', time: 'HÃ¡ 2 horas', status: 'destructive', label: 'Urgente' },
              { title: 'InconsistÃªncia na ReconciliaÃ§Ã£o PCH-02', time: 'HÃ¡ 5 horas', status: 'warning', label: 'AtenÃ§Ã£o' },
              { title: 'RelatÃ³rio de conformidade pendente', time: 'Hoje', status: 'default', label: 'Novo' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-muted flex items-center gap-1"><Clock size={10} /> {item.time}</p>
                </div>
                <Badge variant={item.status as "default" | "secondary" | "destructive" | "outline" | "success" | "warning"} className="shrink-0">{item.label}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <CardTitle className="text-base">PrÃ³ximas OperaÃ§Ãµes</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-semibold">CalendÃ¡rio</Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 pt-4">
            {[
              { name: 'EcoFestival 2024', loc: 'Parque Ibirapuera, SP', date: '15', month: 'MAI', status: 'success', label: 'Confirmado' },
              { name: 'Rock in Rio 2024', loc: 'Cidade do Rock, RJ', date: '13', month: 'SET', status: 'secondary', label: 'Agendado' },
              { name: 'Congresso Tech', loc: 'Expominas, MG', date: '22', month: 'MAI', status: 'warning', label: 'Pendente' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="w-12 h-12 shrink-0 rounded-lg bg-background flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <span className="text-lg font-bold text-primary leading-none">{item.date}</span>
                  <span className="text-[9px] font-bold text-muted uppercase mt-0.5">{item.month}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted truncate">{item.loc}</p>
                </div>
                <Badge variant={item.status as "default" | "secondary" | "destructive" | "outline" | "success" | "warning"} className="shrink-0 text-[10px]">{item.label}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-info text-secondary" />
              <CardTitle className="text-base">Atividade Recente</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-semibold">Logs</Button>
          </CardHeader>
          <CardContent className="flex-1 pt-4 relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-white/10"></div>
            <div className="space-y-6 relative">
              {[
                { user: 'Carlos A.', action: 'aprovou proposta', target: 'SolarTech', time: '14:30', color: 'bg-primary' },
                { user: 'Mariana L.', action: 'assinou contrato', target: 'PCH-02', time: '11:15', color: 'bg-success' },
                { user: 'Sistema', action: 'detectou pico', target: 'Setor A', time: '08:45', color: 'bg-warning' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn("w-2.5 h-2.5 mt-1.5 rounded-full ring-4 ring-background shrink-0 z-10", item.color)}></div>
                  <div>
                    <p className="text-sm text-muted">
                      <strong className="text-foreground">{item.user}</strong> {item.action} <strong className="text-foreground">{item.target}</strong>
                    </p>
                    <p className="text-xs text-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
