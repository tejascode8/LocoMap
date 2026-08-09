'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, Route, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiveJourney } from '@/types/train';
import { AnalyticsResponse } from '@/app/api/analytics/[id]/route';
import { ElevationProfile } from './ElevationProfile';
import { formatDelay } from '@/utils/format';
import { cn } from '@/utils/cn';

interface AnalyticsDashboardProps {
  journey: LiveJourney;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export function AnalyticsDashboard({ journey }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/${journey.trainId}`);
        const json = await res.json();
        if (json.data) setAnalytics(json.data);
      } catch (e) {
        console.warn('Failed to load analytics', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [journey.trainId]);

  const delayInfo = formatDelay(journey.delayMinutes);

  if (loading || !analytics) {
    return (
      <div className="space-y-4">
        <div className="glass-panel rounded-2xl p-5 text-xs text-slate-400 text-center">
          Computing journey analytics & elevation profile from OpenTopography…
        </div>
      </div>
    );
  }

  // Delay history for mini bar chart
  const delayData = analytics.delayHistory.filter((d) => d.delayMinutes >= 0);
  const maxDelay = Math.max(...delayData.map((d) => d.delayMinutes), 1);

  return (
    <div className="space-y-5">
      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Route, color: 'text-rail-blue', bg: 'bg-rail-blue/10', label: 'Total Distance', value: analytics.totalDistanceKm, suffix: ' km' },
          { icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-500/10', label: 'Highest Point', value: analytics.highestElevationM, suffix: ' m' },
          { icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-500/10', label: 'Covered', value: analytics.distanceCoveredKm, suffix: ' km' },
          { icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Delay', value: journey.delayMinutes, suffix: ' min' },
        ].map(({ icon: Icon, color, bg, label, value, suffix }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-4 space-y-1"
          >
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl', bg)}>
              <Icon className={cn('h-4 w-4', color)} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            <AnimatedCounter value={value} suffix={suffix} />
          </motion.div>
        ))}
      </div>

      {/* ─── Elevation Profile ─── */}
      <ElevationProfile data={analytics.elevationProfile} highestElevationM={analytics.highestElevationM} />

      {/* ─── Delay Bar Chart ─── */}
      <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <BarChart3 className="h-5 w-5 text-amber-500" />
              Per-Station Delay Analytics
            </h3>
            <p className="text-xs text-slate-400 font-medium">Tracking time deviation metrics across route checkpoints</p>
          </div>
          <span className={cn('text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 h-fit w-fit', delayInfo.color)}>
            {delayInfo.text}
          </span>
        </div>

        {delayData.length > 0 ? (
          <div className="space-y-4">
            {/* Summary Metrics Row */}
            <div className="grid grid-cols-3 gap-4 py-1 text-center border-b border-slate-100/60 dark:border-slate-800/40 pb-4">
              <div className="space-y-0.5">
                <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Avg. Delay</div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {Math.round(delayData.reduce((acc, curr) => acc + curr.delayMinutes, 0) / delayData.length || 0)} min
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Peak Delay</div>
                <div className="text-base font-extrabold text-rose-500">
                  {Math.max(...delayData.map((d) => d.delayMinutes), 0)} min
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Peak Location</div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                  {delayData.reduce((prev, current) => (prev.delayMinutes > current.delayMinutes) ? prev : current, { stationCode: 'N/A', delayMinutes: 0 }).stationCode}
                </div>
              </div>
            </div>

            {/* Delay Bars List Wrapper (Scrollable after 5 stations) */}
            <div className="relative max-h-[195px] overflow-y-auto scrollbar-none pr-1 scroll-smooth">
              {/* Background Grid markers */}
              <div className="absolute inset-y-0 left-[76px] right-[68px] pointer-events-none flex justify-between">
                <div className="w-[1px] h-full border-r border-slate-200/40 dark:border-slate-800/40 border-dashed" />
                <div className="w-[1px] h-full border-r border-slate-200/40 dark:border-slate-800/40 border-dashed" />
                <div className="w-[1px] h-full border-r border-slate-200/40 dark:border-slate-800/40 border-dashed" />
              </div>

              <div className="space-y-2 pt-2">
                {delayData.map((d, i) => {
                  const widthPct = maxDelay > 0 ? Math.round((d.delayMinutes / maxDelay) * 100) : 0;
                  const barColor =
                    d.delayMinutes === 0
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : d.delayMinutes < 15
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                      : 'bg-gradient-to-r from-rose-500 to-rose-400';

                  return (
                    <div key={i} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200 group relative z-10">
                      <span className="w-16 truncate text-xs text-slate-500 dark:text-slate-400 text-right font-mono font-bold flex-shrink-0">
                        {d.stationCode}
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden border border-slate-200/20 dark:border-slate-800/20">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(widthPct, d.delayMinutes === 0 ? 4 : 0)}%` }}
                          transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          className={cn('h-full rounded-full', barColor)}
                        />
                      </div>
                      <span className="w-14 text-xs font-mono font-bold text-right flex-shrink-0 text-slate-700 dark:text-slate-200">
                        {d.delayMinutes > 0 ? `+${d.delayMinutes}m` : 'On time'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No delay history available.</p>
        )}
      </div>
    </div>
  );
}
