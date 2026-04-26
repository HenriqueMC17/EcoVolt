import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import { Plus, MapPin, Activity, Calendar, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const user = useQuery(api.users.getMe, { email: "henrique@ecovolt.com" }) as any; // Simulated auth for now
  const projects = useQuery(api.projects.list, user ? { userId: user._id } : "skip") as any[];
  const removeProject = useMutation(api.projects.remove) as any;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja realmente excluir este projeto?")) {
      await removeProject({ projectId: id });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Projetos Energéticos</h1>
          <p className="text-gray-400 mt-2">Gerencie e monitore seus ativos de energia renovável.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/projetos/${project._id}`)}
            className="card glass cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`badge ${
                project.status === 'active' ? 'badge-success' : 
                project.status === 'in_analysis' ? 'badge-warning' : 'badge-info'
              }`}>
                {project.status === 'active' ? 'Ativo' : 
                 project.status === 'in_analysis' ? 'Em Análise' : 'Concluído'}
              </span>
              <button 
                onClick={(e) => handleDelete(project._id, e)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            
            <div className="space-y-3 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                {project.location}
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-green-500" />
                {project.category}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                Criado em {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ver detalhes</span>
              <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}

        {projects?.length === 0 && (
          <div className="col-span-full py-20 text-center card glass">
            <p className="text-gray-500">Nenhum projeto encontrado. Comece criando um novo!</p>
          </div>
        )}
      </div>

      {/* Modal is simulated here for brevity, in real app would be a separate component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card glass w-full max-w-md p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Novo Projeto</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Projeto</label>
                <input type="text" className="input w-full" placeholder="Ex: Usina Solar Norte" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
                <select className="input w-full">
                  <option>Solar</option>
                  <option>Wind</option>
                  <option>Hydro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Localização</label>
                <input type="text" className="input w-full" placeholder="Cidade, Estado" />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn btn-primary flex-1">Criar</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;
