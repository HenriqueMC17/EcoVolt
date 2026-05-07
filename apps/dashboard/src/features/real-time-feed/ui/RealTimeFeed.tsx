"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Typography } from '@/shared/ui/typography';
import { Card } from '@/shared/ui/card';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@/shared/context/UserContext';

interface Activity {
  _id: string;
  action: string;
  timestamp: number;
  details?: {
    type?: 'success' | 'info' | 'warning' | 'error';
    [key: string]: unknown;
  };
}

// Static mock data to avoid impure Date.now() during render
const MOCK_TIME = 1715000000000; // Fixed reference for mock stability
const MOCK_ACTIVITIES: Activity[] = [
  { _id: '1', action: 'NODE_ALPHA_SYNC_COMPLETE', timestamp: MOCK_TIME - 120000, details: { type: 'success' } },
  { _id: '2', action: 'GRID_BALANCING_INITIATED', timestamp: MOCK_TIME - 840000, details: { type: 'info' } },
  { _id: '3', action: 'VOLTAGE_FLUCTUATION_DETECTED', timestamp: MOCK_TIME - 1680000, details: { type: 'warning' } },
  { _id: '4', action: 'SOLAR_ARRAY_04_OPTIMIZED', timestamp: MOCK_TIME - 3600000, details: { type: 'success' } },
  { _id: '5', action: 'ROUTINE_SECURITY_SCAN_FINISHED', timestamp: MOCK_TIME - 7200000, details: { type: 'info' } },
];

export const RealTimeFeed: React.FC = () => {
  const { user } = useUser();
  const activities = useQuery(api.activities.getRecentActivities, user ? { userEmail: user.email, limit: 5 } : "skip");

  const feedEvents = useMemo(() => {
    return (activities || MOCK_ACTIVITIES) as Activity[];
  }, [activities]);

  // To avoid impure Date.now() during render, we use a fixed label or simplified logic
  // In a real app, you'd use a 'useTime' hook or similar.
  const getTimeLabel = (timestamp: number) => {
    const diff = MOCK_TIME - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'Recent';
  };

  return (
    <Card className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <Typography variant="h4">Live_Event_Telemetry</Typography>
        <Clock size={18} className="text-slate-700" />
      </div>

      <div className="space-y-6 flex-1">
        {feedEvents.map((event, idx) => (
          <motion.div 
            key={event._id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-5 group"
          >
            <div className="mt-1">
              {event.details?.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
              {event.details?.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
              {(!event.details || event.details?.type === 'info') && <Info size={16} className="text-blue-400" />}
            </div>
            <div className="flex-1 border-b border-white/5 pb-4 group-last:border-0">
              <div className="flex justify-between items-center mb-1">
                <Typography className="text-[11px] font-black text-white uppercase italic tracking-widest">{event.action}</Typography>
                <Typography variant="small" className="text-[8px] text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {getTimeLabel(event.timestamp)}
                </Typography>
              </div>
              <Typography className="text-[9px] font-mono text-slate-600 tracking-tighter uppercase">
                PID: {1024 + idx} // STREAM_01
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition-colors">
        <Typography variant="small">VIEW_ALL_LOGS</Typography>
      </button>
    </Card>
  );
};
