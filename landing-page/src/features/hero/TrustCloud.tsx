"use client";

import React from "react";
import { motion } from "framer-motion";


const logos = [
  { name: "Global Events", label: "Global Events" },
  { name: "Live Nation", label: "Live Nation" },
  { name: "Rock in Rio", label: "Rock in Rio" },
  { name: "Lollapalooza", label: "Lollapalooza" },
  { name: "Coachella", label: "Coachella" },
  { name: "Tomorrowland", label: "Tomorrowland" },
];

export const TrustCloud = () => {
  return (
    <div className="py-12 border-y border-slate-100/50 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-10">
          Transformando a Matriz Energética de Gigantes Globais
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-crosshair"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900/5 flex items-center justify-center font-black text-slate-300">
                {logo.name[0]}
              </div>
              <span className="text-sm font-bold text-slate-400 tracking-tighter">{logo.name}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-slate-900">1.2GW</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Energia Gerida</span>
          </div>
          <div className="w-px h-8 bg-slate-200 hidden md:block" />
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-slate-900">500+</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eventos Globais</span>
          </div>
          <div className="w-px h-8 bg-slate-200 hidden md:block" />
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-slate-900">99.9%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uptime Garantido</span>
          </div>
        </div>
      </div>
    </div>
  );
};
