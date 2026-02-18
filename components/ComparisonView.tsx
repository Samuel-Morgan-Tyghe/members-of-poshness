import React, { useState } from 'react';
import { Search, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { analyzeMP } from '../services/gemini';
import { MPProfile, LoadingState } from '../types';
import MPCard from './MPCard';

const ComparisonView: React.FC = () => {
  const [mp1Name, setMp1Name] = useState('');
  const [mp2Name, setMp2Name] = useState('');
  const [mp1Data, setMp1Data] = useState<MPProfile | null>(null);
  const [mp2Data, setMp2Data] = useState<MPProfile | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mp1Name.trim() || !mp2Name.trim()) return;

    setStatus(LoadingState.LOADING);
    try {
      // Fetch both in parallel
      const [res1, res2] = await Promise.all([
        analyzeMP(mp1Name),
        analyzeMP(mp2Name)
      ]);
      setMp1Data(res1);
      setMp2Data(res2);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">The Posh-Off</h2>
        <p className="text-slate-500 mb-6">Enter two MPs or constituencies to see who has the posher background.</p>
        
        <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="w-full max-w-xs relative">
             <input
                type="text"
                placeholder="MP or Place #1"
                value={mp1Name}
                onChange={(e) => setMp1Name(e.target.value)}
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
             />
          </div>
          <div className="bg-slate-100 p-2 rounded-full text-slate-400">
             <ArrowRightLeft size={24} />
          </div>
          <div className="w-full max-w-xs relative">
             <input
                type="text"
                placeholder="MP or Place #2"
                value={mp2Name}
                onChange={(e) => setMp2Name(e.target.value)}
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
             />
          </div>
          <button 
            type="submit"
            className="bg-purple-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-800 transition-colors w-full md:w-auto"
            disabled={status === LoadingState.LOADING}
          >
            {status === LoadingState.LOADING ? 'Analyzing...' : 'Compare'}
          </button>
        </form>
      </div>

      {status === LoadingState.ERROR && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-center gap-2">
           <AlertCircle size={20}/> Could not fetch data for comparison. Please try simpler names.
        </div>
      )}

      {status === LoadingState.SUCCESS && mp1Data && mp2Data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           {/* Winner Badge Logic */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
              <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold shadow-lg border-2 border-white whitespace-nowrap">
                 {mp1Data.poshScore > mp2Data.poshScore ? '👈 Posher' : mp1Data.poshScore < mp2Data.poshScore ? 'Posher 👉' : 'Tied!'}
              </div>
           </div>

           <div className={mp1Data.poshScore > mp2Data.poshScore ? 'transform scale-105 transition-transform' : 'opacity-80'}>
              <MPCard mp={mp1Data} />
           </div>
           <div className={mp2Data.poshScore > mp1Data.poshScore ? 'transform scale-105 transition-transform' : 'opacity-80'}>
              <MPCard mp={mp2Data} />
           </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;