'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  // Settings State variables
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [amberThreshold, setAmberThreshold] = useState(65);

  const [notifyOps, setNotifyOps] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [emergencyPA, setEmergencyPA] = useState(false);

  const [pollingFrequency, setPollingFrequency] = useState('15 Seconds (Optimized)');
  const [diagnosticMode, setDiagnosticMode] = useState(false);

  const [openingTime, setOpeningTime] = useState('04:00');
  const [closingTime, setClosingTime] = useState('23:30');

  const [peakHours, setPeakHours] = useState(['06:00 - 09:00', '17:00 - 20:00']);
  const [newPeakStart, setNewPeakStart] = useState('');
  const [newPeakEnd, setNewPeakEnd] = useState('');
  const [showAddRangeForm, setShowAddRangeForm] = useState(false);

  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const prodKeyFull = 'sk_prod_99x_7f8g9h1i2j3k4l5m6n7o8p9q3a2f';
  const prodKeyMasked = 'sk_prod_99x_••••••••••••••••••••3a2f';

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(prodKeyFull);
    setCopied(true);
    showToastMessage('API key copied to clipboard.');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleAddRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeakStart || !newPeakEnd) {
      showToastMessage('Please specify both start and end times.', 'error');
      return;
    }
    const newRange = `${newPeakStart} - ${newPeakEnd}`;
    if (peakHours.includes(newRange)) {
      showToastMessage('This peak range already exists.', 'error');
      return;
    }
    setPeakHours([...peakHours, newRange]);
    setNewPeakStart('');
    setNewPeakEnd('');
    setShowAddRangeForm(false);
    showToastMessage('Peak hour range added.');
  };

  const handleRemoveRange = (range: string) => {
    setPeakHours(peakHours.filter((r) => r !== range));
    showToastMessage('Peak hour range removed.');
  };

  const handleDiscardChanges = () => {
    // Reset to defaults
    setCriticalThreshold(85);
    setAmberThreshold(65);
    setNotifyOps(true);
    setAutoDispatch(true);
    setEmergencyPA(false);
    setPollingFrequency('15 Seconds (Optimized)');
    setDiagnosticMode(false);
    setOpeningTime('04:00');
    setClosingTime('23:30');
    setPeakHours(['06:00 - 09:00', '17:00 - 20:00']);
    setShowAddRangeForm(false);
    showToastMessage('All unsaved modifications discarded.');
  };

  const handleSaveConfiguration = () => {
    showToastMessage('Global configuration saved successfully.');
  };

  const handleRefreshWebhook = () => {
    showToastMessage('Webhook endpoint regenerated successfully.');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in font-sans text-sm">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border text-xs font-bold transition-all transform translate-y-0 scale-100 ${
            toast.type === 'success'
              ? 'bg-white text-emerald-700 border-emerald-200'
              : 'bg-white text-red-700 border-red-200'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header Area */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-xl text-slate-900 mb-1 font-bold">Global Settings</h1>
          <p className="text-xs text-slate-500">
            Configure system-wide operational thresholds and terminal parameters.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleDiscardChanges}
            className="flex-1 md:flex-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer text-center"
          >
            DISCARD CHANGES
          </button>
          <button
            onClick={handleSaveConfiguration}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer text-center border-none"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Section: System Thresholds (WHI Alerts) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <span className="material-symbols-outlined text-blue-600">warning</span>
              <h3 className="text-sm font-bold text-slate-900">System Thresholds (WHI Alerts)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    CRITICAL THRESHOLD (%)
                  </span>
                  <input
                    className="w-full accent-red-500 cursor-pointer"
                    max="100"
                    min="0"
                    type="range"
                    value={criticalThreshold}
                    onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] mt-1 text-red-650 font-bold">
                    <span>ALERT TRIGGERED AT {criticalThreshold}%</span>
                    <span>HIGH</span>
                  </div>
                </label>

                <label className="block pt-4">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    AMBER ALERT THRESHOLD (%)
                  </span>
                  <input
                    className="w-full accent-amber-500 cursor-pointer"
                    max="100"
                    min="0"
                    type="range"
                    value={amberThreshold}
                    onChange={(e) => setAmberThreshold(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] mt-1 text-amber-600 font-bold">
                    <span>WARNING AT {amberThreshold}%</span>
                    <span>MEDIUM</span>
                  </div>
                </label>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-fit">
                <h4 className="text-xs font-bold mb-4 text-blue-600">ALERT ESCALATION LOGIC</h4>
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Notify Operations Manager</span>
                    <input
                      checked={notifyOps}
                      onChange={(e) => setNotifyOps(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                      type="checkbox"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-Dispatch Cleaning Crew</span>
                    <input
                      checked={autoDispatch}
                      onChange={(e) => setAutoDispatch(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                      type="checkbox"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emergency PA Announcement</span>
                    <input
                      checked={emergencyPA}
                      onChange={(e) => setEmergencyPA(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                      type="checkbox"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Device Polling */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <span className="material-symbols-outlined text-blue-600">sensors</span>
              <h3 className="text-sm font-bold text-slate-900">Device Polling</h3>
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  IOT POLLING FREQUENCY
                </span>
                <select
                  value={pollingFrequency}
                  onChange={(e) => setPollingFrequency(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 text-slate-805"
                >
                  <option value="5 Seconds (Real-time)">5 Seconds (Real-time)</option>
                  <option value="15 Seconds (Optimized)">15 Seconds (Optimized)</option>
                  <option value="60 Seconds (Low Power)">60 Seconds (Low Power)</option>
                  <option value="5 Minutes (Summary Only)">5 Minutes (Summary Only)</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-[10px] text-blue-750 flex items-start gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px] mt-0.5 text-blue-600">info</span>
                  <span>Optimized polling reduces network congestion by 34% in Terminal 3.</span>
                </p>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-4 text-xs font-bold">
                <span className="text-slate-700">Diagnostic Mode</span>
                <button
                  onClick={() => {
                    const nextVal = !diagnosticMode;
                    setDiagnosticMode(nextVal);
                    showToastMessage(`Diagnostic Mode ${nextVal ? 'activated' : 'deactivated'}.`);
                  }}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer border-none ${
                    diagnosticMode ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      diagnosticMode ? 'left-[26px]' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Terminal Operating Hours */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <span className="material-symbols-outlined text-blue-600">schedule</span>
            <h3 className="text-sm font-bold text-slate-900">Terminal Operating Hours</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  OPENING TIME
                </span>
                <input
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  CLOSING TIME
                </span>
                <input
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                PEAK HOURS OVERRIDE
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                {peakHours.map((range) => (
                  <span
                    key={range}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px] rounded-full group hover:bg-blue-100 transition-colors"
                  >
                    <span>{range}</span>
                    <button
                      onClick={() => handleRemoveRange(range)}
                      className="material-symbols-outlined text-[14px] text-blue-600 cursor-pointer hover:text-red-650 transition-colors border-none bg-transparent"
                      title="Remove range"
                    >
                      close
                    </button>
                  </span>
                ))}

                {showAddRangeForm ? (
                  <form
                    onSubmit={handleAddRange}
                    className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50"
                  >
                    <input
                      required
                      type="time"
                      className="bg-transparent border-none p-0 text-[10px] font-bold w-16 text-slate-800 outline-none"
                      value={newPeakStart}
                      onChange={(e) => setNewPeakStart(e.target.value)}
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      required
                      type="time"
                      className="bg-transparent border-none p-0 text-[10px] font-bold w-16 text-slate-800 outline-none"
                      value={newPeakEnd}
                      onChange={(e) => setNewPeakEnd(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="material-symbols-outlined text-blue-600 cursor-pointer hover:scale-110 text-[18px] border-none bg-transparent"
                    >
                      check
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddRangeForm(false)}
                      className="material-symbols-outlined text-slate-400 cursor-pointer hover:scale-110 text-[18px] border-none bg-transparent"
                    >
                      close
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowAddRangeForm(true)}
                    className="px-3 py-1 border border-slate-300 border-dashed text-slate-500 font-bold text-[10px] rounded-full hover:bg-slate-50 transition-colors cursor-pointer bg-white"
                  >
                    + ADD RANGE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Integration Keys */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <span className="material-symbols-outlined text-blue-600">key</span>
              <h3 className="text-sm font-bold text-slate-900">Integration & API Keys</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 items-end text-xs">
                <div className="col-span-10">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">
                    PRODUCTION ENVIRONMENT KEY
                  </span>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <span className="text-slate-650 font-mono flex-1 truncate select-all">
                      {keyVisible ? prodKeyFull : prodKeyMasked}
                    </span>
                    <button
                      onClick={() => setKeyVisible(!keyVisible)}
                      className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-blue-600 transition-colors ml-2 border-none bg-transparent text-sm"
                      title={keyVisible ? 'Hide Key' : 'Show Key'}
                    >
                      {keyVisible ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleCopyKey}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-2 rounded-xl transition-colors cursor-pointer flex justify-center items-center text-slate-700"
                    title="Copy Key"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-end text-xs">
                <div className="col-span-10">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">
                    STAGING/DEV WEBHOOK
                  </span>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <span className="text-slate-655 font-mono flex-1 truncate select-all">
                      https://api.skyhub.ops/v2/webhooks/T3
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleRefreshWebhook}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-2 rounded-xl transition-colors cursor-pointer flex justify-center items-center text-slate-700"
                    title="Regenerate Endpoint"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Activity Card */}
        <div className="col-span-12 bg-slate-50 border border-slate-200 p-6 rounded-2xl relative overflow-hidden group shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 scale-125">verified_user</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Security & Compliance Baseline
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Last certified audit completed on Oct 24, 2024. Next scan in 12 days.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/terminal/audit-log')}
              className="w-full md:w-auto bg-blue-50 hover:bg-blue-100 text-blue-700 px-6 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:shadow-lg transition-all cursor-pointer border-none shadow-sm"
            >
              VIEW AUDIT LOGS
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
