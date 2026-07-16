'use client';

import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import Header from '@/components/admin/Header';
import { WashroomHealthTrendsChart, IncidentFrequencyBarChart } from '@/components/admin/Charts';
import Heatmap from '@/components/admin/Heatmap';

export default function AnalyticsPage() {
  const [showDetailedLog, setShowDetailedLog] = useState(false);

  return (
    <>
      <Header title="Analytics Report" placeholder="Search analytics insights..." />

      <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full flex-grow font-sans text-sm">
        {/* Filters & Global Actions */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col px-3 border-r border-slate-200">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 font-bold">
                Date Range
              </label>
              <select className="border-none bg-transparent p-0 text-sm text-slate-800 focus:ring-0 cursor-pointer focus:outline-none font-medium">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>

            <div className="flex flex-col px-3">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 font-bold">
                Terminal
              </label>
              <select className="border-none bg-transparent p-0 text-sm text-slate-800 focus:ring-0 cursor-pointer focus:outline-none font-medium">
                <option>All Terminals</option>
                <option>Terminal 1</option>
                <option>Terminal 5</option>
              </select>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Overall Health Index</p>
                <h3 className="text-2xl text-blue-600 mt-1 font-bold">94.2%</h3>
              </div>
              <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                health_and_safety
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+2.4%</span>
              <span className="text-xs text-slate-500 ml-1 font-normal">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Incidents</p>
                <h3 className="text-2xl text-slate-900 mt-1 font-bold">128</h3>
              </div>
              <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
                warning
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">12%</span>
              <span className="text-xs text-slate-500 ml-1 font-normal">increase</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Avg Response Time</p>
                <h3 className="text-2xl text-slate-900 mt-1 font-bold">14m</h3>
              </div>
              <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                timer
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span className="text-xs font-bold">3m</span>
              <span className="text-xs text-slate-500 ml-1 font-normal">
                improvement
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-550 font-medium">Active Personnel</p>
                <h3 className="text-2xl text-slate-900 mt-1 font-bold">452</h3>
              </div>
              <span className="material-symbols-outlined text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                engineering
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span className="text-xs font-bold">89%</span>
              <span className="text-xs text-slate-550 ml-1 font-normal">
                on-site now
              </span>
            </div>
          </div>
        </section>

        {/* Main Visualization Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trends line chart */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl lg:col-span-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg text-slate-900 font-bold">Washroom Health Trends</h2>
                <p className="text-xs text-slate-500">
                  Real-time aggregate facility hygiene scores across terminal nodes
                </p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Current
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span> Target
                </span>
              </div>
            </div>
            <WashroomHealthTrendsChart />
          </div>

          {/* Bar Chart frequencies */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl lg:col-span-4 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h2 className="text-lg text-slate-900 font-bold">Incident Frequency</h2>
              <p className="text-xs text-slate-500">Top hotspots by terminal</p>
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <IncidentFrequencyBarChart />
            </div>
            <button
              onClick={() => setShowDetailedLog(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700
                text-xs font-semibold border border-blue-200 bg-blue-50
                hover:bg-blue-100 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Eye size={15} />
              View Detailed Log
            </button>
          </div>

          {/* Heatmap Usage times */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl lg:col-span-12 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-lg text-slate-900 font-bold">
                  Peak Usage Density Heatmap
                </h2>
                <p className="text-xs text-slate-500">
                  Foot traffic intensity across all monitored facilities by day and hour
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold text-slate-500">Intensity:</span>
                <div className="flex h-3 w-32 rounded-full overflow-hidden">
                  <div className="flex-1 bg-slate-100"></div>
                  <div className="flex-1 bg-blue-200"></div>
                  <div className="flex-1 bg-blue-400"></div>
                  <div className="flex-1 bg-blue-600"></div>
                </div>
              </div>
            </div>
            <Heatmap />
          </div>
        </section>
      </div>

      {showDetailedLog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowDetailedLog(false)}
          />
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Incident Frequency — Detailed Log
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  All incidents grouped by terminal and severity
                </p>
              </div>
              <button
                onClick={() => setShowDetailedLog(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {/* Render full incidents table */}
              <DetailedIncidentLog />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailedIncidentLog() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/terminal/incidents')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
      })
      .catch(err => console.error('Error fetching terminal incidents:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="animate-spin text-slate-400 mr-2">⏳</span> Loading incidents log...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No incidents logged yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Incident ID</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Terminal</th>
            <th className="px-6 py-4">Severity</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Reported At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-slate-900">
                #{item.id}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-900">
                {item.title}
              </td>
              <td className="px-6 py-4">
                {item.terminalId || item.terminal_id || '—'}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  item.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' :
                  item.severity === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                  item.severity === 'MEDIUM' ? 'bg-yellow-50 text-yellow-750 border-yellow-200' :
                  'bg-green-50 text-green-600 border-green-200'
                }`}>
                  {item.severity}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  item.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-200' :
                  item.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-green-50 text-green-600 border-green-200'
                }`}>
                  {item.status?.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-slate-500">
                {new Date(item.createdAt || item.created_at).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
