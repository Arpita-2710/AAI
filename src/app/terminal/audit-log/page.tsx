'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuditRow {
  timestamp: string;
  user: string;
  isSystem: boolean;
  type: string;
  typeColor: string;
  unit: string;
  details: string;
  status: string;
  statusColor: string;
}

export default function AuditLog() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All Activities');
  const [activeTimeframe, setActiveTimeframe] = useState<'24h' | '7d' | 'custom'>('24h');

  const rows: AuditRow[] = [
    {
      timestamp: '2024-10-24 14:22:05',
      user: 'j.doe_admin',
      isSystem: false,
      type: 'Sensor Config',
      typeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
      unit: 'T2-GATE-A14-S3',
      details: 'Threshold adjusted: 3500ms -> 5000ms response.',
      status: 'SUCCESS',
      statusColor: 'bg-green-50 text-green-700 border border-green-200'
    },
    {
      timestamp: '2024-10-24 14:18:12',
      user: 'SYS_MONITOR_04',
      isSystem: true,
      type: 'Status Update',
      typeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
      unit: 'T2-MAIN-HVAC-CTRL',
      details: 'Auto-balancing load distribution for Zone 4.',
      status: 'LIVE',
      statusColor: 'bg-blue-50 text-blue-700 border border-blue-200'
    },
    {
      timestamp: '2024-10-24 13:55:30',
      user: 'SYS_AUTH_AUTHX',
      isSystem: true,
      type: 'Security Alert',
      typeColor: 'bg-red-50 text-red-700 border border-red-200',
      unit: 'T2-AUTH-SRV-01',
      details: 'Multiple failed login attempts detected from [10.2.44.112].',
      status: 'BLOCKED',
      statusColor: 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
    },
    {
      timestamp: '2024-10-24 13:42:12',
      user: 's.smith_maint',
      isSystem: false,
      type: 'Device Login',
      typeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      unit: 'T2-LIFT-09-SVC',
      details: 'Service panel accessed via physical NFC key.',
      status: 'AUTHORIZED',
      statusColor: 'bg-green-50 text-green-700 border border-green-200'
    },
    {
      timestamp: '2024-10-24 13:30:00',
      user: 'CRON_BACKUP_SVR',
      isSystem: true,
      type: 'System Backup',
      typeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
      unit: 'CLD-ARC-T2-01',
      details: 'Daily snapshot of T2 configuration completed.',
      status: 'ARCHIVED',
      statusColor: 'bg-slate-100 text-slate-600 border border-slate-200'
    },
    {
      timestamp: '2024-10-24 13:15:22',
      user: 'a.mercer_admin',
      isSystem: false,
      type: 'User Grant',
      typeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
      unit: 'IAM-SYSTEM-PROV',
      details: 'Elevated privileges granted to s.maintenance_1 for 2 hours.',
      status: 'APPROVED',
      statusColor: 'bg-green-50 text-green-700 border border-green-200'
    }
  ];

  const filteredRows = rows.filter((row) => {
    const matchesSearch = 
      row.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeType === 'All Activities' || row.type === activeType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in text-slate-705 font-sans text-sm">
      {/* Header Actions */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Audit Log</h2>
          <p className="text-xs text-slate-500">Terminal 2 Central Management System • Historical Records</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:shadow-md transition-all active:scale-95 cursor-pointer border-none shadow-sm">
          <span className="material-symbols-outlined text-[18px]">download</span> Export Report
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-1 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Events (24h)</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">12,482</span>
            <span className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5"><span className="material-symbols-outlined text-[16px]">trending_up</span> 4.2%</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-1 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Flags</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl text-red-655 font-bold">12</span>
            <span className="text-red-650 text-[10px] font-bold flex items-center gap-0.5"><span className="material-symbols-outlined text-[16px]">warning</span> Action Required</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-1 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Sync Rate</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">99.98%</span>
            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
              <div className="h-full bg-blue-600 w-[99%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-1 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Controllers</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">48</span>
            <span className="text-xs text-slate-555 font-bold">8 standby</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <section className="bg-white border border-slate-205 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTimeframe('24h')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                activeTimeframe === '24h' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-550 hover:text-slate-900 bg-transparent'
              }`}
            >
              Last 24h
            </button>
            <button 
              onClick={() => setActiveTimeframe('7d')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                activeTimeframe === '7d' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-550 hover:text-slate-900 bg-transparent'
              }`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setActiveTimeframe('custom')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                activeTimeframe === 'custom' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-550 hover:text-slate-900 bg-transparent'
              }`}
            >
              Custom Range
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">FILTER BY TYPE:</span>
            <select 
              value={activeType} 
              onChange={(e) => setActiveType(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-800 focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option>All Activities</option>
              <option value="User Login">User Login</option>
              <option value="Sensor Config">Sensor Config</option>
              <option value="Status Update">Status Update</option>
              <option value="Security Alert">Security Alert</option>
              <option value="Device Login">Device Login</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">filter_list</span>
          <input 
            type="text" 
            placeholder="Filter by Unit ID or Keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-1.5 bg-white border border-slate-300 rounded-xl text-xs w-full sm:w-72 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-slate-800"
          />
        </div>
      </section>

      {/* Audit Table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold">
              <tr>
                <th className="px-6 py-4 text-slate-500">TIMESTAMP</th>
                <th className="px-6 py-4 text-slate-500">USER / SYSTEM</th>
                <th className="px-6 py-4 text-slate-500">ACTION TYPE</th>
                <th className="px-6 py-4 text-slate-500">UNIT ID</th>
                <th className="px-6 py-4 text-slate-500">DETAILS</th>
                <th className="px-6 py-4 text-slate-500 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">{row.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-450">
                        {row.isSystem ? 'robot_2' : 'person_check'}
                      </span>
                      <span className="text-slate-900 font-semibold">{row.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${row.typeColor}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">{row.unit}</td>
                  <td className={`px-6 py-4 ${row.type === 'Security Alert' ? 'text-red-655 font-bold' : 'text-slate-700'}`}>
                    {row.details}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full border ${row.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span className="text-[10px] font-bold">{row.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs font-medium">
          <span className="text-slate-500 font-bold">Showing 1-{filteredRows.length} of 12,482 entries</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer bg-white">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm border-none">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 cursor-pointer bg-white">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 cursor-pointer bg-white">3</button>
            <span className="px-1 text-slate-500">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer bg-white">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Activity Map & System Health (Bento Style) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Live Activity Map */}
        <div 
          onClick={() => router.push('/terminal/floor-heatmap')}
          className="lg:col-span-2 relative bg-white border border-slate-200 rounded-2xl overflow-hidden min-h-[260px] p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center relative z-10 mb-4">
            <h4 className="text-sm font-bold text-slate-900">Live Activity Map: Terminal 2</h4>
            <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              34 Active Logs/min
            </span>
          </div>
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img 
              className="w-full h-full object-cover grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU67M5vkcFIhx3oPvYV557p3oQx4l93PNjsSOKiD6IAfONQlv1TdXh9gSWrbgUqmUZGjSRPr6DDvRYMY48g-rooZvYtZQ5Bc7R0oRt07YLigFNykXaNBRrow2AmiLd1xj98aHhf-Af_daRCTa7wRisxB6EPtRgZfRe8c4-icXYMKrQ1kZnGpP0Z7sJBLxxtgzgQ2hqJ6qyjlZZnGWmTjXx1GEeJXOjDtRhOs5MbDzZl7Osolt2mGxGwHmMMfqesywzB3p81WgKr3c" 
              alt="Terminal Floor Plan"
            />
          </div>
          
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_#2563EB]"></div>
          <div className="absolute top-1/4 left-2/3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#EF4444]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_#2563EB]"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-300 opacity-30 uppercase">TERMINAL 2 BLUEPRINT OVERLAY</span>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-205 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">System Health</h4>
            <div className="space-y-4 text-xs font-bold">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-800">DATABASE SYNC</span>
                  <span className="text-blue-650">OPTIMAL</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-blue-600 w-[94%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-800">API LATENCY</span>
                  <span className="text-blue-650">12ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-blue-600 w-[98%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-800">STORAGE CAPACITY</span>
                  <span className="text-blue-600 font-bold">64%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-blue-600 w-[64%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-700">
            <span className="material-symbols-outlined text-blue-600 text-sm">cloud_done</span>
            <span>Cloud replication active</span>
          </div>
        </div>
      </section>
    </div>
  );
}
