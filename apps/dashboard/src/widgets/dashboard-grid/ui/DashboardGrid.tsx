"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { KPITelemetry } from '@/features/kpi-telemetry/ui/KPITelemetry';
import { EnergyNexusChart } from '@/features/energy-nexus-chart/ui/EnergyNexusChart';
import { AssetHealthMatrix } from '@/features/asset-health/ui/AssetHealthMatrix';
import { RealTimeFeed } from '@/features/real-time-feed/ui/RealTimeFeed';
import { Typography } from '@/shared/ui/typography';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 24, stiffness: 100 } }
};

export const DashboardGrid: React.FC = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-x-0 gap-y-24 md:gap-y-40 py-20 px-10"
    >
      {/* Layer 1: Vital Signs (Full Width but Asymmetric Container) */}
      <motion.div variants={itemVariants} className="md:col-start-1 md:col-span-12">
        <Typography variant="small" className="mb-10 block opacity-50">01 // VITAL_SIGNS</Typography>
        <KPITelemetry />
      </motion.div>

      {/* Layer 2: Main Telemetry Chart */}
      <motion.div variants={itemVariants} className="md:col-start-1 md:col-span-12 xl:col-start-1 xl:col-span-9">
        <Typography variant="small" className="mb-10 block opacity-50">02 // DISTRIBUTION_MATRIX</Typography>
        <EnergyNexusChart />
      </motion.div>

      {/* Layer 3: Split flow for Health & Logs */}
      <motion.div variants={itemVariants} className="md:col-start-1 md:col-span-7 xl:col-start-1 xl:col-span-8">
        <Typography variant="small" className="mb-10 block opacity-50">03 // ASSET_HEALTH</Typography>
        <AssetHealthMatrix />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-start-9 md:col-span-4 xl:col-start-10 xl:col-span-3">
        <Typography variant="small" className="mb-10 block opacity-50">04 // LIVE_TELEMETRY_FEED</Typography>
        <RealTimeFeed />
      </motion.div>

      {/* Decorative Layer Footer */}
      <motion.div variants={itemVariants} className="md:col-start-1 md:col-span-12 border-t border-white/5 pt-10 flex justify-between items-center opacity-30">
        <Typography variant="system" className="text-slate-600">NEXUS_OS_CORE_STATUS: STABLE</Typography>
        <Typography variant="system" className="text-slate-600">SYSTIME: {new Date().toISOString()}</Typography>
      </motion.div>
    </motion.div>
  );
};
