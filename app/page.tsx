'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Train, ArrowRight, Sparkles, Clock, History, MapPin, Zap,
  Search, Loader2, AlertCircle, X, Navigation, ShieldCheck, Activity,
  ChevronRight, Compass, Gauge, Shield, Cpu
} from 'lucide-react';
import { useTrainSearch } from '@/hooks/useTrainSearch';
import { useSearchStore } from '@/store/search';
import { SearchResult } from '@/types/train';
import { cn } from '@/utils/cn';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const WaveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Wave parameters
    const SEPARATION = 22;
    const AMOUNTX = 50;
    const AMOUNTY = 30;
    let count = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient color matching theme (blue/purple dots) - increased opacity
      ctx.fillStyle = 'rgba(96, 165, 250, 0.55)'; 

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          // Calculate 3D coordinate wave - increased wave amplitude height
          const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
          const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
          const y = (Math.sin((ix + count) * 0.25) * 25) + (Math.sin((iy + count) * 0.45) * 18);

          // Rotate Y and X slightly for a 3D perspective angle
          const angleY = 0.45;
          const angleX = 0.55;

          const cosY = Math.cos(angleY);
          const sinY = Math.sin(angleY);
          const cosX = Math.cos(angleX);
          const sinX = Math.sin(angleX);

          // Rotate Y
          let x1 = x * cosY - z * sinY;
          let z1 = z * cosY + x * sinY;
          // Rotate X
          let y2 = y * cosX - z1 * sinX;
          let z2 = z1 * cosX + y * sinX;

          // Projection
          const focalLength = 360;
          const scale = focalLength / (focalLength + z2);
          const screenX = width / 2 + x1 * scale;
          const screenY = height / 1.7 + y2 * scale; // Center vertically slightly lower

          // Render dot if within boundary
          if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
            ctx.beginPath();
            // Increased particle size
            const size = Math.max(0.7, 2.3 * scale);
            ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      count += 0.022;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Increased container opacity
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70 dark:opacity-85" />;
};


