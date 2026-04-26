import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { Zap, ArrowRight, ShieldCheck, BarChart3 } from 'lucide-react';

export const Hero: React.FC = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20">
          <Zap size={16} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Next Generation Energy Intelligence</span>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h1" className="mb-6">
            Optimizing the World's <br />
            <span className="text-gradient">Energy Flow</span>
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="p" className="max-w-2xl mx-auto mb-10 text-text-muted">
            EcoVolt provides real-time analytics and predictive AI to transform how enterprises 
            consume, store, and trade energy. Sustainable growth through high-fidelity data.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto">
            Get Started <ArrowRight size={18} />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            View Analytics
          </Button>
        </motion.div>

        {/* Floating Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            { icon: <BarChart3 className="text-primary" />, title: "Real-time Monitoring", desc: "Live energy consumption tracking with millisecond precision." },
            { icon: <ShieldCheck className="text-secondary" />, title: "Secure Infrastructure", desc: "Enterprise-grade security for your energy grid and data." },
            { icon: <Zap className="text-yellow-400" />, title: "Predictive AI", desc: "Anticipate demand spikes and optimize cost efficiency automatically." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-card text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                {feature.icon}
              </div>
              <Typography variant="h4" className="mb-2">{feature.title}</Typography>
              <Typography variant="muted">{feature.desc}</Typography>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
