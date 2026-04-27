import React, { useState } from 'react';
import { 
  File, 
  FileText, 
  Upload, 
  Download, 
  Folder, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle,
  ShieldAlert,
  Loader2,
  X,
  Plus,
  ShieldCheck,
  Activity,
  Target,
  Zap,
  Clock,
  Archive,
  Shield,
  Lock,
  Database,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

const getDocIcon = (type: string) => {
  switch(type) {
    case 'Jurídico': return <FileText size={20} className="text-purple-400" />;
    case 'Financeiro': return <File size={20} className="text-primary" />;
    case 'Regulatório': return <ShieldAlert size={20} className="text-amber-400" />;
    default: return <File size={20} className="text-blue-400" />;
  }
};

const Documents: React.FC = () => {
  const documents = useQuery(api.documents.getDocuments, {});
  const events = useQuery(api.events.getEvents, {});
  const contracts = useQuery(api.contracts.getContracts, {});
  const { showToast } = useToast();
  
  const createDocument = useMutation(api.documents.createDocument);
  const updateDocumentStatus = useMutation(api.documents.updateDocumentStatus);
  const removeDocument = useMutation(api.documents.removeDocument);

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Jurídico',
    eventId: '',
    contractId: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('O nome do arquivo é obrigatório', 'error');
      return;
    }
    
    if (!selectedFile) {
      showToast('Por favor, selecione um arquivo.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postUrl = await generateUploadUrl();
      
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      if (!result.ok) throw new Error("Erro ao enviar o arquivo");
      const { storageId } = await result.json();

      await createDocument({
        name: formData.name,
        type: formData.type,
        storageId: storageId,
        eventId: formData.eventId ? (formData.eventId as any) : undefined,
        contractId: formData.contractId ? (formData.contractId as any) : undefined,
      });

      showToast('Documento enviado com sucesso!', 'success');
      setUploadModalOpen(false);
      setFormData({ name: '', type: 'Jurídico', eventId: '', contractId: '' });
      setSelectedFile(null);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Erro ao fazer upload", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidate = async (id: any) => {
    try {
      await updateDocumentStatus({ documentId: id, status: 'valid' });
      showToast('Documento validado com sucesso!', 'success');
    } catch (err) {
      showToast('Erro ao validar documento', 'error');
    }
  };

  const handleReject = async (id: any) => {
    try {
      await updateDocumentStatus({ documentId: id, status: 'rejected' });
      showToast('Documento rejeitado.', 'warning');
    } catch (err) {
      showToast('Erro ao rejeitar documento', 'error');
    }
  };

  const handleDelete = async (id: any) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        await removeDocument({ id });
        showToast('Documento excluído com sucesso!', 'success');
      } catch (err) {
        showToast('Erro ao excluir documento', 'error');
      }
    }
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder ? doc.type === activeFolder : true;
    return matchesSearch && matchesFolder;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-12 bg-primary"></div>
            <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Secure Archive System v2.0</Typography>
          </div>
          <Typography variant="h1" className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
            Digital <span className="text-primary">Vault</span>
          </Typography>
          <Typography className="text-text-muted max-w-xl text-sm font-medium leading-relaxed">
            Repositório central de segurança máxima para contratos, registros regulatórios e documentação estratégica EcoVolt.
          </Typography>
        </div>
        <Button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-black font-black uppercase tracking-widest px-8 py-6 rounded-none clip-path-slant-sm transition-all hover:scale-105 active:scale-95"
        >
          <Upload size={20} className="mr-2" />
          Ingest Document
        </Button>
      </div>

      {/* Vault Status Chunks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-thick border-l-4 border-primary p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={80} />
          </div>
          <Typography className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Integrity Level</Typography>
          <Typography className="text-3xl font-black italic text-white uppercase">99.9% Alpha</Typography>
          <div className="w-full h-1 bg-white/5 mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '99.9%' }}
              className="h-full bg-primary"
            />
          </div>
        </div>
        <div className="glass-thick border-l-4 border-blue-500 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database size={80} />
          </div>
          <Typography className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Total Storage</Typography>
          <Typography className="text-3xl font-black italic text-white uppercase">{documents?.length || 0} Assets</Typography>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-blue-400 uppercase">
            <Activity size={12} className="animate-pulse" /> Live Tracking Active
          </div>
        </div>
        <div className="glass-thick border-l-4 border-amber-500 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Lock size={80} />
          </div>
          <Typography className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Encryption Mode</Typography>
          <Typography className="text-3xl font-black italic text-white uppercase">AES-256 Neural</Typography>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-amber-400 uppercase">
            <ShieldCheck size={12} /> Quantum Guard Enabled
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {['Jurídico', 'Financeiro', 'Operacional', 'Regulatório'].map((folder) => {
          const count = documents?.filter(d => d.type === folder).length || 0;
          const isActive = activeFolder === folder;
          const icons = {
            'Jurídico': <Archive size={24} />,
            'Financeiro': <Zap size={24} />,
            'Operacional': <Activity size={24} />,
            'Regulatório': <Shield size={24} />
          };
          
          return (
            <motion.div 
              key={folder} 
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFolder(isActive ? null : folder)}
              className={`glass-thick p-6 cursor-pointer border transition-all duration-500 relative group overflow-hidden ${
                isActive 
                  ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                  : 'border-white/5 hover:border-primary/40'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-folder-glow"
                  className="absolute inset-0 bg-primary/5 blur-xl pointer-events-none"
                />
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-none transition-all duration-500 ${
                  isActive ? 'bg-primary text-black scale-110' : 'bg-white/5 text-primary group-hover:bg-primary/20'
                }`}>
                  {icons[folder as keyof typeof icons]}
                </div>
                <Typography className={`text-[10px] font-black uppercase tracking-widest ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`}>
                  {count.toString().padStart(2, '0')} Units
                </Typography>
              </div>
              
              <Typography className="text-xl font-black italic uppercase tracking-tight text-white mb-1">{folder}</Typography>
              <div className="flex items-center gap-2">
                <div className={`h-[1px] flex-grow transition-all duration-500 ${isActive ? 'bg-primary' : 'bg-white/10 group-hover:bg-primary/30'}`}></div>
                <ArrowUpRight size={14} className={isActive ? 'text-primary' : 'text-text-muted opacity-0 group-hover:opacity-100 transition-all'} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-thick border-neural relative overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row gap-6 lg:items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-primary"></div>
            <div>
              <Typography className="text-2xl font-black italic uppercase tracking-tight text-white leading-none">
                {activeFolder ? `Entry: ${activeFolder}` : 'Asset Manifest'}
              </Typography>
              <Typography className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mt-1">
                Forensic Audit Trail Active
              </Typography>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group flex-grow md:flex-grow-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="QUERY FILENAME..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/40 border border-white/5 rounded-none pl-12 pr-6 py-3 text-xs font-bold tracking-widest text-white outline-none focus:border-primary transition-all w-full md:w-80 placeholder:text-white/20 uppercase"
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within:w-full transition-all duration-500"></div>
            </div>
            {activeFolder && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveFolder(null)}
                className="border-white/5 hover:border-primary hover:text-primary rounded-none font-black uppercase text-[10px] tracking-widest"
              >
                <X size={14} className="mr-2" /> Reset View
              </Button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Identifier / Registry</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Context Link</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!documents ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Activity className="animate-pulse text-primary" size={40} />
                      <Typography className="text-[10px] font-black uppercase tracking-widest text-primary">Decrypting Archive Data...</Typography>
                    </div>
                  </td>
                </tr>
              ) : filteredDocuments?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Typography className="text-xs font-bold uppercase tracking-widest text-text-muted">No entries matched the current query filters.</Typography>
                  </td>
                </tr>
              ) : (
                filteredDocuments?.map((doc) => (
                  <tr key={doc._id} className="hover:bg-primary/5 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-none bg-white/5 group-hover:bg-primary/20 group-hover:text-black transition-all duration-500 border border-white/5 group-hover:border-primary/40">
                          {getDocIcon(doc.type)}
                        </div>
                        <div>
                          <Typography className="font-black text-sm tracking-tight text-white group-hover:text-primary transition-colors leading-tight">
                            {doc.name.toUpperCase()}
                          </Typography>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] uppercase tracking-widest font-black text-primary/80 bg-primary/5 px-2 py-0.5 border border-primary/20">
                              {doc.type}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-text-muted">
                              #{doc._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Target size={12} className="text-primary opacity-40" />
                        <Typography className="text-[11px] font-bold text-text-main uppercase tracking-wider">{doc.eventName || 'Global Link'}</Typography>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Clock size={12} />
                        <Typography className="text-[11px] font-medium tracking-wider">
                          {format(new Date(doc.uploadedAt), 'dd MMM yyyy', { locale: ptBR }).toUpperCase()}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative">
                        {doc.status === 'valid' ? (
                          <div className="inline-flex items-center gap-2 text-emerald-400">
                            <div className="w-1 h-4 bg-emerald-400"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                          </div>
                        ) : doc.status === 'rejected' ? (
                          <div className="inline-flex items-center gap-2 text-rose-500">
                            <div className="w-1 h-4 bg-rose-500"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Rejected</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-amber-500">
                            <div className="w-1 h-4 bg-amber-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Scanning</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-all duration-500">
                        {doc.status === 'pending_validation' && (
                          <button 
                            onClick={() => handleValidate(doc._id)} 
                            className="p-2 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all"
                            title="Validate Entry"
                          >
                            <ShieldCheck size={16} />
                          </button>
                        )}
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-black transition-all"
                          title="Download Asset"
                        >
                          <Download size={16} />
                        </a>
                        <button 
                          onClick={() => handleDelete(doc._id)} 
                          className="p-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-black transition-all"
                          title="Purge Archive"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUploadModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-xl p-8 relative z-10 border border-border-glass"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h3">Enviar Documento</Typography>
                <button onClick={() => setUploadModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome do Arquivo</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all"
                      placeholder="Ex: Contrato_Fornecedor_X.pdf"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Tipo / Pasta</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Jurídico">Jurídico</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Operacional">Operacional</option>
                      <option value="Regulatório">Regulatório</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Vincular a Evento</label>
                    <select 
                      value={formData.eventId}
                      onChange={e => setFormData({...formData, eventId: e.target.value})}
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Selecione um Evento...</option>
                      {events?.map(ev => (
                        <option key={ev._id} value={ev._id}>{ev.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Vincular a Contrato</label>
                    <select 
                      value={formData.contractId}
                      onChange={e => setFormData({...formData, contractId: e.target.value})}
                      className="w-full bg-white/5 border border-border-glass rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Selecione um Contrato...</option>
                      {contracts?.map(ct => (
                        <option key={ct._id} value={ct._id}>{ct.event} - {ct.provider}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    accept=".pdf,.xml,.jpg,.jpeg,.png"
                  />
                  <div className="border-2 border-dashed border-border-glass group-hover:border-primary/50 rounded-xl p-10 text-center bg-white/2 group-hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3">
                    {!selectedFile ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                          <Upload size={32} />
                        </div>
                        <Typography variant="h4" className="text-lg font-semibold">Selecione ou arraste o arquivo</Typography>
                        <Typography variant="small" className="text-text-muted">PDF, XML, JPG, PNG (Max 10MB)</Typography>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-2">
                          <FileText size={32} />
                        </div>
                        <Typography variant="h4" className="text-lg font-semibold text-emerald-400">{selectedFile.name}</Typography>
                        <Typography variant="small" className="text-text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Typography>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setUploadModalOpen(false)} type="button">
                    Cancelar
                  </Button>
                  <Button className="flex-1" type="submit" disabled={isSubmitting || !selectedFile}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Fazer Upload'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Documents;