export default function HomePage() {
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const [inputValue, setInputValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 350);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading, isError } = useTrainSearch(debouncedQuery);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (train: SearchResult) => {
    addRecentSearch(train);
    setIsSearchOpen(false);
    setInputValue('');
    router.push(`/train/${train.number}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const first = searchResults?.[0];
      if (first) handleSelect(first);
      else router.push(`/train/${inputValue.trim()}`);
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = isSearchOpen && (inputValue || debouncedQuery);

  // Apple spring animation presets
  const appleSpring = { type: 'spring', stiffness: 260, damping: 24 };

  return (
    <div className="space-y-16 py-4 md:py-8 max-w-6xl mx-auto px-4 font-sans antialiased">
      {/* ─── 1. HERO SECTION (Apple Product Announcement Style) ─────────────── */}
      <section className="relative rounded-[2.5rem] bg-black text-white p-8 sm:p-14 md:p-20 text-center shadow-2xl border border-white/10">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-blue-600/30 via-indigo-600/10 to-transparent blur-[120px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]" />
          <WaveParticles />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-3xl"
        >

          {/* Headline - Apple Display Typography */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
            Track trains<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              Pro precision
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            Sub-minute GPS tracking, route weather intelligence, and terrain elevation graphics for Indian Railways
          </p>

          {/* ─── Apple Spotlight-Style Search Bar (White Background & Black Text) ─── */}
          <div className="mt-10 relative max-w-2xl mx-auto text-left z-20">
            <motion.div
              animate={{ scale: isSearchOpen ? 1.01 : 1 }}
              transition={appleSpring}
              className={cn(
                'relative flex items-center gap-3.5 rounded-2xl px-5 py-4 transition-all duration-300 backdrop-blur-md border shadow-[0_20px_50px_rgba(0,0,0,0.65)]',
                isSearchOpen
                  ? 'bg-white border-blue-500 ring-4 ring-blue-500/25 shadow-[0_0_50px_rgba(59,130,246,0.15)]'
                  : 'bg-white/95 border-slate-200/80 hover:border-slate-350 hover:bg-white shadow-[0_15px_35px_rgba(0,0,0,0.35)]'
              )}
            >
              {isLoading && inputValue ? (
                <Loader2 className="h-6 w-6 flex-shrink-0 text-blue-500 animate-spin" />
              ) : (
                <Search className={cn("h-6 w-6 flex-shrink-0 transition-colors duration-300", isSearchOpen ? "text-blue-500" : "text-slate-400")} />
              )}

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search train by number (12951) or name (Rajdhani)..."
                className="w-full bg-transparent text-base sm:text-lg font-medium text-black placeholder-slate-400 outline-none"
              />

              {inputValue && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setInputValue(''); setIsSearchOpen(false); }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-black transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </motion.div>

            {/* Spotlight Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 right-0 top-full mt-3 z-50 max-h-[280px] sm:max-h-[380px] overflow-y-auto rounded-2xl border border-white/15 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-3xl divide-y divide-zinc-800/60"
                >
                  {/* Error state */}
                  {isError && (
                    <div className="flex items-center gap-2 py-6 text-center justify-center text-sm text-rose-400 font-medium">
                      <AlertCircle className="h-5 w-5" />
                      <span>Unable to load trains. Check your connectivity.</span>
                    </div>
                  )}

                  {/* Loading skeleton */}
                  {isLoading && !searchResults && (
                    <div className="space-y-2 py-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-zinc-800/70 animate-pulse" />
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {!isLoading && !isError && searchResults && searchResults.length === 0 && (
                    <div className="py-8 text-center text-sm text-zinc-400 font-medium">
                      No trains found for &quot;<span className="text-white">{inputValue}</span>&quot;. Try train number like <strong className="text-blue-400">12951</strong>.
                    </div>
                  )}

                  {/* Direct number search option */}
                  {inputValue && /^\d{4,5}$/.test(inputValue.trim()) && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => router.push(`/train/${inputValue.trim()}`)}
                      className="w-full flex items-center justify-between rounded-xl px-4 py-3 mb-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-lg group"
                    >
                      <div className="flex items-center gap-3">
                        <Train className="h-5 w-5" />
                        <span>Track Train #{inputValue.trim()} Live</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}

                  {/* Results List */}
                  {searchResults && searchResults.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1">
                        {inputValue ? 'Matching Trains' : 'Popular Express Trains'}
                      </p>
                      {searchResults.map((train) => (
                        <motion.button
                          key={train.id}
                          whileHover={{ x: 4 }}
                          onClick={() => handleSelect(train)}
                          className="w-full flex items-center justify-between rounded-xl p-3 hover:bg-zinc-800/80 transition-all text-left group border border-transparent hover:border-zinc-700/80"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              <Train className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-xs font-bold text-blue-400 border border-zinc-700">
                                  {train.number}
                                </span>
                                <span className="font-bold text-white text-sm truncate">
                                  {train.name}
                                </span>
                              </div>
                              {(train.origin.name || train.destination.name) && (
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400 truncate font-medium">
                                  <span>{train.origin.name} ({train.origin.code})</span>
                                  <ArrowRight className="h-3 w-3 flex-shrink-0 text-zinc-500" />
                                  <span>{train.destination.name} ({train.destination.code})</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-zinc-500 flex-shrink-0 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Trending Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-zinc-400 font-medium mr-1">Suggested:</span>
            {['12951', '22436', '12301', '12621', '12002'].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInputValue(num);
                  setIsSearchOpen(true);
                  inputRef.current?.focus();
                }}
                className="rounded-full bg-zinc-900 border border-zinc-700/80 px-3.5 py-1.5 font-mono font-semibold text-zinc-300 hover:text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-all shadow-sm"
              >
                #{num}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── 2. RECENT JOURNEYS (iOS Wallet Pass Aesthetic) ───────────────── */}
      {recentSearches.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <History className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recent Passports
              </h2>
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Clear Recent
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSearches.map((train, i) => (
              <motion.div
                key={train.id || train.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/train/${train.number}`}
                  className="group relative flex items-center justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-5 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                      <Train className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <span className="font-mono text-xs font-bold text-blue-500 block">#{train.number}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{train.name}</h4>
                    </div>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all group-hover:scale-110 flex-shrink-0 ml-2">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 3. APPLE BENTO BOX SHOWCASE (Feature Cards Grid) ───────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Designed like no other
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400">
            LocoMap combines real-time satellite telemetry, vector rendering, and meteorology into one seamless experience
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Vector Maps (Large Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-10 border border-slate-800 text-white flex flex-col justify-between min-h-[320px] group shadow-xl cursor-pointer hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-500/15 blur-[80px] pointer-events-none" />
            
            {/* Continuous Radar Scan Animation (Static Grid, Rotating Sweep & Blip Pings) */}
            <div className="absolute right-6 bottom-6 w-36 h-36 rounded-full border border-blue-500/20 bg-slate-950/40 flex items-center justify-center pointer-events-none opacity-40 sm:opacity-75 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
              {/* Static Grid Axes & Rings */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 border border-blue-500/5 rounded-full scale-75" />
                <div className="absolute inset-0 border border-blue-500/5 rounded-full scale-50" />
                <div className="absolute inset-0 border border-blue-500/5 rounded-full scale-25" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-blue-500/10 border-t border-dashed border-blue-500/10" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-blue-500/10 border-l border-dashed border-blue-500/10" />
                {/* Degree labels */}
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-mono font-bold text-blue-500/40">0°</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[6px] font-mono font-bold text-blue-500/40">90°</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-mono font-bold text-blue-500/40">180°</span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[6px] font-mono font-bold text-blue-500/40">270°</span>
              </div>

              {/* Rotating Sweeper Arm */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 origin-center"
              >
                {/* Gradient sweep sector */}
                <div className="absolute top-0 bottom-1/2 left-1/2 right-0 bg-gradient-to-tr from-transparent to-blue-500/20 origin-bottom-left rounded-tr-full" />
                {/* Bright green sweep leading line */}
                <div className="absolute top-0 bottom-1/2 left-1/2 w-[1px] bg-gradient-to-t from-blue-500/10 to-blue-400" />
              </motion.div>

              {/* Blip 1 (Active Train Target) */}
              <div className="absolute top-10 left-12">
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute -inset-1 rounded-full border border-blue-400"
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }} 
                  transition={{ duration: 1.5, repeat: Infinity }} 
                  className="relative w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
                />
              </div>

              {/* Blip 2 (Station Target) */}
              <div className="absolute bottom-14 right-10">
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
                  className="absolute -inset-1 rounded-full border border-indigo-400"
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }} 
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }} 
                  className="relative w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                />
              </div>
            </div>

            <div className="space-y-3 max-w-md relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-blue-400 tracking-wider uppercase font-bold">Vector Map Engine</span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                MapTiler High-FPS Vector Tiles
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Smooth live train marker extrapolation, glowing route polyline geometry, auto-centering camera lock, and dark mode map themes.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:text-white transition-colors relative z-10">
              <span>Explore Interactive Maps</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Bento Card 2: 30s Telemetry (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-between min-h-[320px] shadow-xl group cursor-pointer hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
          >
            {/* Continuous Pulse Gauge Animation (Optimized and Improved) */}
            <div className="absolute right-6 bottom-8 w-28 h-28 flex items-center justify-center pointer-events-none opacity-40 sm:opacity-75">
              <div className="relative w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center">
                {/* Orbiting Telemetry Dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_#3b82f6]" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="text-center"
                >
                  <span className="text-lg font-mono font-black text-white block leading-none">30s</span>
                  <span className="text-[7px] font-mono font-bold text-blue-200 uppercase tracking-widest block mt-1">Telemetry</span>
                </motion.div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-lg group-hover:bg-white group-hover:text-black transition-all duration-300">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-blue-200 tracking-wider uppercase font-bold">Real-Time</span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                30s Auto Refresh
              </h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                TanStack Query background polling guarantees live station delay analytics without manual page reloads.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4 relative z-10">
              <span className="text-2xl font-black">99.9%</span>
              <span className="text-xs font-semibold text-blue-200">NTES Uptime</span>
            </div>
          </motion.div>

          {/* Bento Card 3: Live Weather (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 md:border-none md:bg-gradient-to-br md:from-blue-600 md:to-indigo-700 p-8 text-white flex flex-col justify-between min-h-[280px] md:min-h-[320px] shadow-xl group cursor-pointer hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
          >
            {/* Continuous Weather System Orbit Animation */}
            <div className="absolute right-6 bottom-8 w-28 h-28 flex items-center justify-center pointer-events-none opacity-45 sm:opacity-80">
              <div className="relative w-20 h-20">
                {/* Glowing Sun */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1 right-1 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                />
                {/* Translucent Cloud */}
                <motion.div
                  animate={{ y: [-1.5, 1.5, -1.5], x: [-1, 1, -1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-3 left-1 w-14 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 shadow-md"
                />
                {/* Falling Rain drops */}
                <div className="absolute bottom-0 left-5 right-5 flex justify-around">
                  {[1, 2, 3].map((drop) => (
                    <motion.div
                      key={drop}
                      animate={{ y: [0, 10, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: drop * 0.4, ease: "easeInOut" }}
                      className="w-[1px] h-2.5 bg-blue-300/60 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 md:bg-white/10 md:text-white md:border-none md:backdrop-blur-lg group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-amber-400 md:text-blue-200 tracking-wider uppercase font-bold">Station Weather</span>
              <h3 className="text-xl font-bold tracking-tight text-white">
                OpenWeather Integration
              </h3>
              <p className="text-xs text-slate-400 md:text-blue-100/80 leading-relaxed">
                Live temperature, humidity, and atmospheric conditions at upcoming station stops along your train journey.
              </p>
            </div>
          </motion.div>

          {/* Bento Card 4: Terrain Profiles (Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 border-none md:bg-gradient-to-br md:from-slate-900 md:via-slate-900 md:to-slate-950 md:border md:border-slate-800 p-8 sm:p-10 text-white flex flex-col justify-between min-h-[320px] md:min-h-[280px] shadow-xl group cursor-pointer hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
          >
            {/* Continuous Elevation Wave Oscillation (Optimized with GPU-accelerated scaleY instead of height layout recalcs) */}
            <div className="absolute right-6 bottom-6 w-44 h-24 flex items-end justify-between pointer-events-none opacity-30 sm:opacity-75 overflow-hidden rounded-xl bg-zinc-950/20 border border-white/5 p-2">
              <div className="w-full h-full flex items-end gap-1 px-0.5">
                {[35, 50, 75, 45, 80, 65, 95, 55, 70, 40, 60, 30].map((val, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-blue-400/20 via-sky-400/50 to-white/70 rounded-t-sm origin-bottom"
                    style={{ height: `${val}%` }}
                    animate={{
                      scaleY: [0.65, 1, 0.65],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: idx * 0.12,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 max-w-md relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-lg md:bg-emerald-500/20 md:text-emerald-400 md:border md:border-emerald-500/30 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-blue-200 md:text-emerald-400 tracking-wider uppercase font-bold">Terrain Elevation</span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                OpenTopography SRTM Data
              </h3>
              <p className="text-sm text-blue-100/80 md:text-slate-400 leading-relaxed">
                Visualize route altitude fluctuations, mountain pass ascents, and terrain profiles for every track segment across India.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <section className="rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border border-white/10 p-4 shadow-2xl">
        <div className="cursor-pointer grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Trains Monitored', value: '14,000+', icon: Train, color: 'text-blue-600 group-hover:text-blue-400', glow: 'bg-blue-500/10', textDefault: 'text-blue-600', textHover: 'group-hover:text-blue-400' },
            { label: 'Live Data Latency', value: '< 30 Sec', icon: Gauge, color: 'text-emerald-600 group-hover:text-emerald-400', glow: 'bg-emerald-500/10', textDefault: 'text-emerald-600', textHover: 'group-hover:text-emerald-400' },
            { label: 'Geospatial Stations', value: '7,300+', icon: MapPin, color: 'text-indigo-600 group-hover:text-indigo-400', glow: 'bg-indigo-500/10', textDefault: 'text-indigo-600', textHover: 'group-hover:text-indigo-400' },
            { label: 'Verified Telemetry', value: '100% NTES', icon: ShieldCheck, color: 'text-amber-600 group-hover:text-amber-400', glow: 'bg-amber-500/10', textDefault: 'text-amber-600', textHover: 'group-hover:text-amber-400' },
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-zinc-800 hover:bg-black p-3.5 flex items-center gap-3.5 transition-all duration-500 shadow-sm hover:shadow-lg overflow-hidden"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl ${stat.glow} blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                {/* Card Header/Icon */}
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-zinc-900 group-hover:border-zinc-800 transition-all ${stat.color} shadow-inner`}>
                  <StatIcon className="h-4.5 w-4.5" />
                </div>

                {/* Value & Label */}
                <div className="space-y-0.5 text-left relative z-10 min-w-0">
                  <span className={`text-lg sm:text-xl font-extrabold tracking-tight ${stat.textDefault} ${stat.textHover} transition-colors duration-500 block truncate`}>
                    {stat.value}
                  </span>
                  <p className="text-[9px] font-mono font-bold tracking-widest text-slate-500 group-hover:text-zinc-400 transition-colors duration-500 uppercase truncate">
                    {stat.label}
                  </p>
                </div>

                {/* Pulse Indicator */}
                <div className="absolute top-3 right-3 flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stat.color} opacity-60`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${stat.color}`}></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
