"use client";
import React from 'react';
import { 
  FileText, 
  Folder, 
  Search, 
  Upload, 
  MoreVertical, 
  Download, 
  Share2, 
  Trash2,
  Clock,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/Button';

const mockDocs = [
  { id: 1, name: 'Contrato_Verao_2026.pdf', size: '2.4 MB', date: '2026-04-20', type: 'contract' },
  { id: 2, name: 'Laudo_Tecnico_Subestacao.pdf', size: '5.1 MB', date: '2026-04-18', type: 'technical' },
  { id: 3, name: 'Planta_Eletrica_Palco_A.dwg', size: '12.8 MB', date: '2026-04-15', type: 'blueprint' },
  { id: 4, name: 'Nota_Fiscal_Geradores.pdf', size: '1.2 MB', date: '2026-04-22', type: 'invoice' },
  { id: 5, name: 'SLA_Provedor_Solar.pdf', size: '850 KB', date: '2026-04-10', type: 'contract' },
];

export const Documents: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Folder size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
              Digital Assets
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
            Repositório de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Documentos</span>
          </Typography>
          <Typography className="text-slate-400 max-w-2xl">
            Gestão Eletrônica de Documentos (GED) para contratos, plantas técnicas, licenças e históricos operacionais.
          </Typography>
        </div>
        
        <Button className="btn-premium-primary h-14 px-10 rounded-2xl">
          <Upload className="mr-2" size={20} />
          Upload de Arquivo
        </Button>
      </header>

      {/* Explorer Bar */}
      <div className="flex flex-col md:flex-row gap-5 items-center bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-3 rounded-[2.5rem]">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar documentos por nome, tag ou data..." 
            className="w-full bg-slate-950/40 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
           <button className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all">
             <Filter size={20} />
           </button>
           <div className="h-10 w-[1px] bg-slate-800 mx-2 self-center" />
           <button className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-blue-400 transition-all">
             <Grid size={20} />
           </button>
           <button className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all">
             <List size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockDocs.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card group p-6 border-slate-800/50 hover:border-blue-500/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-500">
                <FileText size={24} />
              </div>
              <button className="p-2 text-slate-600 hover:text-white transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="space-y-1">
              <Typography className="text-white font-bold text-sm truncate group-hover:text-blue-50 transition-colors" title={doc.name}>
                {doc.name}
              </Typography>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>{doc.size}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{doc.type}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={12} />
                <span className="text-[10px] font-bold">{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-500 hover:text-blue-400 transition-colors">
                  <Download size={16} />
                </button>
                <button className="p-2 text-slate-500 hover:text-blue-400 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

