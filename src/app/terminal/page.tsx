'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getWashrooms,
  getIncidents,
  getDevices,
  getLiveWHI,
  Washroom,
  Incident,
  Device
} from '@/db'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { statusColor } from '@/lib/utils'
import { Bath, AlertTriangle, Cpu, TrendingDown, CheckCircle2, ArrowRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TerminalDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [washrooms, setWashrooms] = useState<Washroom[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [liveScore, setLiveScore] = useState<number>(82)

  useEffect(() => {
    async function loadData() {
      try {
        const [w, i, d, l] = await Promise.all([
          getWashrooms(),
          getIncidents(),
          getDevices(),
          getLiveWHI()
        ])
        setWashrooms(w)
        setIncidents(i)
        setDevices(d)
        setLiveScore(l.score)
      } catch (err) {
        console.error('Error loading terminal dashboard telemetry:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Connecting to on-site terminal telemetry..." />
  }

  const activeIncidents = incidents.filter(inc => inc.status !== 'RESOLVED')
  const onlineDevices = devices.filter(dev => dev.status === 'ONLINE')

  return (
    <div className="space-y-6 font-sans text-sm">
      <PageHeader
        title="Terminal Operator Control"
        subtitle="Live terminal metrics, smart washroom tracking, and operator overrides."
      />

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => router.push('/terminal/washrooms')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-32 hover:shadow-md hover:border-slate-300 hover:scale-[1.02] cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Washrooms</span>
            <Bath className="text-blue-600" size={18} />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{washrooms.length}</div>
          <div className="text-[10px] text-green-650 flex items-center gap-1 font-bold">
            <CheckCircle2 size={12} />
            <span>All nodes operational</span>
          </div>
        </div>

        <div
          onClick={() => router.push('/terminal/incidents')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-32 hover:shadow-md hover:border-slate-300 hover:scale-[1.02] cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Incidents</span>
            <AlertTriangle className="text-amber-650" size={18} />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{activeIncidents.length}</div>
          <div className="text-[10px] text-amber-650 flex items-center gap-1 font-bold">
            <AlertTriangle size={12} className="animate-pulse" />
            <span>Action Required</span>
          </div>
        </div>

        <div
          onClick={() => router.push('/terminal/device-status')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-32 hover:shadow-md hover:border-slate-300 hover:scale-[1.02] cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Online Devices</span>
            <Cpu className="text-emerald-600" size={18} />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{onlineDevices.length}</div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>98.5% network uptime</span>
          </div>
        </div>

        <div
          onClick={() => router.push('/terminal/live-whi')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-32 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all shadow-sm border-l-4 border-l-red-500 bg-red-50/15"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-650 uppercase tracking-wider">Hygiene Index</span>
            <TrendingDown className="text-red-600" size={18} />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{liveScore}%</div>
          <div className="text-[10px] text-red-655 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Below standard threshold</span>
          </div>
        </div>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Preview */}
        <div className="lg:col-span-8">
          <DataCard
            title="Interactive Zone Map"
            subtitle="Concourse live view heatmap highlighting foot traffic."
            actions={
              <Link href="/terminal/floor-heatmap" className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center gap-1">
                View Full Map <ArrowRight size={14} />
              </Link>
            }
          >
            <div className="relative h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                alt="Terminal Heatmap"
                className="w-full h-full object-cover opacity-40 grayscale select-none pointer-events-none"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoRPynPA7-uwaznrB91MN2H3_Z8Vk89xf3FiiWbH_4x0wBa5lBSvGdQ1BlC_HG83KT7ikt3--JoolykLR-ftftawO9lwDBJGRyB22I_RyyOa5CXLZT-B41rdVZPu-MHByaUaRxY88q7TGmE_a30hifVac8fWs8e0ZD5-Cinr4EaVPPjVtC5KsC9uOJSv4UX8iWqGLdpsnfZbLtkCIVmizTIRZjPQeA4kPIRMFm-qVvXfsy-3T_S8PcnxlgFwc25UIOpCvtRrsqzfU"
              />

              {/* Dynamic hotspot indicators */}
              {washrooms.slice(0, 5).map((w, index) => {
                const positions = [
                  { top: '25%', left: '20%' },
                  { top: '38%', left: '52%' },
                  { top: '68%', left: '28%' },
                  { top: '48%', left: '72%' },
                  { top: '78%', left: '60%' }
                ]
                const pos = positions[index % positions.length]
                const isCritical = w.whi < 60
                const isFair = w.whi >= 60 && w.whi < 75

                return (
                  <div
                    key={w.id}
                    onClick={() => router.push(`/terminal/washrooms`)}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute p-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-900 rounded-xl shadow-md flex flex-col gap-0.5 cursor-pointer hover:scale-105 active:scale-95 transition-all font-sans select-none hover:border-slate-350 z-10"
                  >
                    <span className="text-[10px] font-extrabold text-slate-800 tracking-tight">{w.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        isCritical ? 'bg-red-500' : isFair ? 'bg-amber-500' : 'bg-green-500'
                      )} />
                      <span className={cn(
                        "text-[9px] font-bold uppercase",
                        isCritical ? 'text-red-655' : isFair ? 'text-amber-600' : 'text-green-650'
                      )}>
                        WHI: {w.whi}% ({isCritical ? 'CRITICAL' : isFair ? 'WARNING' : 'GOOD'})
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </DataCard>
        </div>

        {/* Live WHI Feed */}
        <div className="lg:col-span-4">
          <DataCard
            title="Live WHI Feed"
            subtitle="Recent hygiene evaluations across active facilities."
            actions={
              <Link href="/terminal/live-whi" className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center gap-1">
                Details <ArrowRight size={14} />
              </Link>
            }
          >
            <div className="space-y-4 overflow-y-auto max-h-80 custom-scrollbar pr-1">
              {washrooms.slice(0, 4).map((w) => (
                <div
                  key={w.id}
                  className={cn(
                    "p-4 rounded-xl bg-slate-50 border-l-4 transition-colors hover:bg-slate-100 border border-slate-200",
                    w.whi < 60 ? 'border-l-red-500 border-red-200' : w.whi < 75 ? 'border-l-yellow-500 border-yellow-250' : 'border-l-green-500 border-green-200'
                  )}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{w.name}</span>
                    <span className={cn(
                      "text-xs font-mono font-bold",
                      w.whi < 60 ? 'text-red-650' : w.whi < 75 ? 'text-amber-600' : 'text-green-600'
                    )}>WHI {w.whi}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Status: <span className="font-semibold text-slate-700">{w.status}</span> • Occupancy: <span className="font-semibold text-slate-700">{w.occupancy}%</span>
                  </p>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Active Incidents Table */}
        <div className="col-span-12">
          <DataCard
            title="Active Incidents Queue"
            subtitle="Alerts logged on on-site hardware network."
            actions={
              <button
                onClick={() => router.push('/terminal/incidents')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all text-xs active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <Plus size={14} /> New Incident
              </button>
            }
          >
            {activeIncidents.length === 0 ? (
              <EmptyState title="No active alerts logged" description="All terminals are reporting stable status." icon={CheckCircle2} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Incident ID</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Task Title</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Assigned Staff</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {activeIncidents.slice(0, 5).map((incident) => (
                      <tr
                        key={incident.id}
                        onClick={() => router.push('/terminal/incidents')}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">#{incident.id}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border", statusColor(incident.severity))}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">{incident.terminal}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{incident.title}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{incident.assignedTo}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-blue-600 group-hover:translate-x-1 transition-all inline-block">&rarr;</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DataCard>
        </div>
      </div>
    </div>
  )
}
