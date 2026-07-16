'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTerminalStore, useLevelStore } from '@/lib/store'
import { useLevelWashrooms } from '@/hooks/useTerminals'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import TerminalSelector from '@/components/shell/TerminalSelector'
import LevelNavigator from '@/components/terminal/LevelNavigator'
import { statusColor, severityColor } from '@/lib/utils'
import { Bath, Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Washrooms() {
  const router = useRouter()
  const { selectedTerminal } = useTerminalStore()
  const { selectedLevel } = useLevelStore()
  const { data: washrooms, isLoading, error } = useLevelWashrooms(selectedTerminal, selectedLevel)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  if (isLoading) {
    return <LoadingSpinner text="Querying terminal washroom nodes..." />
  }

  if (error || !washrooms) {
    return (
      <div className="text-sm text-red-655 bg-red-50 border border-red-200 rounded-xl p-4 font-sans">
        Failed to load washroom nodes for Terminal {selectedTerminal} Level {selectedLevel}.
      </div>
    )
  }

  const handleRowClick = (deviceId: string) => {
    router.push(`/terminal/washrooms/total-detail?device_id=${deviceId}`)
  }

  const filteredWashrooms = washrooms.filter((w) => {
    const matchesSearch =
      w.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.label.toLowerCase().includes(searchTerm.toLowerCase())

    const stateStatus = w.state?.occupancy_status || 'OUT_OF_ORDER'
    const matchesStatus = statusFilter === 'ALL' || stateStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // stats
  const total = washrooms.length
  const validStates = washrooms.filter(w => w.state)
  const avgWhi = validStates.length > 0 
    ? Math.round(validStates.reduce((acc, curr) => acc + (curr.state?.whi_score ?? 0), 0) / validStates.length) 
    : 85
  const critical = washrooms.filter(w => w.state && w.state.whi_score < 60).length
  const cleaning = washrooms.filter(w => w.state && w.state.occupancy_status === 'CLEANING').length

  return (
    <div className="space-y-6 font-sans text-sm text-slate-700">
      <PageHeader
        title="Washrooms Inventory"
        subtitle="Operational washroom unit directories, hygiene evaluations, and scheduled clean cycles."
      />

      {/* Selector and Navigator */}
      <div className="flex flex-col gap-4">
        <TerminalSelector />
        <LevelNavigator />
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Units</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-slate-900 font-bold font-mono">{String(total).padStart(2, '0')}</h3>
            <span className="text-xs text-slate-550 font-medium">Active Nodes</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Average WHI</p>
          <div className="flex items-end justify-between">
            <h3 className={cn(
              "text-3xl font-bold font-mono",
              avgWhi < 60 ? 'text-red-655' : avgWhi < 75 ? 'text-amber-600' : 'text-green-600'
            )}>{avgWhi}%</h3>
            <span className="text-xs text-slate-550 font-medium">Level Average</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Critical Units</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-red-655 font-bold font-mono">{String(critical).padStart(2, '0')}</h3>
            <span className="text-xs text-red-650 font-bold uppercase tracking-wider animate-pulse">Action Alert</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">In Cleaning</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-blue-600 font-bold font-mono">{String(cleaning).padStart(2, '0')}</h3>
            <span className="text-xs text-slate-550 font-medium">Active Shifts</span>
          </div>
        </div>
      </div>

      {/* Management Table Container */}
      <DataCard
        title="Active Facilities Management"
        subtitle={`Operator overview across cluster ${selectedTerminal} - Level ${selectedLevel}.`}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search unit by ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-350 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 w-60 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-350 rounded-xl px-3 py-2 text-xs text-slate-805 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="VACANT">Vacant</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="CLEANING">Cleaning</option>
              <option value="OUT_OF_ORDER">Out of Order</option>
            </select>
            <button
              onClick={() => router.push('/terminal/incidents')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Plus size={14} /> New Incident
            </button>
          </div>
        }
      >
        {filteredWashrooms.length === 0 ? (
          <EmptyState title="No Washrooms Match Filters" description="Adjust filters or check telemetry connectivity." icon={Bath} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Label</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">WHI Score</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Last Cleaned</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredWashrooms.map((w) => {
                  const whi = w.state?.whi_score ?? 100
                  const status = w.state?.occupancy_status ?? 'OUT_OF_ORDER'
                  
                  const healthColorClass =
                    whi < 60 ? 'text-red-655' : whi < 75 ? 'text-amber-600' : 'text-green-600'

                  const healthBarClass =
                    whi < 60 ? 'bg-red-500' : whi < 75 ? 'bg-amber-500' : 'bg-green-500'

                  const lastCleanedDate = w.state?.last_cleaned_at 
                    ? new Date(w.state.last_cleaned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : 'Not yet'

                  return (
                    <tr
                      key={w.id}
                      onClick={() => handleRowClick(w.device_id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{w.label}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{w.device_id}</td>
                      <td className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">{w.unit_type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className={cn("h-full", healthBarClass)} style={{ width: `${whi}%` }} />
                          </div>
                          <span className={cn("text-xs font-bold font-mono", healthColorClass)}>{whi}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-550 font-mono">{lastCleanedDate}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border", statusColor(status))}>
                          {status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-blue-600 group-hover:translate-x-1 transition-all inline-block font-extrabold">&rarr;</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </div>
  )
}
