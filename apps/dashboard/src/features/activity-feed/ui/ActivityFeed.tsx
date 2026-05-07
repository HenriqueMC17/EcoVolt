"use client";
import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
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
  if (action.includes('CREATE')) return <PlusCircle size={18} />;
  if (action.includes('UPDATE')) return <RefreshCcw size={18} />;
  if (action.includes('REMOVE') || action.includes('DELETE')) return <Trash2 size={18} />;
  if (action.includes('USER')) return <UserPlus size={18} />;
  if (action.includes('COMPANY')) return <Building2 size={18} />;
  if (action.includes('FINANCIAL')) return <CreditCard size={18} />;
  if (action.includes('EVENT')) return <Activity size={18} />;
  return <History size={18} />;
};

const getStatusColor = (action: string) => {
  if (action.includes('CREATE')) return 'text-primary bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]';
  if (action.includes('UPDATE')) return 'text-indigo-400 bg-indigo-400/5 border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]';
  if (action.includes('REMOVE') || action.includes('DELETE')) return 'text-rose-400 bg-rose-400/5 border-rose-400/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
  return 'text-slate-500 bg-white/2 border-white/5';
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
      <div className="flex-1 min-w-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor)} />
          <Typography className={cn("text-[10px] uppercase tracking-[0.4em] font-black italic", colorClass)}>
            {title}
          </Typography>
        </div>
        <div className={cn("p-6 rounded-2xl bg-slate-950/80 border border-white/5 backdrop-blur-3xl font-mono text-[11px] text-white/70 space-y-2 relative overflow-hidden", colorClass.replace('text-', 'border-l-'))}>
          <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
          {Object.entries(filtered).map(([key, val]: [string, any]) => (
            <div key={key} className="flex gap-3 group/line">
              <span className="text-slate-600 font-black shrink-0 group-hover/line:text-primary transition-colors">{">"} {key.toUpperCase()}</span>
              <span className="truncate italic">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mt-8 flex flex-wrap gap-8 p-8 rounded-[2rem] bg-slate-950/40 border border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
      {renderSection('LEGACY_STATE', previous, 'text-rose-500', 'bg-rose-500')}
      {renderSection('MODIFIED_STATE', updated || data, 'text-primary', 'bg-primary')}
      {renderSection('PURGED_STATE', deletedRecord, 'text-rose-500', 'bg-rose-500')}
    </motion.div>
  );
};

const ActivityItem = ({ activity, isFirst, isLast }: { activity: any, isFirst?: boolean, isLast?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasStructuredDetails = typeof activity.details === 'object';
  const summary = hasStructuredDetails ? activity.details.summary : activity.details;
  const colorStyles = getStatusColor(activity.action);

  return (
    <div className="relative pl-12 group/item">
      {/* Timeline Thread */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0" />
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        className={cn(
          "absolute left-4 top-10 w-4 h-4 rounded-full border-4 border-slate-950 z-10 transition-all duration-500",
          isExpanded ? "bg-primary scale-125 shadow-[0_0_20px_rgba(34,197,94,0.6)]" : "bg-slate-800"
        )}
      />

      <div 
        onClick={() => hasStructuredDetails && setIsExpanded(!isExpanded)}
        className={cn(
          "p-10 rounded-[2.5rem] bg-slate-950/40 border border-white/5 transition-all duration-700 relative overflow-hidden",
          hasStructuredDetails && "cursor-pointer hover:bg-slate-950/60 hover:border-primary/20",
          isExpanded && "bg-slate-950/80 border-primary/30 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
        
        <div className="flex gap-8 items-start relative z-10">
          <div className={cn("p-4 rounded-2xl border shrink-0 transition-all duration-700 group-hover/item:scale-110 group-hover/item:rotate-6", colorStyles)}>
            {getIcon(activity.action)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Typography className="text-lg font-black text-white italic group-hover/item:text-primary transition-colors">{activity.userName}</Typography>
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                  {activity.entityType}
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <History size={12} />
                <Typography className="text-[10px] font-black tracking-widest uppercase italic">
                  {new Date(activity.createdAt).toLocaleString('pt-BR', { 
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                  })}
                </Typography>
              </div>
            </div>
            
            <Typography className="text-slate-400 font-bold leading-relaxed text-md italic group-hover/item:text-slate-200 transition-colors">
              {summary}
            </Typography>
            
            <AnimatePresence>
              {isExpanded && hasStructuredDetails && (
                <JsonDiffViewer details={activity.details} />
              )}
            </AnimatePresence>
          </div>

          {hasStructuredDetails && (
            <div className={cn("p-2 rounded-full border border-white/5 text-slate-600 mt-2 transition-all duration-500", isExpanded && "rotate-180 bg-primary/10 text-primary border-primary/20")}>
              <ChevronDown size={18} strokeWidth={3} />
            </div>
          )}
        </div>
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

    const headers = ['Data', 'UsuÃ¡rio', 'AÃ§Ã£o', 'Entidade', 'Detalhes'];
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
    { label: 'ALL_NODES', value: undefined },
    { label: 'GRID_EVENTS', value: 'event' },
    { label: 'TELEMETRY', value: 'consumption' },
    { label: 'FINANCIAL', value: 'financials' },
    { label: 'CONTRACTS', value: 'contracts' },
    { label: 'IDENTITIES', value: 'users' },
    { label: 'ENTITIES', value: 'companies' },
    { label: 'PROPOSALS', value: 'proposals' },
    { label: 'DOCUMENT_ID', value: 'documents' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 bg-slate-950/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
        
        <div className="flex items-center gap-8 overflow-x-auto pb-4 lg:pb-0 scrollbar-none flex-1">
          <div className="flex items-center gap-3 shrink-0 mr-4">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
            <Typography className="text-[10px] font-black tracking-[0.4em] text-primary uppercase italic">LIVE_FEED</Typography>
          </div>
          {filterOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setEntityType(opt.value)}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-500 whitespace-nowrap italic",
                entityType === opt.value 
                  ? "bg-primary text-black border-primary shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-105" 
                  : "bg-slate-900/50 text-slate-500 border-white/5 hover:border-white/20 hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          disabled={!activities || activities.length === 0}
          className="flex items-center gap-4 px-10 py-5 rounded-[1.5rem] bg-slate-900 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] hover:border-primary/50 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl italic"
        >
          <Download size={18} className="text-primary" />
          GENERATE_LOG_CSV
        </motion.button>
      </div>

      <div className="space-y-0 relative">
        {activities === undefined ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-32 rounded-[2.5rem] bg-white/5 animate-pulse mb-8" />
          ))
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-950/40 border border-dashed border-white/5 rounded-[4rem] relative overflow-hidden">
            <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 mb-8">
              <History size={48} className="text-slate-800" />
            </div>
            <Typography variant="h3" className="text-slate-500 font-black tracking-tighter uppercase italic mb-2">ZERO_INTEL_FOUND</Typography>
            <Typography className="text-slate-700 font-black tracking-[0.3em] text-[10px] uppercase">Aguardando telemetria da rede...</Typography>
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity: any, idx: number) => (
              <ActivityItem 
                key={activity._id} 
                activity={activity} 
                isFirst={idx === 0}
                isLast={idx === activities.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

