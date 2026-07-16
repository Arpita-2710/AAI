'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/admin/Header';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('Alex Thompson');
  const [email, setEmail] = useState('alex.thompson@aerometric.com');
  const [dept, setDept] = useState('Operations Control Center');

  // Sliders states
  const [congestion, setCongestion] = useState(85);
  const [heatWarning, setHeatWarning] = useState(42);
  const [slaTime, setSlaTime] = useState(350);

  // Operational Mode State
  const [opMode, setOpMode] = useState('standard');

  // Notifications state
  const [notifs, setNotifs] = useState({
    criticalInApp: true,
    criticalEmail: true,
    criticalSMS: true,
    perfInApp: true,
    perfEmail: true,
    perfSMS: false,
    maintInApp: true,
    maintEmail: false,
    maintSMS: false,
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile configurations successfully saved!');
  };

  return (
    <>
      <Header title="Settings" placeholder="Search settings..." />

      <div className="p-6 max-w-[1200px] mx-auto w-full flex-grow font-sans text-sm">
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Section */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <img
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-slate-100 shadow-md object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY9u9jyh7jrv-1Ys95tJ91IsVNZkig5M6AYSRSUjDxoheHMz_FTjRWYkFkrYwEQQPufzdlJmWQC7uyHgmx3iSoO2eEf3n3al9q34_mPX1v9iIaUc3PoVzbFGwCvCp5NxvLkoen8NubjLTanhvqmIDd4cKePj_Gb_6gZhx2JXpmfH-2Ps6LvZnPLJwzIDqfqX6GmGJd4Ze12q8EZnL6EBLsmx8JXT5YClk4-9jpD-aIhi45ALJkWfXKjvWeoaayxR7-zxGJvbJxt8_z"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-none cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                <div>
                  <h2 className="text-lg text-slate-900 font-bold leading-tight">{fullName}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">System Administrator</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold">
                    Verified Personnel
                  </span>
                </div>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option>Operations Control Center</option>
                    <option>IT Infrastructure</option>
                    <option>Facility Management</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-all active:scale-[0.98] font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save Profile
                </button>
              </form>
            </div>
          </section>

          {/* System Config & Notifications */}
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* System Thresholds */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">tune</span>
                  <h3 className="text-lg font-bold text-slate-900">System Configurations</h3>
                </div>
                <span className="text-xs text-slate-500 italic">Last sync: 02m ago</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Alert Thresholds
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>Critical Congestion</span>
                        <span className="text-blue-600 font-bold">{congestion}%</span>
                      </div>
                      <input
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        type="range"
                        min="50"
                        max="100"
                        value={congestion}
                        onChange={(e) => setCongestion(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>Hardware Heat Map Warning</span>
                        <span className="text-emerald-650 font-bold">{heatWarning}°C</span>
                      </div>
                      <input
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        type="range"
                        min="20"
                        max="80"
                        value={heatWarning}
                        onChange={(e) => setHeatWarning(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>Response Time SLA</span>
                        <span className="text-violet-600 font-bold">{slaTime}ms</span>
                      </div>
                      <input
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-650"
                        type="range"
                        min="100"
                        max="1000"
                        value={slaTime}
                        onChange={(e) => setSlaTime(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Operational Mode
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      onClick={() => setOpMode('standard')}
                      className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                        opMode === 'standard'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-blue-600'
                      }`}
                    >
                      <input
                        checked={opMode === 'standard'}
                        onChange={() => setOpMode('standard')}
                        className="text-blue-600 focus:ring-blue-500 mr-3 cursor-pointer"
                        name="mode"
                        type="radio"
                      />
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${opMode === 'standard' ? 'text-blue-700' : 'text-slate-900'}`}>
                          Standard Optimization
                        </span>
                        <span className="text-[11px] text-slate-500">Balanced resource allocation and monitoring.</span>
                      </div>
                    </label>
                    <label
                      onClick={() => setOpMode('density')}
                      className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                        opMode === 'density'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-blue-600'
                      }`}
                    >
                      <input
                        checked={opMode === 'density'}
                        onChange={() => setOpMode('density')}
                        className="text-blue-600 focus:ring-blue-500 mr-3 cursor-pointer"
                        name="mode"
                        type="radio"
                      />
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${opMode === 'density' ? 'text-blue-700' : 'text-slate-900'}`}>
                          High Density Response
                        </span>
                        <span className="text-[11px] text-slate-500">Increased polling frequency for peak traffic.</span>
                      </div>
                    </label>
                    <label
                      onClick={() => setOpMode('energy')}
                      className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                        opMode === 'energy'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-blue-600'
                      }`}
                    >
                      <input
                        checked={opMode === 'energy'}
                        onChange={() => setOpMode('energy')}
                        className="text-blue-600 focus:ring-blue-500 mr-3 cursor-pointer"
                        name="mode"
                        type="radio"
                      />
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${opMode === 'energy' ? 'text-blue-700' : 'text-slate-900'}`}>
                          Energy Conservation
                        </span>
                        <span className="text-[11px] text-slate-500">Reduced sensor reporting for low-traffic hours.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-blue-600">notifications_active</span>
                <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="pb-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Category</th>
                      <th className="pb-3 text-xs text-slate-500 font-bold uppercase tracking-wider text-center">In-App</th>
                      <th className="pb-3 text-xs text-slate-500 font-bold uppercase tracking-wider text-center">Email</th>
                      <th className="pb-3 text-xs text-slate-500 font-bold uppercase tracking-wider text-center">SMS / Push</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-4">
                        <p className="text-xs font-bold text-slate-900">Critical Incidents</p>
                        <p className="text-[11px] text-slate-500">Hardware failure, Security breaches</p>
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.criticalInApp}
                          onChange={() => toggleNotif('criticalInApp')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.criticalEmail}
                          onChange={() => toggleNotif('criticalEmail')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.criticalSMS}
                          onChange={() => toggleNotif('criticalSMS')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4">
                        <p className="text-xs font-bold text-slate-900">Performance Reports</p>
                        <p className="text-[11px] text-slate-500">Daily summaries and weekly analytics</p>
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.perfInApp}
                          onChange={() => toggleNotif('perfInApp')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.perfEmail}
                          onChange={() => toggleNotif('perfEmail')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.perfSMS}
                          onChange={() => toggleNotif('perfSMS')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4">
                        <p className="text-xs font-bold text-slate-900">System Maintenance</p>
                        <p className="text-[11px] text-slate-500">Scheduled downtime and updates</p>
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.maintInApp}
                          onChange={() => toggleNotif('maintInApp')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.maintEmail}
                          onChange={() => toggleNotif('maintEmail')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          checked={notifs.maintSMS}
                          onChange={() => toggleNotif('maintSMS')}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Audit Log Preview */}
          <section className="col-span-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Recent Administrative Actions</h3>
                <Link
                  href="/admin/audit-logs"
                  className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                >
                  View Full Audit Log
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-2 rounded-full text-[20px] flex-shrink-0 border border-blue-100">
                    settings_suggest
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Threshold Modified</p>
                    <p className="text-[11px] text-slate-600">Changed &apos;Critical Congestion&apos; from 80% to 85%</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Today, 10:45 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="material-symbols-outlined text-emerald-700 bg-emerald-50 p-2 rounded-full text-[20px] flex-shrink-0 border border-emerald-100">
                    person_add
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">New User Invited</p>
                    <p className="text-[11px] text-slate-600">Sarah Jenkins (Level 2 Technician)</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Yesterday, 4:12 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="material-symbols-outlined text-violet-700 bg-violet-50 p-2 rounded-full text-[20px] flex-shrink-0 border border-violet-100">
                    security
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Security Rule Update</p>
                    <p className="text-[11px] text-slate-600">Forced 2FA for all Administrative roles</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Oct 24, 09:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-auto px-6 py-6 border-t border-slate-200 flex justify-between items-center bg-white shrink-0">
        <span className="text-xs text-slate-500 font-medium">
          © 2024 AeroMetric Insight. Infrastructure OS v4.2.0-stable
        </span>
        <div className="flex gap-4">
          <a className="text-xs text-blue-600 hover:underline font-medium" href="#">
            Privacy Policy
          </a>
          <a className="text-xs text-blue-600 hover:underline font-medium" href="#">
            System Status
          </a>
        </div>
      </footer>
    </>
  );
}
