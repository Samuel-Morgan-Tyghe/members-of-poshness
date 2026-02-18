import React from 'react';
import { MPProfile } from '../types';
import Poshometer from './Poshometer';
import { Briefcase, GraduationCap, Building2 } from 'lucide-react';

interface MPCardProps {
  mp: MPProfile;
}

const MPCard: React.FC<MPCardProps> = ({ mp }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in-up">
      <div className={`h-2 w-full ${mp.party.includes('Conserv') ? 'bg-blue-600' : mp.party.includes('Lab') ? 'bg-red-600' : mp.party.includes('Lib') ? 'bg-orange-400' : 'bg-green-600'}`}></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Left: Key Stats & Gauge */}
        <div className="p-6 md:border-r border-slate-100 bg-slate-50 flex flex-col items-center justify-center">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-serif font-bold text-slate-900">{mp.name}</h2>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mt-1">{mp.party} | {mp.constituency}</p>
            </div>
            <Poshometer score={mp.poshScore} />
        </div>

        {/* Right: Details & Analysis */}
        <div className="col-span-2 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif flex items-center gap-2">
                <GraduationCap className="text-purple-600" /> Educational Background
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Secondary School</p>
                    <p className="font-semibold text-slate-800">{mp.education.secondary}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${
                        mp.education.schoolType === 'Private' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {mp.education.schoolType}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">University</p>
                    <p className="font-semibold text-slate-800">{mp.education.university || "None / Unknown"}</p>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif flex items-center gap-2">
                <Briefcase className="text-blue-600" /> Career & Wealth
            </h3>
            <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                    {mp.previousJobs.map((job, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                            {job}
                        </span>
                    ))}
                </div>
                {mp.netWorthEstimate && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 bg-green-50 px-3 py-2 rounded-md border border-green-100">
                        <Building2 size={16} className="text-green-600"/> 
                        <span>Wealth Indicator: <span className="font-semibold text-green-800">{mp.netWorthEstimate}</span></span>
                    </div>
                )}
            </div>

            <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 relative">
                <div className="text-4xl text-yellow-300 absolute top-2 left-2 font-serif opacity-50">"</div>
                <p className="text-slate-700 italic relative z-10 pl-4">
                    {mp.poshAnalysis}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MPCard;