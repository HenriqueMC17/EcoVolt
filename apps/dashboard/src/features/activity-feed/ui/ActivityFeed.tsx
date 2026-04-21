import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { 
  PlusCircle, 
  RefreshCcw, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  Building2, 
  FileText, 
  CreditCard,
  History,
  Activity,
  Filter,
  Download,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

interface ActivityFeedProps {
  limit?: number;
  userEmail: string;
}

const getIcon = (action: string) => {
  if (action.includes('CREATE')) return <PlusCircle size={16} />;
  if (action.includes('UPDATE')) return <RefreshCcw size={16} />;
  if (action.includes('REMOVE') || action.includes('DELETE')) return <Trash2 size={16} />;
  if (action.includes('USER')) return <UserPlus size={16} />;
  if (action.includes('COMPANY')) return <Building2 size={16} />;
  if (action.includes('FINANCIAL')) return <CreditCard size={16} />;
  if (action.includes('EVENT')) return <Activity size={16} />;
  return <History size={16} />;
};

const getStatusColor = (action: string) => {
  if (action.includes('CREATE')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (action.includes('UPDATE')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  if (action.includes('REMOVE') || action.includes('DELETE')) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  return 'text-text-muted bg-white/5 border-white/10';
};

const JsonDiffViewer = ({ details }: { details: any }) => {
  const { previous, updated, data, deletedRecord } = details;

  const renderSection = (title: string, obj: any, colorClass: string, dotColor: string) => {
    if (!obj) return null;
    
    const filtered = Object.entries(obj)
      .filter(([key]) => !key.startsWith('_') && key !== 'summary')
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

    if (Object.keys(filtered).length === 0) return null;

    return (
      <div className="flex-1 min-w-[200px]">
        <p className={cn("text-[10px] uppercase tracking-widest font-black mb-2 flex items-center gap-2", colorClass)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)}></span>
          {title}
        </p>
        <div className={cn("p-4 rounded-xl bg-black/40 border-l-4 font-mono text-[11px] text-white/80 space-y-1", colorClass.replace('text-', 'border-'))}>
          {Object.entries(filtered).map(([key, val]: [string, any]) => (
            <div key={key}>
              <span className="text-primary/70">{key}:</span>{" "}
              <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex flex-wrap gap-4 p-4 rounded-2xl bg-white/2 border border-white/5"
    >
      {renderSection('Estado Anterior', previous, 'text-rose-400', 'bg-rose-400')}
      {renderSection('Novos Dados / Alterações', updated || data, 'text-emerald-400', 'bg-emerald-400')}
      {renderSection('Registro Removido', deletedRecord, 'text-rose-400', 'bg-rose-400')}
    </motion.div>
  );
};

const ActivityItem = ({ activity }: { activity: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasStructuredDetails = typeof activity.details === 'object';
  const summary = hasStructuredDetails ? activity.details.summary : activity.details;
  const colorStyles = getStatusColor(activity.action);

  return (
    <div 
      onClick={() => hasStructuredDetails && setIsExpanded(!isExpanded)}
      className={cn(
        "p-5 rounded-2xl bg-white/2 border border-white/5 transition-all duration-300",
        hasStructuredDetails && "cursor-pointer hover:bg-white/5 hover:translate-x-1",
        isExpanded && "bg-white/5 border-primary/20 shadow-xl"
      )}
    >
      <div className="flex gap-4 items-start">
        <div className={cn("p-3 rounded-xl border shrink-0", colorStyles)}>
          {getIcon(activity.action)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{activity.userName}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-muted">
                {activity.entityType}
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-medium">
              {new Date(activity.createdAt).toLocaleString('pt-BR', { 
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
              })}
            </span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {summary}
          </p>
          
          <AnimatePresence>
            {isExpanded && hasStructuredDetails && (
              <JsonDiffViewer details={activity.details} />
            )}
          </AnimatePresence>
        </div>
        {hasStructuredDetails && (
          <div className="text-text-muted/50 pt-1">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </div>
    </div>
  );
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 20, userEmail }) => {
  const [entityType, setEntityType] = useState<string | undefined>(undefined);
  const activities = useQuery(api.activities.getRecentActivities, { 
    limit, 
    userEmail,
    entityType: entityType || undefined 
  });

  const exportToCSV = () => {
    if (!activities || activities.length === 0) return;

    const headers = ['Data', 'Usuário', 'Ação', 'Entidade', 'Detalhes'];
    const rows = activities.map(a => [
      new Date(a.createdAt).toLocaleString('pt-BR'),
      a.userName,
      a.action,
      a.entityType,
      typeof a.details === 'object' 
        ? (a.details.summary || JSON.stringify(a.details)).replace(/,/g, ';')
        : a.details.replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecovolt_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const filterOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Eventos', value: 'event' },
    { label: 'Consumo', value: 'consumption' },
    { label: 'Financeiro', value: 'financials' },
    { label: 'Contratos', value: 'contracts' },
    { label: 'Usuários', value: 'users' },
    { label: 'Empresas', value: 'companies' },
    { label: 'Propostas', value: 'proposals' },
    { label: 'Documentos', value: 'documents' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setEntityType(opt.value)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                entityType === opt.value 
                  ? "bg-primary text-black border-primary" 
                  : "bg-white/5 text-text-muted border-white/10 hover:border-white/20 hover:bg-white/10"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={!activities || activities.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:border-primary/50 hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Exportar Auditoria
        </button>
      </div>

      <div className="space-y-3">
        {activities === undefined ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/2 border border-dashed border-white/10 rounded-2xl">
            <History size={48} className="text-text-muted/20 mb-4" />
            <Typography variant="h4" className="text-text-muted mb-1">Sem Histórico</Typography>
            <Typography variant="muted" className="text-xs">Nenhuma atividade registrada para os filtros selecionados.</Typography>
          </div>
        ) : (
          activities.map((activity: any) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
