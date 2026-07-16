'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IncidentSummaryDetails() {
  const router = useRouter();
  const [resolved, setResolved] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans text-sm text-slate-700">
      {/* Top Details & Header Action Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Status & Identification */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                resolved ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-750'
              }`}>
                <span className={`w-2 h-2 rounded-full ${resolved ? 'bg-green-600' : 'bg-amber-600 animate-pulse'}`}></span>
                {resolved ? 'Resolved' : 'In Progress'}
              </span>
              <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Priority: High</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">HVAC Sensor Malfunction: Critical Warning</h3>
            <p className="text-slate-655 text-xs max-w-xl leading-relaxed">
              Terminal 2, Unit M03 reported anomalous temperature spike (28°C) in sterile zone area. Automated suppression systems on standby.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px] w-full md:w-auto">
            <button 
              onClick={() => setResolved(prev => !prev)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-none text-white ${
                resolved ? 'bg-slate-600 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {resolved ? 'Reopen Incident' : 'Mark Resolved'}
            </button>
            <button className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer">
              Reassign Personnel
            </button>
          </div>
        </div>

        {/* Personnel Assigned */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-202 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Personnel Assigned</h4>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <span className="material-symbols-outlined text-lg">engineering</span>
            </div>
            <div>
              <p className="text-xs text-slate-900 font-bold">Tech Group Delta</p>
              <p className="text-[10px] text-slate-500 font-bold">3 Personnel • ETA: 4m</p>
            </div>
          </div>
          <div className="flex -space-x-2 items-center">
            <img 
              alt="Team 1" 
              className="w-8 h-8 rounded-full border-2 border-white object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_D8gBCuRZmpnOHxR0QReGgrSC4pobQ_O1FYAsX2zQSLNRh0Gi8UTCyVvHD-haMPUzDNuret7onKOyDCRUgn9EugGuoXI48en-_HBpJVmxNVFbWSItdltLvJP16oXIYe4VYGGD4GnWnWC4f8InyiTVvWWyJUIxrnMguEfFEt9rcxjbFflplha9917K23TQfQqVWeCmbOoLangysECX9emS0aDdPW0DKEf1izC-N6mFZ-xcWwShvAowc23zcuM7nmvAqsT008qMd6U"
            />
            <img 
              alt="Team 2" 
              className="w-8 h-8 rounded-full border-2 border-white object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6hOs6uKn6MU1xUFm_cJQHcnCYnineYKcxhgvW69LjE6G6KK3U2v4q8tYFtkNMg2EfqeTzoFX3s-_JmT3F7O1yCwgG9oG2-9mMiPGOHNKY3SyvGfY_9UV8LlF8IFKzdJrf7WlPNnh8j2t39bupyy9IXmqSQ3nuCUBn3BFcU07tDp6C0u9QUNtljEed2N06aP63TUFT2KcMAYsy1yRI7S0456kYCAIwGYxcNTV1hT9CqY4D3jQjEoiAfk00rHbXEkaAe443mWMW4dg"
            />
            <img 
              alt="Team 3" 
              className="w-8 h-8 rounded-full border-2 border-white object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlO_CFbEAWtkYtUd8QThP5kK-82bqveEKaEjynGgXVc_6RDxhd6dvgvmF0EwojFrUwZhviAKHH5O6-K-xng23cSiKfdCqENRCTyIK_nWRuq6ODhkYmUXg6N9abNAYqE12bklBqNkXFKQPEFR1RwWUskEAU0CrGfPlomeaDKZ1HygtOarRK44la7sc2bqbZdiVN4ZeOuo7GQCI3DhFQKhzMImKRQAxmu7R_qmbW2E8lqRMzOXxNDn8wtagV19cLkYlHVX5EFtwrcH4"
            />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">+2</div>
          </div>
        </div>
      </div>

      {/* Content Grid: Timeline and Map */}
      <div className="grid grid-cols-12 gap-6">
        {/* Timeline & Logs */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Summary Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-6">Technical Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Time Happened</p>
                <p className="text-xs text-slate-900 font-bold">10:24:15 AM</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Detection Source</p>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">sensors</span>
                  <p className="text-xs text-slate-900 font-bold">Auto-Sensor #882</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Duration</p>
                <p className="text-xs text-slate-900 font-bold">00:32:11</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Risk Level</p>
                <p className="text-xs text-red-655 font-bold">Elevated (Level 2)</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-slate-900">Incident Activity Log</h4>
              <button className="text-blue-600 text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline border-none bg-transparent">
                <span className="material-symbols-outlined text-[16px]">add_notes</span>
                Add Update
              </button>
            </div>
            <div className="space-y-0 relative text-xs">
              {/* Vertical timeline line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-200"></div>

              {/* Entry 1 */}
              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center z-10 text-slate-500 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">update</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">Status Update: Dispatching Team</p>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">10:48 AM</span>
                  </div>
                  <div className="text-xs text-slate-655 leading-snug bg-slate-50 p-4 rounded-xl border border-slate-100">
                    Tech Group Delta has been dispatched to Level 2 sterile zone. ETA was confirmed by team lead Henderson.
                  </div>
                </div>
              </div>

              {/* Entry 2 */}
              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center z-10 text-blue-600 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">person_check</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">Incident Assigned</p>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">10:35 AM</span>
                  </div>
                  <p className="text-xs text-slate-550 leading-snug">
                    Incident reviewed by Operations Desk. Assigned to HVAC specialist group.
                  </p>
                </div>
              </div>

              {/* Entry 3 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-red-50 border border-red-205 flex items-center justify-center z-10 text-red-655 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">Initial Detection</p>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">10:24 AM</span>
                  </div>
                  <p className="text-xs text-slate-550 leading-snug">
                    Autonomous sensor #882 detected temperature spike at 28.4°C. Localized humidity drop triggered secondary alert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Diagnostics Side */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location Matrix</h4>
              <span 
                className="text-blue-600 text-xs font-bold cursor-pointer hover:underline"
                onClick={() => router.push('/terminal/floor-heatmap')}
              >
                Full Map View
              </span>
            </div>
            <div className="relative h-80 bg-slate-50 group">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  alt="Floor Plan" 
                  className="w-full h-full object-cover opacity-50 grayscale" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH5YDXkAJhIpcjGA9GiIe85KTzwjN2v8IPldU7rB_KTf-qJKWk1JQrij-FgfAww2ovYuOvuiiAvTkQy6u7juYSEDU_Ctg6CTCG-mK9jJFmvfyB_eVucOp8_iSBLVi8BonNx60Kyzqe4bxort9fvRtGfCM3bBZEqWqrpfqVPwOdoyz-f-P6UT09Pee2DZNWw9AsyCoFOvSleKTytzmn0H41vyjQv321LTRy2G_A_8am4RJ_UkqCOVF_IJxSEHZlGeEimiS1bamfbew"
                />
                
                {/* Spatial Overlay Pulse */}
                <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 bg-red-500/35 rounded-full animate-ping"></div>
                    <div className="absolute w-8 h-8 bg-red-500/50 rounded-full"></div>
                    <div className="relative w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-xl"></div>
                    <div className="absolute top-6 left-6 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap">
                      <p className="text-xs font-bold text-slate-900">Unit M03-1024</p>
                      <p className="text-[10px] text-slate-500 font-bold font-mono">Area Heat: 28.4°C</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white border border-slate-200 hover:border-slate-350 rounded-full shadow-md flex items-center justify-center text-slate-700 cursor-pointer">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="w-10 h-10 bg-white border border-slate-200 hover:border-slate-350 rounded-full shadow-md flex items-center justify-center text-slate-700 cursor-pointer">
                  <span className="material-symbols-outlined">remove</span>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2 bg-slate-50 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">pin_drop</span>
                <div>
                  <p className="font-bold text-slate-900">Terminal 2, Level 2</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Sector 12B - Sterile Zone</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">stairs</span>
                <div>
                  <p className="font-bold text-slate-900">Nearest Egress</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Gate B22 Service Elevator (12m)</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Diagnostics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Diagnostics</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-655 font-medium">HVAC Controller M03</span>
                <span className="text-red-655 font-bold">Unresponsive</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-red-500 h-full w-full"></div>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-655 font-medium">Air Flow Rate</span>
                <span className="text-blue-650 font-bold">Normal</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-full" style={{ width: '85%' }}></div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-655 font-medium">Secondary Sensor #883</span>
                <span className="text-blue-650 font-bold">Online</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-full w-full"></div>
              </div>
            </div>
            <button className="w-full py-2.5 text-blue-600 text-xs border border-blue-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl transition-colors cursor-pointer font-bold bg-white shadow-sm">
              Run Full Diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
