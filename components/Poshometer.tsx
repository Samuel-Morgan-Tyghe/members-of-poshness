import React from 'react';

interface PoshometerProps {
  score: number;
}

const Poshometer: React.FC<PoshometerProps> = ({ score }) => {
  // Calculate rotation: 0 score = -90deg, 100 score = 90deg
  const rotation = (score / 100) * 180 - 90;

  let label = "Plebeian";
  let color = "text-green-600";
  
  if (score > 20) { label = "Commoner"; color = "text-lime-600"; }
  if (score > 40) { label = "Middle Class"; color = "text-yellow-600"; }
  if (score > 60) { label = "Upper Middle"; color = "text-orange-500"; }
  if (score > 80) { label = "To the Manor Born"; color = "text-purple-600"; }
  if (score > 90) { label = "Aristocracy"; color = "text-purple-900"; }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-xl font-serif font-bold mb-4 text-slate-800">The Posh-o-meter™</h3>
      
      <div className="relative w-64 h-32 overflow-hidden mb-2">
        {/* Gauge Background */}
        <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[20px] border-slate-100 border-b-0 box-border z-0"></div>
        
        {/* Colorful Arc (simulated with gradient border or segmented divs - using simple CSS approach for cleanliness) */}
        <div 
          className="absolute top-0 left-0 w-full h-64 rounded-full border-[20px] border-transparent border-t-purple-800 border-r-yellow-400 border-l-green-500 box-border z-10 opacity-30"
          style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
        ></div>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-28 bg-slate-800 origin-bottom rounded-full z-20 transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-red-500 rounded-full"></div>
        </div>
        
        {/* Center pivot */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-900 rounded-full -translate-x-1/2 translate-y-1/2 z-30"></div>
      </div>

      <div className="text-4xl font-bold font-serif mt-2 text-slate-900">{score}<span className="text-lg text-slate-500">/100</span></div>
      <div className={`text-lg font-bold mt-1 uppercase tracking-wider ${color}`}>{label}</div>
    </div>
  );
};

export default Poshometer;