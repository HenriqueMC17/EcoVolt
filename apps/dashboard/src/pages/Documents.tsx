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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { useToast } from '../context/ToastContext';

const getDocIcon = (type: string) => {
  switch(type) {
    case 'Jurídico': return <FileText size={20} color="#8b5cf6" />;
    case 'Financeiro': return <File size={20} color="#10b981" />;
    case 'Regulatório': return <ShieldAlert size={20} color="#f59e0b" />;
    default: return <File size={20} color="#3b82f6" />;
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
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Documentos & Compliance</h2>
          <p style={{ color: 'var(--text-muted)' }}>Repositório central de contratos, termos, comprovantes e regulamentações.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setUploadModalOpen(true)}>
          <Upload size={18} />
          Enviar Documento
        </button>
      </header>

      {/* Folders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {['Jurídico', 'Financeiro', 'Operacional', 'Regulatório'].map((folder) => {
          const count = documents?.filter(d => d.type === folder).length || 0;
          const isActive = activeFolder === folder;
          return (
            <div 
              key={folder} 
              className={`card glass ${isActive ? 'active' : ''}`} 
              onClick={() => setActiveFolder(isActive ? null : folder)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '20px', 
                cursor: 'pointer',
                border: isActive ? '1px solid var(--secondary)' : '1px solid var(--border)',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: isActive ? 'var(--secondary)' : 'rgba(59, 130, 246, 0.1)', 
                color: isActive ? 'white' : 'var(--secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                <Folder size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600 }}>{folder}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count} arquivos</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginRight: 'auto' }}>
            {activeFolder ? `Arquivos: ${activeFolder}` : 'Todos os Arquivos'}
          </h4>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar documento..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px 8px 40px', color: 'white', outline: 'none' }}
            />
          </div>
          {activeFolder && (
            <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setActiveFolder(null)}>
              <X size={18} /> Limpar Filtro
            </button>
          )}
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>NOME DO ARQUIVO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>VÍNCULO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>DATA</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {!documents ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center' }}><Loader2 className="spin" style={{ margin: '0 auto' }} /></td>
              </tr>
            ) : filteredDocuments?.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum documento encontrado.</td>
              </tr>
            ) : filteredDocuments?.map((doc) => (
              <tr key={doc._id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getDocIcon(doc.type)}
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</p>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-block' }}>
                        {doc.type}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontWeight: 500 }}>{doc.eventName}</p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontSize: '0.9rem' }}>{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {doc.status === 'valid' ? 
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CheckCircle size={16} /> Validado
                    </span> : 
                    doc.status === 'rejected' ?
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                      <X size={16} /> Rejeitado
                    </span> :
                    <span className="badge badge-warning">Pendente</span>
                  }
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {doc.status === 'pending_validation' && (
                      <button onClick={() => handleValidate(doc._id)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        Validar
                      </button>
                    )}
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Download size={18} />
                    </a>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
            <motion.div 
              className="modal-content glass"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Enviar Documento</h3>
                <button onClick={() => setUploadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nome do Arquivo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Ex: Contrato_Fornecedor_X.pdf"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tipo / Pasta</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="Jurídico">Jurídico</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Operacional">Operacional</option>
                    <option value="Regulatório">Regulatório</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Vincular a Evento (Opcional)</label>
                  <select 
                    value={formData.eventId}
                    onChange={e => setFormData({...formData, eventId: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Selecione um Evento...</option>
                    {events?.map(ev => (
                      <option key={ev._id} value={ev._id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Vincular a Contrato (Opcional)</label>
                  <select 
                    value={formData.contractId}
                    onChange={e => setFormData({...formData, contractId: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Selecione um Contrato...</option>
                    {contracts?.map(ct => (
                      <option key={ct._id} value={ct._id}>{ct.event} - {ct.provider}</option>
                    ))}
                  </select>
                </div>

                <div style={{ padding: '24px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', marginTop: '8px', position: 'relative' }}>
                  <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                    accept=".pdf,.xml,.jpg,.jpeg,.png"
                  />
                  {!selectedFile ? (
                    <>
                      <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--secondary)' }} />
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Arraste o arquivo aqui ou clique para selecionar</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, XML, JPG, PNG (Max 10MB)</p>
                    </>
                  ) : (
                    <>
                      <FileText size={32} style={{ margin: '0 auto 12px', color: 'var(--success)' }} />
                      <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{selectedFile.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  )}
                </div>
                
                {errorMsg && (
                  <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginTop: '8px' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setUploadModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Fazer Upload'}
                  </button>
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
