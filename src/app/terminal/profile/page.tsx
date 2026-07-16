'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ActivityLog {
  id: string;
  type: 'system' | 'security' | 'alert';
  action: string;
  timestamp: string;
  details: string;
  icon: string;
}

export default function ProfilePage() {
  const router = useRouter();

  // Form states
  const [firstName, setFirstName] = useState('Rajesh');
  const [lastName, setLastName] = useState('Kumar');
  const [department, setDepartment] = useState('Terminal Operations');
  const [bio, setBio] = useState(
    'Overseeing Terminal 3 operations with 15+ years of experience in high-density transportation hubs. Focused on optimizing passenger flow and maintaining critical safety infrastructure.'
  );

  // Focus ref for first name
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Mock activity logs
  const [activities] = useState<ActivityLog[]>([
    {
      id: 'L-101',
      type: 'system',
      action: 'Successful login from Terminal Control Station 4',
      timestamp: 'Today, 08:14 AM',
      details: 'IP: 10.22.45.109',
      icon: 'login',
    },
    {
      id: 'L-102',
      type: 'security',
      action: 'Password successfully changed',
      timestamp: 'Oct 14, 2024',
      details: '04:30 PM',
      icon: 'security_update_good',
    },
    {
      id: 'L-103',
      type: 'alert',
      action: 'Failed login attempt (Incorrect MFA)',
      timestamp: 'Oct 12, 2024',
      details: '11:55 PM • IP: 192.168.1.1',
      icon: 'dangerous',
    },
  ]);

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showToastMessage('First name and Last name are required.', 'error');
      return;
    }
    showToastMessage('Personal details successfully updated.');
  };

  const handleExportProfile = () => {
    const profileData = {
      firstName,
      lastName,
      employeeId: 'EMP-T3-2024-4492',
      department,
      bio,
      notificationPrefs: { emailAlerts, smsAlerts, pushAlerts },
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(profileData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `profile_${firstName.toLowerCase()}_${lastName.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToastMessage('Profile exported successfully.');
  };

  const handleEditPersonalInfo = () => {
    firstNameInputRef.current?.focus();
    firstNameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToastMessage('Editing personal details mode active.', 'success');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToastMessage('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToastMessage('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToastMessage('New password and confirmation do not match.', 'error');
      return;
    }

    showToastMessage('Password updated successfully.');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in font-sans text-sm">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border text-xs font-bold transition-all transform translate-y-0 scale-100 ${
            toast.type === 'success'
              ? 'bg-white text-blue-600 border-blue-200'
              : 'bg-white text-red-700 border-red-200'
          }`}
        >
          <span className="material-symbols-outlined">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
        <div className="relative group">
          <img
            alt="Rajesh Kumar Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPAWJ-6FW9SkApwo11t3FtK_ObnU6M_MYuUkfvvbDHRptn3-iB9xhsJOax03zWOdz2VInr5FEcagzThYnMGy305Zbid_qv8rBZrhZ0K63tfYNdMaN0ZEqZWVV1TDuRMyKxe2h_3LSgf5IcCYwP1MK06KmMIZF3D-jaiIv2dhjVch7KU8jcx6s6OPG6KJLBpfcGw0NurElZ3sLf2AnUO4x1JO0KuawekQr_qQsOZNfRaxCVidmtAbNyqaGGmemCOmm9t4PhvGvWfxo"
          />
          <button
            onClick={handleEditPersonalInfo}
            className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-none cursor-pointer"
            title="Edit Photo"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <div>
            <h2 className="text-xl text-slate-900 font-bold">{firstName} {lastName}</h2>
            <p className="text-xs text-blue-600 font-bold">Senior Terminal Manager</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-[20px]">mail</span>
              <span>rajesh.k@skyhub.aero</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span>Terminal 3, Level 4, Office 402</span>
            </div>
          </div>
          <div className="pt-4 flex gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-slate-105 border border-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
              Operations Lead
            </span>
            <span className="px-3 py-1 bg-slate-105 border border-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
              Level 5 Security
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={handleExportProfile}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer text-center border-none"
          >
            Export Profile
          </button>
          <button
            onClick={handleEditPersonalInfo}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-750 rounded-xl text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer text-center bg-white"
          >
            Edit Personal Info
          </button>
        </div>
      </section>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Personal Details Form (Left - 8 Columns) */}
        <section className="md:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
          </div>
          <form onSubmit={handleSaveChanges} className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1 transition-transform duration-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    First Name
                  </label>
                  <input
                    ref={firstNameInputRef}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1 transition-transform duration-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Last Name
                  </label>
                  <input
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Employee ID
                  </label>
                  <input
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-450 cursor-not-allowed outline-none"
                    disabled
                    type="text"
                    value="EMP-T3-2024-4492"
                  />
                </div>
                <div className="space-y-1 transition-transform duration-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Department
                  </label>
                  <input
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1 transition-transform duration-200 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bio / Professional Summary
                </label>
                <textarea
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-slate-800"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer border-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Security & Notifications (Right - 4 Columns) */}
        <div className="md:col-span-4 space-y-6 flex flex-col">
          {/* Notification Preferences */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            </div>
            <div className="p-6 space-y-4 text-xs font-bold">
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 transition-colors duration-205 ${
                    emailAlerts ? 'text-blue-600' : 'text-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>Email Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={emailAlerts}
                    onChange={(e) => {
                      setEmailAlerts(e.target.checked);
                      showToastMessage(
                        `Email Alerts ${e.target.checked ? 'enabled' : 'disabled'}.`
                      );
                    }}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 transition-colors duration-205 ${
                    smsAlerts ? 'text-blue-600' : 'text-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">sms</span>
                  <span>SMS Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={smsAlerts}
                    onChange={(e) => {
                      setSmsAlerts(e.target.checked);
                      showToastMessage(
                        `SMS Notifications ${e.target.checked ? 'enabled' : 'disabled'}.`
                      );
                    }}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 transition-colors duration-205 ${
                    pushAlerts ? 'text-blue-600' : 'text-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  <span>App Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={pushAlerts}
                    onChange={(e) => {
                      setPushAlerts(e.target.checked);
                      showToastMessage(
                        `Push Notifications ${e.target.checked ? 'enabled' : 'disabled'}.`
                      );
                    }}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-grow">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Security</h3>
            </div>
            <div className="p-6 space-y-4 text-xs font-bold">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer text-left text-slate-700 border-none bg-transparent"
              >
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-sm">
                    lock
                  </span>
                  <span>Change Password</span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  chevron_right
                </span>
              </button>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start gap-2">
                <span
                  className="material-symbols-outlined text-blue-600 text-[20px] mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <div>
                  <p className="text-xs text-slate-800 font-bold">Two-Factor Auth</p>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Currently active via Authenticator App
                  </p>
                  <button
                    onClick={() => showToastMessage('Redirecting to 2FA settings...')}
                    className="mt-2 text-[10px] font-bold text-blue-650 hover:underline cursor-pointer block border-none bg-transparent"
                  >
                    Manage 2FA Settings
                  </button>
                </div>
              </div>

              <button
                onClick={() => showToastMessage('Logging out of other devices...')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-red-50 transition-colors group cursor-pointer text-left text-red-650 hover:text-red-750 border-none bg-transparent font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Log out of all devices</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Audit Trail / Recent Activity */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-900">Recent Account Activity</h3>
          <button
            onClick={() => router.push('/terminal/audit-log')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer border-none bg-transparent"
          >
            View Full Audit Log
          </button>
        </div>
        <div className="space-y-3 text-xs">
          {activities.map((act) => {
            let containerBg = 'bg-blue-50 text-blue-600';
            let tagBg = 'bg-slate-100 text-slate-600 border border-slate-200';
            let tagText = 'System';

            if (act.type === 'security') {
              containerBg = 'bg-amber-50 text-amber-600';
              tagText = 'Security';
            } else if (act.type === 'alert') {
              containerBg = 'bg-red-50 text-red-650';
              tagBg = 'bg-red-50 text-red-700 border border-red-200';
              tagText = 'Alert';
            }

            return (
              <div
                key={act.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl border border-transparent hover:border-slate-200"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${containerBg}`}>
                  <span className="material-symbols-outlined">{act.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{act.action}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    {act.timestamp} • {act.details}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${tagBg}`}>
                  {tagText}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-250 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="material-symbols-outlined text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent"
              >
                close
              </button>
            </div>
            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Current Password
                </label>
                <input
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  New Password
                </label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-705 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
