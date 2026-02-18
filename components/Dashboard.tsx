import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { getGeneralStats } from '../services/gemini';
import { GlobalStats, LoadingState } from '../types';
import { Loader2, GraduationCap, School, Trophy, Crown, ArrowDown, ArrowUp, Map as MapIcon, BarChart3 } from 'lucide-react';
import UKMap from './UKMap';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  useEffect(() => {
    const fetchStats = async () => {
      setStatus(LoadingState.LOADING);
      try {
        const data = await getGeneralStats();
        setStats(data);
        setStatus(LoadingState.SUCCESS);
      } catch (e) {
        console.error(e);
        setStatus(LoadingState.ERROR);
      }
    };
    fetchStats();
  }, []);

  if (status === LoadingState.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-white rounded-xl shadow-sm border border-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700 mb-2" />
        <p className="text-slate-500 font-serif italic">Consulting the archives...</p>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare data for charts
  const privateSchoolData = stats.parties.map(p => ({
    name: p.partyName,
    value: p.privateSchoolPercent,
    color: p.color
  }));

  const pieData = [
    { name: 'Private School', value: stats.totalPrivateSchool, color: '#4c1d95' }, // violet-900
    { name: 'State School', value: 100 - stats.totalPrivateSchool, color: '#94a3b8' } // slate-400
  ];

  // Sort MPs for the leaderboard
  const sortedMPs = [...stats.notableMPs].sort((a, b) => b.poshScore - a.poshScore);

  // Sort parties by posh score for the comparison table
  const sortedParties = [...stats.parties].sort((a, b) => b.avgPoshScore - a.avgPoshScore);

  return (
    <div className="space-y-8">
      {/* Intro Text */}
      <div className="bg-purple-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <Trophy size={200} />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4 relative z-10">The State of the House</h2>
        <p className="text-purple-100 max-w-2xl text-lg relative z-10">
          {stats.summary}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <School className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wide font-bold">Privately Educated</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">{stats.totalPrivateSchool}%</div>
          <div className="text-xs text-slate-400 mt-2">National Avg: ~7%</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wide font-bold">Oxbridge Grads</span>
          </div>
          <div className="text-4xl font-serif font-bold text-slate-900">{stats.totalOxbridge}%</div>
          <div className="text-xs text-slate-400 mt-2">National Avg: &lt; 1%</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Trophy className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wide font-bold">Poshest Party</span>
          </div>
          <div className="text-4xl font-serif font-bold text-blue-600">
             {stats.parties.reduce((prev, current) => (prev.avgPoshScore > current.avgPoshScore) ? prev : current).partyName}
          </div>
          <div className="text-xs text-slate-400 mt-2">Based on aggregate score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* UK Map Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 font-serif border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapIcon className="text-blue-500" /> Geography of Privilege
           </h3>
           <UKMap regions={stats.regions} />
           <p className="text-xs text-slate-400 mt-4 text-center">
             Colour intensity represents average posh score of MPs in that region.
           </p>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-[300px]">
            <h3 className="text-lg font-bold text-slate-800 mb-2 font-serif border-b border-slate-100 pb-2">
              Private School Attendance by Party (%)
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={privateSchoolData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {privateSchoolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-[220px] flex items-center justify-between">
            <div className="w-1/2">
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-serif pb-2">
                  Parliament Composition
                </h3>
                <p className="text-sm text-slate-500 italic">
                  House of Commons vs National Average. The gap is narrowing but remains significant.
                </p>
            </div>
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={24} iconSize={8}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Party Comparison Table Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
           <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-purple-600" /> Party Poshness Rankings
           </h3>
           <p className="text-sm text-slate-500">Comparative breakdown of key privilege metrics by political party.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-100">Party</th>
                <th className="p-4 font-semibold border-b border-slate-100 w-1/4">Avg Posh Score</th>
                <th className="p-4 font-semibold border-b border-slate-100 w-1/4">Private School %</th>
                <th className="p-4 font-semibold border-b border-slate-100 w-1/4">Oxbridge %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedParties.map((party, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-serif font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }}></div>
                    {party.partyName}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm w-8">{party.avgPoshScore}</span>
                      <div className="h-2 flex-grow bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${party.avgPoshScore}%`, backgroundColor: party.color }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm w-8">{party.privateSchoolPercent}%</span>
                      <div className="h-2 flex-grow bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${party.privateSchoolPercent}%`, backgroundColor: party.color, opacity: 0.8 }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm w-8">{party.oxbridgePercent}%</span>
                      <div className="h-2 flex-grow bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${party.oxbridgePercent}%`, backgroundColor: party.color, opacity: 0.6 }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Crown className="text-yellow-500" /> Posh Leaderboard
          </h3>
          <p className="text-sm text-slate-500">Live data from recent analysis</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {sortedMPs.map((mp, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <div className="font-bold text-slate-800">{mp.name}</div>
                    <div className="text-xs font-semibold uppercase text-slate-400">{mp.party}</div>
                 </div>
                 <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded ${
                   mp.poshScore > 80 ? 'bg-purple-100 text-purple-700' : 
                   mp.poshScore > 50 ? 'bg-blue-100 text-blue-700' : 
                   'bg-green-100 text-green-700'
                 }`}>
                   {mp.poshScore}
                   {mp.poshScore > 50 ? <ArrowUp size={14}/> : <ArrowDown size={14}/>}
                 </div>
               </div>
               <p className="text-sm text-slate-600 italic mt-2">"{mp.reason}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;