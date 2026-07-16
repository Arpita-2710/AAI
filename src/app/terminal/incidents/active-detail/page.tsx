'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ActiveIncident {
  id: string;
  priority: 'Critical' | 'High' | 'Medium';
  category: string;
  categoryIcon: string;
  location: string;
  timeElapsed: string;
  assignedStaff: string;
  assignedAvatar?: string;
  status: string;
}

export default function ActiveIncidentsDetail() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const activeIncidents: ActiveIncident[] = [
    {
      id: '#INC-9821',
      priority: 'Critical',
      category: 'Electrical',
      categoryIcon: 'bolt',
      location: 'Gate B12 - Terminal 2',
      timeElapsed: '00:14:22',
      assignedStaff: 'M. Simmons',
      assignedAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsuotEnA-S_lTGnu5x1Fem6WgZDIuoNnyrtlKcFlHm5VQmgK3vAV6DYpypggppCg2g4b_SxI0l0DhRvo5m7reuFF-bXZW1cYdPZXiXbIo8yBLWgQY64xSWiXo4yuQTKdbAsqI1ihKszyV1pABcoy-SaKykYAl1UdH6zTxCdLAoBxVUGI5Tv38ZdWVnFYXDgCi7wJoUrrxzQ-_vOJFjQnwQYNtE9PRfREHGOI1RQq3QXtXkoPOOX0zvOCpVAqS5DxeIDxwlXTtih6Y',
      status: 'Dispatched'
    },
    {
      id: '#INC-9819',
      priority: 'High',
      category: 'Plumbing',
      categoryIcon: 'plumbing',
      location: 'Restroom 4A - North Concourse',
      timeElapsed: '00:45:10',
      assignedStaff: 'J. Taylor',
      assignedAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Jdvql4w9vCmbNE8207s79x-1xDQjr352z7zeH2Z3wAKJSdKhXndSrQnbQemkuy5CsaM1HEG-wDqdaVnBmAHeBTqY7iwF7RSGFfH25W3XwhukEBIrMwQ44E3UXiYUeM6jFHwQpkA4rvDfE_JfOt4hFIIFi_QXw_tLBMrBvvwLXT4TQ_KxeGS08xe1dcNr6menCShJZY_EpcFAwGY35sMAeNBXucmnTsjyoKQY_0rLYb0PYNH9K8ierw3HzohpyJJEKnY_oJ9363Q',
      status: 'In Progress'
    },
    {
      id: '#INC-9815',
      priority: 'Medium',
      category: 'Cleaning',
      categoryIcon: 'cleaning_services',
      location: 'Lounge Area C',
      timeElapsed: '01:02:44',
      assignedStaff: 'Unassigned',
      status: 'Unassigned'
    },
    {
      id: '#INC-9810',
      priority: 'Critical',
      category: 'Elevator Malfunction',
      categoryIcon: 'elevator',
      location: 'Elevator 3 - Main Hall',
      timeElapsed: '00:08:31',
      assignedStaff: 'D. Knight',
      assignedAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdOu630Mvzv15l9y_0SiKRpdTjlAmmPVTXpnujg_L60BgcTHxNrkeBV-Vv7hBNWNZJZbjGjxIwOM5tkiQwe39SPzkqXd6UpjTf0uuA-jahbZf3rcGjohKO1AptoFpW0owrQ-qBDXEvXheif18DpwJbDJGpeEDGF-rMcTktgxFnz8PYRTCGMrTX-0ARTeStVu3Zho0GTieVpE2EaNOjQi5173U1jOODqfZXlU3vAdC9fNykBQ4BlNvepmBlmGg31EYIy8THPhcvWYE',
      status: 'Dispatched'
    },
    {
      id: '#INC-9808',
      priority: 'Medium',
      category: 'IT/Network',
      categoryIcon: 'wifi_off',
      location: 'Kiosk 12-15 Row 4',
      timeElapsed: '02:15:00',
      assignedStaff: 'A. Lee',
      assignedAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7LWMWDmdOTXMyq0XgX3x1u4wVuGk6JFKQcJjuOd-eswDdhhiYltNggWT6NGQvRG-mk-o3qdXicktdBZyMW0oUIChBTx2_N2_gKxw0kSH7K7npHQSwzT9E_EBYsUIjoEA1PG_I1mhRYGbGG3Q1rM4HyhvSwuRQECTQWmePscu4telH6K4YPLmm44LwNuQQQ8bgqmTYqOen3LIOeeG__gHspTxdUaa-Ek37B61vzYe9k-0ozhdcm8ARVl3UmUEp6LhQud7yq1-xxi4',
      status: 'In Progress'
    }
  ];

  const handleRowClick = (id: string) => {
    router.push(`/terminal/incidents/summary-details`);
  };

  const filtered = activeIncidents.filter((inc) => {
    const term = searchTerm.toLowerCase();
    return (
      inc.id.toLowerCase().includes(term) ||
      inc.category.toLowerCase().includes(term) ||
      inc.location.toLowerCase().includes(term) ||
      inc.assignedStaff.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in font-sans">
      {/* Header Actions */}
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-xl text-on-surface font-bold">Active Incidents</h2>
          <p className="text-xs text-on-surface-variant">Real-time oversight of terminal infrastructure anomalies.</p>
        </div>
        <button 
          onClick={() => router.push('/terminal/incidents/summary-details')}
          className="bg-primary text-on-primary px-6 py-2 rounded shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 font-bold cursor-pointer border-none text-xs"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Incident
        </button>
      </div>

      {/* Summary Dashboard (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Critical */}
        <div className="bg-surface-container-lowest p-4 border-l-4 border-error shadow-sm rounded bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-error uppercase tracking-widest">Critical</span>
            <span className="material-symbols-outlined text-error">emergency</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-on-surface">04</span>
            <span className="text-xs text-on-surface-variant ml-1">Active Alerts</span>
          </div>
          <div className="mt-1 w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-error h-full w-[15%]"></div>
          </div>
        </div>
        
        {/* High */}
        <div className="bg-surface-container-lowest p-4 border-l-4 border-[#ff9100] shadow-sm rounded bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#ff9100] uppercase tracking-widest">High Priority</span>
            <span className="material-symbols-outlined text-[#ff9100]">priority_high</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-on-surface">12</span>
            <span className="text-xs text-on-surface-variant ml-1">Ongoing</span>
          </div>
          <div className="mt-1 w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-[#ff9100] h-full w-[45%]"></div>
          </div>
        </div>

        {/* Medium */}
        <div className="bg-surface-container-lowest p-4 border-l-4 border-tertiary shadow-sm rounded bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Medium</span>
            <span className="material-symbols-outlined text-tertiary">info</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-on-surface">28</span>
            <span className="text-xs text-on-surface-variant ml-1">Pending</span>
          </div>
          <div className="mt-1 w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-[70%]"></div>
          </div>
        </div>
      </div>

      {/* Incidents List / Table */}
      <div className="bg-surface-container-lowest rounded shadow-sm overflow-hidden border border-outline-variant bg-white">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center bg-surface-container-low gap-4">
          <h3 className="text-sm font-bold text-on-surface">Live Incident Feed</h3>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search incidents..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-white border border-outline-variant rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            </div>
            <button className="px-4 py-1.5 border border-outline-variant rounded bg-white hover:bg-surface-container-high text-xs flex items-center gap-1 cursor-pointer font-bold">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Incident ID</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Time Elapsed</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Assigned Staff</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 text-xs">
              {filtered.map((inc) => {
                const priorityPill = 
                  inc.priority === 'Critical' ? 'bg-error/10 text-error border-error/20' : 
                  inc.priority === 'High' ? 'bg-[#ff9100]/10 text-[#ff9100] border-[#ff9100]/20' : 
                  'bg-tertiary/10 text-tertiary border-tertiary/20';

                const statusPill = 
                  inc.status === 'Dispatched' ? 'bg-primary/10 text-primary border-primary/20' : 
                  inc.status === 'In Progress' ? 'bg-secondary-container text-on-secondary-container' : 
                  'bg-surface-container-high text-on-surface-variant border-outline-variant';

                return (
                  <tr 
                    key={inc.id}
                    onClick={() => handleRowClick(inc.id)}
                    className="hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-on-surface">{inc.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${priorityPill}`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">
                          {inc.categoryIcon}
                        </span>
                        <span className="font-medium text-on-surface">{inc.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface">{inc.location}</td>
                    <td className={`px-6 py-4 ${inc.priority === 'Critical' ? 'text-error font-bold' : 'text-on-surface'}`}>
                      {inc.timeElapsed}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center border border-outline-variant">
                          {inc.assignedAvatar ? (
                            <img alt="Staff Portrait" className="w-full h-full object-cover" src={inc.assignedAvatar} />
                          ) : (
                            <span className="material-symbols-outlined text-[14px]">person</span>
                          )}
                        </div>
                        <span className={`${inc.assignedStaff === 'Unassigned' ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                          {inc.assignedStaff}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${statusPill}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-sm">
                        chevron_right
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
          <p className="text-xs text-on-surface-variant font-medium">Showing {filtered.length} of 44 active incidents</p>
          <div className="flex gap-2">
            <button className="p-1 border border-outline-variant rounded bg-white hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="p-1 border border-outline-variant rounded bg-white hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Layout Quick Map View */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-surface-container-lowest p-6 border border-outline-variant rounded shadow-sm relative overflow-hidden h-[300px] bg-white">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-2 rounded border border-outline-variant shadow-sm">
            <h4 className="text-xs font-bold uppercase text-on-surface-variant">Live Geographic Context</h4>
          </div>
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center relative rounded-lg">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#006e2f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative w-full h-full">
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-error rounded-full animate-ping"></div>
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-error rounded-full border border-white"></div>
              <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#ff9100] rounded-full border border-white shadow-lg animate-pulse"></div>
              <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-tertiary rounded-full border border-white shadow-lg animate-pulse"></div>
            </div>
            <p className="absolute bottom-4 right-4 text-[10px] text-on-surface-variant bg-white/80 px-2 py-1 rounded font-bold">Interactive Terminal Floorplan Map Overlay</p>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-lowest p-6 border border-outline-variant rounded shadow-sm flex flex-col justify-between bg-white">
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant uppercase mb-2 border-b pb-1 font-bold">Incident Alerts History</h4>
            <div className="space-y-4 text-xs">
              <div className="flex gap-2 items-start">
                <span className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-bold text-on-surface">Critical Power Failure</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">2 mins ago • Gate B12</p>
                </div>
              </div>
              <div className="flex gap-2 items-start opacity-70">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-bold text-primary">Water Leak Resolved</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">15 mins ago • Hallway F</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-2 h-2 rounded-full bg-tertiary mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-bold text-on-surface">Wi-Fi Congestion</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">44 mins ago • Check-in Desks</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/terminal')}
            className="w-full mt-6 text-center text-xs font-bold text-primary hover:underline cursor-pointer border border-outline-variant rounded py-2 hover:bg-surface-container-low bg-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
