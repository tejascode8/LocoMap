import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Gauge } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { cn } from '@/utils/cn';

interface MobileJourneySummaryProps {
  journey: LiveJourney;
}

export function MobileJourneySummary({ journey }: MobileJourneySummaryProps) {
  const progress = Math.min(journey.completionPercentage, 100);
  const delayPositive = journey.delayMinutes > 0;

  // Safely parse ETA into time and station location to prevent mobile text squishing
  const getEtaDetails = () => {
    if (!journey.ETA) return { time: 'N/A', location: 'ETA' };
    if (journey.ETA.toLowerCase().includes(' at ')) {
      const parts = journey.ETA.split(/\s+at\s+/i);
      return { time: parts[1], location: parts[0] };
    }
    return { time: journey.ETA, location: 'ETA' };
  };

  const eta = getEtaDetails();

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden glass-panel rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-glass p-4 space-y-3.5"
    >
      {/* Train name & delay */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Live Journey</p>
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{journey.name}</h2>
        </div>
        <span
          className={cn(
            'flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold border',
            delayPositive
              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          )}
        >
          {delayPositive ? `+${journey.delayMinutes}m late` : 'On time'}
        </span>
      </div>

      {/* Progress bar with compact Station Codes */}
      <div>
        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 mb-1 font-mono">
          <span className="truncate max-w-[100px]">{journey.origin.code || journey.origin.name}</span>
          <span className="font-black text-rail-blue dark:text-sky-400">{progress.toFixed(0)}%</span>
          <span className="truncate max-w-[100px]">{journey.destination.code || journey.destination.name}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800/60 overflow-hidden border border-slate-200/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-rail-blue"
          />
        </div>
      </div>

      {/* Live stats grid with parsed ETA subtitles */}
      <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-slate-100/60 dark:border-slate-800/40">
        {/* Speed */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Gauge className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {journey.speedKmh} km/h
            </p>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Speed</p>
          </div>
        </div>

        {/* Covered */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Activity className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {journey.distanceCoveredKm} km
            </p>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Covered</p>
          </div>
        </div>

        {/* ETA */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {eta.time}
            </p>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider truncate" title={eta.location}>
              {eta.location}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
