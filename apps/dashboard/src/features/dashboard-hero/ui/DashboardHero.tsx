"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';

export const DashboardHero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <motion.section 
      style={{ y, opacity }}
      className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-10 flex flex-col justify-end min-h-[50vh] border-b border-emerald-500/20 overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-[2px] bg-emerald-500" />
          <Typography variant="system">SYSTEM_ACCESS: GRANTED // SECURITY_LVL: 4</Typography>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(4rem,10vw,12rem)] font-black leading-[0.8] tracking-tighter uppercase mb-6 text-white"
        >
          Central_<br/>
          <span className="text-emerald-500 italic font-serif">Nexus.</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl border-l-2 border-emerald-500 pl-8 mt-12"
        >
          <Typography className="text-xl md:text-2xl font-bold text-slate-300 uppercase italic tracking-tight">
            Advanced Energy Management & Assets Intelligence.
          </Typography>
          <Typography className="mt-4 text-slate-500 font-mono text-sm leading-relaxed uppercase tracking-wider">
            Real-time telemetry from 142 decentralized nodes. Optimized for peak grid performance and maximum sustainability offset.
          </Typography>
        </motion.div>
      </div>

      {/* Extreme Right Status */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 rotate-90 origin-right hidden xl:block">
        <Typography variant="system" className="text-slate-700">CORE_TEMP: 32°C // FLOW_STABLE // NO_ANOMALIES</Typography>
      </div>
    </motion.section>
  );
};
