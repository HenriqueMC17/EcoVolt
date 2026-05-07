'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/Button';
import { Zap, ArrowRight, ShieldCheck, BarChart3, Globe, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Hero: React.FC = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Immersive Background Visuals */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-emerald-500/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full" />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center"
      >
        {/* Protocol Badge */}
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900/60 border border-emerald-500/20 mb-10 backdrop-blur-2xl shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shadow-[0_0_10px_rgba(16,185,129,1)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Next-Gen Energy Protocol 2.0</span>
        </motion.div>

        {/* Main Header */}
        <motion.div variants={itemVariants} className="max-w-5xl">
          <Typography variant="h1" className="text-5xl md:text-8xl font-black tracking-[-0.06em] text-white uppercase italic leading-[0.9] mb-8">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-blue-500">Grid</span> <br />
            Intelligence
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-2xl">
          <Typography className="text-lg md:text-xl font-medium text-slate-400 tracking-tight leading-relaxed mb-12">
            EcoVolt orquestra o fluxo de energia de empresas globais através de <span className="text-white font-black italic">Sistemas de Telemetria Neural</span> e Otimização em Tempo Real.
          </Typography>
        </motion.div>

        {/* Primary Actions */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md px-4">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto btn-premium-primary h-16 px-12 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] group"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em]">Acessar Terminal</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto h-16 px-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:border-white/20"
          >
            Request Protocol
          </motion.button>
        </motion.div>

        {/* Strategic Visual Element */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 relative group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 glass rounded-[3rem] p-2 border border-white/5 shadow-2xl"
          >
            <img 
              src="/futuristic_energy_core_1777219120988.png" 
              alt="EcoVolt Core" 
              className="w-full max-w-[800px] h-auto rounded-[2.5rem] shadow-2xl object-cover mix-blend-lighten opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
            />
            
            {/* HUD Elements Over Image */}
            <div className="absolute top-10 left-10 p-4 glass-thick rounded-2xl border border-primary/20 flex items-center gap-3">
              <Cpu size={20} className="text-primary animate-pulse" />
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Grid Status</p>
                <p className="text-xs font-black text-white tracking-tighter uppercase italic">SYNC_STABLE</p>
              </div>
            </div>

            <div className="absolute bottom-10 right-10 p-4 glass-thick rounded-2xl border border-blue-400/20 flex items-center gap-3">
              <Globe size={20} className="text-blue-400 animate-spin-slow" />
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Global Load</p>
                <p className="text-xs font-black text-white tracking-tighter uppercase italic">98.4% Efficiency</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            { icon: <BarChart3 className="text-emerald-400" />, title: "Neural Telemetry", desc: "Monitoramento de carga com precisão de milissegundos via rede distribuída." },
            { icon: <ShieldCheck className="text-blue-400" />, title: "Audit-Grade Trust", desc: "Segurança de nível soberano para o seu grid energético e registros de dados." },
            { icon: <Zap className="text-amber-400" />, title: "Predictive Flux", desc: "IA antecipa picos de demanda e otimiza fluxos de custo automaticamente." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-thick text-left p-10 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="w-16 h-16 rounded-[1.25rem] bg-slate-950/80 border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
              </div>
              <Typography variant="h4" className="text-xl font-black text-white tracking-tight mb-3 uppercase italic leading-none">{feature.title}</Typography>
              <Typography className="text-sm font-medium text-slate-500 leading-relaxed">{feature.desc}</Typography>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
