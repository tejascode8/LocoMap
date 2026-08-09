'use client';

import React, { useState, useRef } from 'react';
import { Mountain, TrendingUp, Info } from 'lucide-react';
import { ElevationPoint } from '@/lib/opentopography';
import { motion, AnimatePresence } from 'framer-motion';

interface ElevationProfileProps {
  data: ElevationPoint[];
  highestElevationM: number;
}

export function ElevationProfile({ data, highestElevationM }: ElevationProfileProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ElevationPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) return null;

  const maxElev = Math.max(...data.map((d) => d.elevationM), 100);
  const minElev = Math.min(...data.map((d) => d.elevationM), 0);
  const range = maxElev - minElev || 1;

  // Build SVG path string
  const svgWidth = 600;
  const svgHeight = 160;

  // Horizontal Gridlines heights (Calculated relative to scale)
  const gridLevels = [
    { label: `${maxElev}m`, y: 20 },
    { label: `${Math.round((maxElev + minElev) / 2)}m`, y: svgHeight / 2 },
    { label: `${minElev}m`, y: svgHeight - 20 }
  ];

  const linePath = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * svgWidth;
      const y = svgHeight - ((d.elevationM - minElev) / range) * (svgHeight - 40) - 20;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  const strokePath = linePath;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clientX / rect.width));

    // Find closest index in data
    const idx = Math.round(pct * (data.length - 1));
    const point = data[idx];
    if (point) {
      const x = (idx / (data.length - 1)) * svgWidth;
      const y = svgHeight - ((point.elevationM - minElev) / range) * (svgHeight - 40) - 20;
      setHoveredPoint(point);
      setHoverX(x);
      setHoverY(y);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverX(null);
    setHoverY(null);
  };

  // Apple physics damping settings
  const springConfig = { type: 'spring', stiffness: 280, damping: 26 };

  const tooltipLeft = hoverX !== null ? (hoverX / svgWidth) * 100 : 0;
  const tooltipTransform = tooltipLeft < 15 ? 'translateX(0%)' : tooltipLeft > 85 ? 'translateX(-100%)' : 'translateX(-50%)';

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
          <Mountain className="h-5 w-5 text-emerald-500 animate-pulse" />
          <span>OpenTopography Elevation Profile</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Peak: {highestElevationM}m</span>
        </div>
      </div>

      {/* SVG Terrain Area Chart */}
      <div className="relative h-44 w-full pt-4">
        {/* Floating spring-interpolated Tooltip */}
        <AnimatePresence>
          {hoveredPoint && hoverX !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: `${tooltipLeft}%` }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={springConfig}
              className="absolute bg-slate-950/95 border border-emerald-500/35 text-slate-100 p-2.5 rounded-xl text-xs font-mono shadow-[0_10px_25px_rgba(0,0,0,0.5)] pointer-events-none flex flex-col gap-0.5 z-10 backdrop-blur-md left-0"
              style={{
                transform: tooltipTransform,
                bottom: '78%',
              }}
            >
              <div className="font-extrabold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{hoveredPoint.elevationM} m</span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">Distance: {hoveredPoint.distanceKm} km</div>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-full w-full overflow-visible cursor-crosshair"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="elevationGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Gridlines & Elevation Labels (Crisp and High-Contrast) */}
          <g>
            {gridLevels.map((lvl, index) => (
              <g key={index}>
                <line
                  x1={0}
                  y1={lvl.y}
                  x2={svgWidth}
                  y2={lvl.y}
                  className="stroke-slate-200/50 dark:stroke-slate-800/80"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - 5}
                  y={lvl.y - 5}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] font-bold tracking-tight"
                >
                  {lvl.label}
                </text>
              </g>
            ))}
          </g>

          {/* Organic rise-up transition for the entire terrain graph */}
          <motion.g
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: '160px' }}
          >
            {/* Area Fill */}
            <motion.path
              d={areaPath}
              fill="url(#elevationGrad)"
              shapeRendering="geometricPrecision"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Glowing Stroke line for premium highlight (Narrower, crisper glow) */}
            <motion.path
              d={strokePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="4.5"
              filter="url(#elevationGlow)"
              shapeRendering="geometricPrecision"
              className="opacity-20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />

            {/* Primary High-Contrast Stroke Line (Sharper 2.5px width) */}
            <motion.path
              d={strokePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              shapeRendering="geometricPrecision"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </motion.g>

          {/* Interactive Spring-guided Hover Cursor */}
          {hoveredPoint && hoverX !== null && hoverY !== null && (
            <g>
              {/* Vertical Guide Line */}
              <motion.line
                animate={{ x1: hoverX, x2: hoverX }}
                transition={springConfig}
                y1={0}
                y2={svgHeight}
                stroke="rgba(16, 185, 129, 0.35)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              
              {/* Pulse Outer Glow */}
              <motion.circle
                animate={{ cx: hoverX, cy: hoverY }}
                transition={springConfig}
                r="8"
                fill="rgba(16, 185, 129, 0.3)"
                className="animate-pulse"
              />
              
              {/* Inner Solid Marker */}
              <motion.circle
                animate={{ cx: hoverX, cy: hoverY }}
                transition={springConfig}
                r="4.5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2.2"
              />
            </g>
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center text-xs font-mono font-semibold text-slate-400 pt-2 border-t border-slate-100/60 dark:border-slate-800/40">
        <span>0 km (Origin)</span>
        <span className="flex items-center gap-1 text-[10px] text-slate-400/80 font-normal">
          <Info className="h-3.5 w-3.5" /> Hover to explore elevations
        </span>
        <span>{data[data.length - 1]?.distanceKm} km (Destination)</span>
      </div>
    </div>
  );
}
