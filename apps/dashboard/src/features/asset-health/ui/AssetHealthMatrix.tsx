"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Battery, ArrowUpRight } from 'lucide-react';
import { Typography } from '@/shared/ui/typography';
import { Card } from '@/shared/ui/card';

export const AssetHealthMatrix: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Storage Capacity */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h4">Storage_Capacity</Typography>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Battery size={20} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '84.2%' }}
                transition={{ duration: 2, ease: "circOut" }}
                className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
            </div>
            <div className="flex justify-between items-center">
              <Typography variant="small" className="text-slate-600">NODE_ALPHA_BATTERY_CLUSTER</Typography>
              <Typography variant="h3" className="text-2xl text-emerald-500">84.2%</Typography>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Protocols */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h4">Security_Protocols</Typography>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Shield size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'FIREWALL_LVL_4', status: 'ACTIVE', color: 'text-emerald-500' },
              { label: 'E2E_TUNNEL_OS', status: 'STABLE', color: 'text-emerald-500' },
              { label: 'IDS_NEURAL_MAP', status: 'SYNCING', color: 'text-amber-500' },
            ].map((protocol) => (
              <div key={protocol.label} className="flex items-center justify-between p-5 rounded-2xl bg-white/3 border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors shadow-[0_0_10px_transparent] group-hover:shadow-emerald-500/50" />
                  <Typography variant="small" className="text-slate-400 group-hover:text-white transition-colors">{protocol.label}</Typography>
                </div>
                <Typography variant="small" className={protocol.color}>{protocol.status}</Typography>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Action Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="p-1 rounded-[2.5rem] bg-linear-to-br from-emerald-500/20 to-transparent group cursor-pointer"
      >
        <div className="p-8 rounded-[2.3rem] bg-slate-950 flex items-center gap-6 transition-colors group-hover:bg-slate-900">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
            <ArrowUpRight size={28} />
          </div>
          <div>
            <Typography variant="h4" className="text-white leading-none mb-2">Generate_Reports</Typography>
            <Typography variant="small" className="text-slate-600">SECURE_PDF_EXPORT_V4</Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
