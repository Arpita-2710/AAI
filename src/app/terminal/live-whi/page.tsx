'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer 
} from 'recharts';

// Mock sparkline data
const zoneAData = [
  { val: 40 }, { val: 60 }, { val: 45 }, { val: 70 }, { val: 80 }, { val: 88 }
];
const zoneBData = [
  { val: 50 }, { val: 40 }, { val: 55 }, { val: 60 }, { val: 68 }, { val: 72 }
];
const zoneCData = [
  { val: 90 }, { val: 80 }, { val: 75 }, { val: 60 }, { val: 50 }, { val: 45 }
];

export default function LiveWhiFeed() {
  const router = useRouter();
  const [pulseColor, setPulseColor] = useState('#EF4444');

  const [zoneA, setZoneA] = useState(zoneAData);
  const [zoneB, setZoneB] = useState(zoneBData);
  const [zoneC, setZoneC] = useState(zoneCData);

  const [scoreA, setScoreA] = useState(88);
  const [scoreB, setScoreB] = useState(72);
  const [scoreC, setScoreC] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseColor(prev => prev === '#EF4444' ? '#F87171' : '#EF4444');

      // Fluctuate scores slightly
      setScoreA(prev => Math.max(75, Math.min(99, prev + (Math.random() > 0.5 ? 1 : -1))));
      setScoreB(prev => Math.max(60, Math.min(85, prev + (Math.random() > 0.5 ? 1 : -1))));
      setScoreC(prev => Math.max(30, Math.min(55, prev + (Math.random() > 0.5 ? 1 : -1))));

      // Fluctuate bar charts values
      setZoneA(prev => [...prev.slice(1), { val: Math.max(75, Math.min(99, prev[prev.length - 1].val + Math.round((Math.random() - 0.5) * 6))) }]);
      setZoneB(prev => [...prev.slice(1), { val: Math.max(60, Math.min(85, prev[prev.length - 1].val + Math.round((Math.random() - 0.5) * 6))) }]);
      setZoneC(prev => [...prev.slice(1), { val: Math.max(30, Math.min(55, prev[prev.length - 1].val + Math.round((Math.random() - 0.5) * 6))) }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in font-sans text-sm text-slate-700">
      {/* Top Bento Layer: Overview & Heatmap */}
      <div className="grid grid-cols-12 gap-6">
        {/* Live Sparkline Grid */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <span className="material-symbols-outlined text-blue-600">analytics</span>
              Real-time Performance Trends
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm border-none cursor-pointer">Live</button>
              <button className="px-4 py-1.5 hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border-none cursor-pointer bg-transparent">1h</button>
              <button className="px-4 py-1.5 hover:bg-slate-50 text-slate-655 rounded-lg text-xs font-bold border-none cursor-pointer bg-transparent">24h</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zone A */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone A (International)</span>
                <span className="text-green-600 font-bold text-xs">↑ 4%</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 leading-none mb-2">{scoreA}</div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneA}>
                    <Bar dataKey="val" fill="#10B981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Zone B */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone B (Domestic)</span>
                <span className="text-amber-600 font-bold text-xs">→ 0%</span>
              </div>
              <div className="text-2xl font-bold text-amber-605 leading-none mb-2">{scoreB}</div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneB}>
                    <Bar dataKey="val" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Zone C */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone C (Lounges)</span>
                <span className="text-red-655 font-bold text-xs">↓ 12%</span>
              </div>
              <div className="text-2xl font-bold text-red-650 leading-none mb-2">{scoreC}</div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneC}>
                    <Bar dataKey="val" fill="#EF4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Attention Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-red-50 p-6 rounded-2xl border border-red-200 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-red-655 animate-pulse" style={{ color: pulseColor }}>warning</span>
              <h3 className="text-sm font-bold text-slate-900">Critical Attention</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-wider">Units below 20 WHI threshold</p>
            <div className="space-y-4">
              <div 
                onClick={() => router.push('/terminal/washrooms')}
                className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-red-500 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">M03 - Male</p>
                  <p className="text-[10px] text-slate-500 font-bold">Domestic Arrivals - L1</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-655">18</p>
                  <p className="text-[10px] text-red-650 font-bold uppercase tracking-wider">URGENT</p>
                </div>
              </div>

              <div 
                onClick={() => router.push('/terminal/washrooms')}
                className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-red-500 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">F09 - Female</p>
                  <p className="text-[10px] text-slate-500 font-bold">Gate 14 - Departure</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-655">22</p>
                  <p className="text-[10px] text-red-650 font-bold uppercase tracking-wider">MONITOR</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/terminal/incidents')}
            className="mt-6 w-full py-2.5 bg-red-650 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-red-705 transition-all cursor-pointer shadow-sm border-none text-xs"
          >
            <span className="material-symbols-outlined text-sm">emergency_share</span>
            Dispatch Rapid Response
          </button>
        </div>
      </div>

      {/* Bottom Layer: Leaderboard & Regional Map */}
      <div className="grid grid-cols-12 gap-6">
        {/* Leaderboard */}
        <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-sm font-bold text-slate-900">Performance Leaderboard</h3>
            <div className="flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span className="text-[10px] font-bold">Filter: Terminal 2 Wide</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-slate-200">
                <tr className="text-xs text-slate-555 font-bold uppercase tracking-wider">
                  <th className="py-4 px-2">Rank</th>
                  <th className="py-4 px-2">Unit Designation</th>
                  <th className="py-4 px-2">WHI Score</th>
                  <th className="py-4 px-2">Last 1h</th>
                  <th className="text-right py-4 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push('/terminal/washrooms')}>
                  <td className="py-4 px-2"><span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full text-xs shadow-sm">#1</span></td>
                  <td className="py-4 px-2 font-bold text-slate-900">M01 - International Dep.</td>
                  <td className="py-4 px-2"><span className="text-blue-600 font-bold">96</span></td>
                  <td className="py-4 px-2 text-green-600 font-bold">+2%</td>
                  <td className="py-4 px-2 text-right">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">EXCELLENT</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push('/terminal/washrooms')}>
                  <td className="py-4 px-2"><span className="w-8 h-8 flex items-center justify-center bg-amber-500 text-white font-bold rounded-full text-xs shadow-sm">#2</span></td>
                  <td className="py-4 px-2 font-bold text-slate-900">F04 - Central Plaza L2</td>
                  <td className="py-4 px-2"><span className="text-blue-600 font-bold">92</span></td>
                  <td className="py-4 px-2 text-slate-500 font-bold">0%</td>
                  <td className="py-4 px-2 text-right">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">EXCELLENT</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push('/terminal/washrooms')}>
                  <td className="py-4 px-2"><span className="w-8 h-8 flex items-center justify-center bg-slate-300 text-slate-700 font-bold rounded-full text-xs shadow-sm">#3</span></td>
                  <td className="py-4 px-2 font-bold text-slate-900">M12 - Lounge East</td>
                  <td className="py-4 px-2"><span className="text-blue-600 font-bold">89</span></td>
                  <td className="py-4 px-2 text-red-655 font-bold">-1%</td>
                  <td className="py-4 px-2 text-right">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">EXCELLENT</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push('/terminal/washrooms')}>
                  <td className="py-4 px-2"><span className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold text-xs">#4</span></td>
                  <td className="py-4 px-2 font-bold text-slate-900">F02 - Baggage Claim</td>
                  <td className="py-4 px-2"><span className="text-amber-600 font-bold">78</span></td>
                  <td className="py-4 px-2 text-green-600 font-bold">+5%</td>
                  <td className="py-4 px-2 text-right">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">GOOD</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Zone Density Grid Map */}
        <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Terminal Hygiene Map</h3>
            <p className="text-[10px] text-slate-500 mb-6 font-bold">Visual density and health hotspots</p>
          </div>
          <div className="grid grid-cols-5 grid-rows-4 gap-2 h-64 cursor-pointer" onClick={() => router.push('/terminal/floor-heatmap')}>
            <div className="bg-green-500/80 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/90 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/60 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/40 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-amber-500/40 rounded-sm hover:brightness-105 transition-all"></div>
            
            <div className="bg-green-500/70 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-red-500/30 rounded-sm border border-red-200 hover:brightness-105 transition-all animate-pulse"></div>
            <div className="bg-red-500/65 rounded-sm border border-red-300 hover:brightness-105 transition-all animate-pulse"></div>
            <div className="bg-amber-500/50 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/80 rounded-sm hover:brightness-105 transition-all"></div>
            
            <div className="bg-amber-500/30 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/50 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/90 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/70 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/40 rounded-sm hover:brightness-105 transition-all"></div>
            
            <div className="bg-green-500/60 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-amber-500/60 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-amber-500/40 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/80 rounded-sm hover:brightness-105 transition-all"></div>
            <div className="bg-green-500/90 rounded-sm hover:brightness-105 transition-all"></div>
          </div>
          <div className="mt-6 flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
              <span>Action Required</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
              <span>Average</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
              <span>Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
