import React from 'react';
import { TerrainFeature } from '@/lib/overpass';
import { cn } from '@/utils/cn';
import {
  MapPin,
  Milestone,
  Compass,
  Waves,
  Mountain,
  Landmark,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TerrainCardProps {
  feature: TerrainFeature;
}

const TYPE_CONFIG = {
  bridge: { icon: Milestone, label: 'Bridge', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  tunnel: { icon: Compass, label: 'Tunnel', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-350' },
  river: { icon: Waves, label: 'River', color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  mountain: { icon: Mountain, label: 'Peak', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  tourist: { icon: Landmark, label: 'Attraction', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  city: { icon: Building2, label: 'City', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
};

export function TerrainCard({ feature }: TerrainCardProps) {
  const cfg = TYPE_CONFIG[feature.type] || TYPE_CONFIG.tourist;
  const IconComponent = cfg.icon;

  const hoverGlow = {
    bridge: 'hover:shadow-[0_15px_30px_rgba(245,158,11,0.18)] hover:border-amber-500/40',
    tunnel: 'hover:shadow-[0_15px_30px_rgba(100,116,139,0.18)] hover:border-slate-400/40',
    river: 'hover:shadow-[0_15px_30px_rgba(14,165,233,0.18)] hover:border-sky-500/40',
    mountain: 'hover:shadow-[0_15px_30px_rgba(16,185,129,0.18)] hover:border-emerald-500/40',
    tourist: 'hover:shadow-[0_15px_30px_rgba(168,85,247,0.18)] hover:border-purple-500/40',
    city: 'hover:shadow-[0_15px_30px_rgba(244,63,94,0.18)] hover:border-rose-500/40',
  }[feature.type] || 'hover:shadow-[0_15px_30px_rgba(168,85,247,0.18)] hover:border-purple-500/40';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 25, scale: 0.96 },
        show: { opacity: 1, x: 0, scale: 1 }
      }}
      className={cn(
        "glass-panel flex-shrink-0 w-44 rounded-2xl p-4 space-y-3.5 border shadow-glass transition-all duration-300 hover:-translate-y-1.5 snap-start cursor-pointer",
        hoverGlow
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border border-transparent shadow-sm flex-shrink-0", cfg.color)}>
          <IconComponent className="h-4.5 w-4.5" />
        </div>
        <span className={cn('text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm', cfg.color)}>
          {cfg.label}
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {feature.name}
        </p>
        
        {feature.distanceKm !== undefined && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium pt-0.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>~{feature.distanceKm} km</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
