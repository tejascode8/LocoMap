'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Mountain, Loader2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { TerrainFeature } from '@/lib/overpass';
import { TerrainCard } from './TerrainCard';
import { motion } from 'framer-motion';

interface TerrainPanelProps {
  trainId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

export function TerrainPanel({ trainId }: TerrainPanelProps) {
  const [features, setFeatures] = useState<TerrainFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/terrain?trainId=${trainId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setFeatures(json.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trainId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 320;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
        <Mountain className="h-5 w-5 text-emerald-500 animate-pulse" />
        <span>Terrain & Points of Interest</span>
      </div>

      {loading && (
        <div className="glass-panel flex items-center gap-3 rounded-2xl p-5 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-rail-blue" />
          <span>Fetching bridges, rivers & terrain features along route…</span>
        </div>
      )}

      {error && !loading && (
        <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">
          Terrain data is temporarily unavailable. Try again later.
        </div>
      )}

      {!loading && !error && features.length === 0 && (
        <div className="glass-panel flex items-center gap-3 rounded-2xl p-5 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>No terrain features found along this route.</span>
        </div>
      )}

      {!loading && features.length > 0 && (
        <div className="relative group/panel">
          {/* Left Navigation Arrow */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-lg opacity-0 group-hover/panel:opacity-100 transition-opacity duration-300 hover:scale-105 active:scale-95 hidden md:flex"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-lg opacity-0 group-hover/panel:opacity-100 transition-opacity duration-300 hover:scale-105 active:scale-95 hidden md:flex"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Cards carousel wrapper with scrollbar-none */}
          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-none snap-x"
          >
            {features.map((f, i) => (
              <TerrainCard key={`${f.type}-${f.name}-${i}`} feature={f} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
