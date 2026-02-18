import React, { useState } from 'react';
import { RegionStats } from '../types';
import { MapPin } from 'lucide-react';

interface UKMapProps {
  regions: RegionStats[];
}

const UKMap: React.FC<UKMapProps> = ({ regions }) => {
  const [hoveredRegion, setHoveredRegion] = useState<RegionStats | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getRegionColor = (score: number) => {
    // Gradient from Green (low posh) to Purple (high posh)
    if (score < 40) return '#4ade80'; // green-400
    if (score < 55) return '#facc15'; // yellow-400
    if (score < 70) return '#fb923c'; // orange-400
    return '#a855f7'; // purple-500
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Simplified SVG paths for UK regions (Stylized)
  const paths = {
    scotland: "M150,10 L220,20 L240,80 L200,120 L120,100 L100,50 Z",
    north: "M120,100 L200,120 L210,180 L130,190 L110,130 Z",
    ni: "M40,110 L90,120 L90,150 L50,160 Z",
    wales: "M80,200 L140,200 L150,260 L90,270 L70,220 Z",
    midlands: "M130,190 L210,180 L220,240 L150,260 L140,200 Z",
    east: "M210,180 L260,190 L270,240 L220,240 Z",
    london: "M210,255 L240,255 L240,275 L210,275 Z", // Small box for London
    sw: "M90,270 L150,260 L180,300 L120,350 L60,320 Z",
    se: "M180,300 L150,260 L210,255 L220,240 L270,240 L260,290 L200,310 Z"
  };

  const getPathForRegion = (id: string) => {
    return (paths as any)[id] || "";
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden" onMouseMove={handleMouseMove}>
      <svg width="350" height="380" viewBox="0 0 350 380" className="drop-shadow-xl">
        {regions.map((region) => (
          <path
            key={region.id}
            d={getPathForRegion(region.id)}
            fill={getRegionColor(region.avgPoshScore)}
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-300 hover:opacity-80 cursor-pointer hover:stroke-slate-800"
            onMouseEnter={() => setHoveredRegion(region)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow text-xs backdrop-blur-sm border border-slate-100">
        <div className="font-bold mb-2 text-slate-700">Posh Level</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div>High (&gt;70)</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div>Med-High</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>Medium</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-sm"></div>Low (&lt;40)</div>
      </div>

      {/* Tooltip */}
      {hoveredRegion && (
        <div 
          className="absolute bg-slate-900 text-white p-3 rounded-lg pointer-events-none shadow-2xl z-50 w-48"
          style={{ top: mousePos.y + 10, left: mousePos.x + 10 }}
        >
          <div className="font-serif font-bold text-lg mb-1">{hoveredRegion.name}</div>
          <div className="text-xs text-slate-300 mb-2">Avg Posh Score: <span className="text-white font-bold">{hoveredRegion.avgPoshScore}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-1">
             <div className="text-[10px] uppercase text-slate-400 tracking-wider">Private Schooling</div>
             <div className="font-mono text-sm">{hoveredRegion.privateSchoolPercent}%</div>
             <div className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Notable Seat</div>
             <div className="font-serif text-sm flex items-center gap-1"><MapPin size={10}/> {hoveredRegion.notableConstituency}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UKMap;