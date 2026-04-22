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
  Plus
} from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2">Documentos & Compliance</Typography>
          <Typography variant="muted">Repositório central de contratos, termos, comprovantes e regulamentações.</Typography>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload size={18} />
          Enviar Documento
        </Button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Jurídico', 'Financeiro', 'Operacional', 'Regulatório'].map((folder) => {
          const count = documents?.filter(d => d.type === folder).length || 0;
          const isActive = activeFolder === folder;
          return (
            <motion.div 
              key={folder} 
              whileHover={{ y: -5 }}
              onClick={() => setActiveFolder(isActive ? null : folder)}
              className={`glass-card p-6 cursor-pointer border transition-all duration-300 ${
                isActive ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-border-glass hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary text-black' : 'bg-primary/10 text-primary'
                }`}>
                  <Folder size={24} />
                </div>
                <div>
                  <Typography variant="h4" className="text-lg">{folder}</Typography>
                  <Typography variant="small" className="text-text-muted">{count} arquivos</Typography>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border-glass flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Typography variant="h4">
            {activeFolder ? `Arquivos: ${activeFolder}` : 'Todos os Arquivos'}
          </Typography>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar documento..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-border-glass rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-primary transition-all w-full md:w-64"
              />
            </div>
            {activeFolder && (
              <Button variant="outline" size="sm" onClick={() => setActiveFolder(null)}>
                <X size={18} /> Limpar
              </Button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Arquivo</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Vínculo</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass">
              {!documents ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin inline-block text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredDocuments?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    Nenhum documento encontrado.
                  </td>
                </tr>
              ) : (
                filteredDocuments?.map((doc) => (
                  <tr key={doc._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                          {getDocIcon(doc.type)}
                        </div>
                        <div>
                          <Typography className="font-semibold text-sm leading-tight">{doc.name}</Typography>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">
                            {doc.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Typography variant="small" className="text-text-main">{doc.eventName}</Typography>
                    </td>
                    <td className="px-6 py-4">
                      <Typography variant="small" className="text-text-muted">
                        {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                      </Typography>
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === 'valid' ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <CheckCircle size={14} /> Validado
                        </div>
                      ) : doc.status === 'rejected' ? (
                        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                          <X size={14} /> Rejeitado
                        </div>
                      ) : (
                        <span className="text-[10px] px-2 py-1 rounded bg-amber-400/10 text-amber-400 font-bold uppercase tracking-wider">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        {doc.status === 'pending_validation' && (
                          <Button variant="ghost" size="sm" onClick={() => handleValidate(doc._id)} className="text-emerald-400 hover:bg-emerald-400/10 p-2">
                            <CheckCircle size={18} />
                          </Button>
                        )}
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                          <Download size={18} />
                        </a>
                        <button onClick={() => handleDelete(doc._id)} className="p-2 hover:bg-rose-400/10 rounded-lg transition-colors text-rose-400">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
