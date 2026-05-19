"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@/shared/lib/convex';
import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Activity, Calendar, Trash2, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

export const ProjectsPage: React.FC = () => {
  const router = useRouter();
  
  const user = useQuery(api.users.getMe, {}); 
  const projects = useQuery(api.projects.list, user ? { userId: user._id } : "skip");
  const removeProject = useMutation(api.projects.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Solar' | 'Wind' | 'Hydro' | 'Biomass'>('Solar');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProject = useMutation(api.projects.create);

  const handleDelete = async (id: Id<"projects">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja realmente excluir este projeto? A ação é irreversível.")) {
      await removeProject({ projectId: id });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    if (!name || !location) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createProject({
        userId: user._id,
        name,
        category,
        location,
      });
      setIsModalOpen(false);
      setName('');
      setCategory('Solar');
      setLocation('');
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Ocorreu um erro ao registrar o ativo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-luxury">
      <header className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Projetos Energéticos
          </h2>
          <p className="text-text-muted text-[10px] font-black tracking-[0.3em] uppercase">
            Gestão e Monitoramento de Ativos
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="nav-link-premium bg-primary text-black hover:bg-primary/90 px-6 py-3 rounded-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Novo Projeto</span>
        </button>
      </header>

      {projects === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="glass-card h-64 bg-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Doc<"projects">) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              onClick={() => router.push(`/projetos/${project._id}`)}
              className="glass-card cursor-pointer group hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                  project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  project.status === 'in_analysis' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                  'bg-white/10 text-white/60 border border-white/20'
                )}>
                  {project.status === 'active' ? 'Ativo' : 
                   project.status === 'in_analysis' ? 'Em Análise' : 'Concluído'}
                </span>
                
                <button 
                  onClick={(e) => handleDelete(project._id, e)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-white/40 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 text-xs text-white/60 font-medium">
                  <div className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-secondary" />
                  </div>
                  {project.location}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60 font-medium">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Activity className="w-3 h-3 text-primary" />
                  </div>
                  {project.category}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60 font-medium">
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white/80" />
                  </div>
                  Criado em {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center group-hover:border-primary/20 transition-colors">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-primary">
                  Ver detalhes operacionais
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card border border-white/5 border-dashed">
              <p className="text-white/40 text-sm font-medium">Nenhum projeto encontrado. Inicie o registro de um novo ativo.</p>
            </div>
          )}
        </div>
      )}

      {/* Novo Projeto Modal (Padrão Enterprise UI) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-lg p-8 relative border border-white/10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Novo Projeto</h2>
                <p className="text-xs text-text-muted">Preencha os dados primários do ativo energético.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Nome do Projeto</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/20" 
                    placeholder="Ex: Usina Solar Norte" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Categoria</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'Solar' | 'Wind' | 'Hydro' | 'Biomass')}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="Solar">Fotovoltaica (Solar)</option>
                    <option value="Wind">Eólica (Wind)</option>
                    <option value="Hydro">Hidrelétrica (Hydro)</option>
                    <option value="Biomass">Biomassa (Biomass)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Localização</label>
                  <input 
                    type="text" 
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/20" 
                    placeholder="Cidade, Estado" 
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white/60 hover:bg-white/5 border border-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest text-black bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrar Ativo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
