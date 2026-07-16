'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getIncidents, Incident } from '@/db'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { statusColor, cn } from '@/lib/utils'
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, CheckCircle2, Search, Plus } from 'lucide-react'

export default function ActiveIncidentsPage() {
  const [loading, setLoading] = useState(true)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getIncidents()
        setIncidents(data)
      } catch (err) {
        console.error('Error fetching incidents:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAcknowledge = (id: string) => {
    setIncidents(prev =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: 'IN_PROGRESS', assignedTo: 'You (Operator)' } : inc
      )
    )
  }

  const handleResolve = (id: string) => {
    setIncidents(prev =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: 'RESOLVED' } : inc
      )
    )
  }

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.terminal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner text="Retrieving operational incident databases..." />
  }

  // derive stats from local state
  const critical = incidents.filter(x => x.severity === 'CRITICAL' && x.status !== 'RESOLVED').length
  const high = incidents.filter(x => x.severity === 'HIGH' && x.status !== 'RESOLVED').length
  const other = incidents.filter(x => (x.severity === 'MEDIUM' || x.severity === 'LOW') && x.status !== 'RESOLVED').length

  return (
    <div className="space-y-6 font-sans text-sm">
      <PageHeader
        title="Incidents Monitoring"
        subtitle="Manage facility alerts, trigger overrides, and review assignment dispatch status."
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-60"
              />
            </div>
            <button
              onClick={() => alert('New incident logger opened')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all text-xs active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <Plus size={14} />
              <span>Log Incident</span>
            </button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Critical (P1)</p>
            <p className="text-3xl text-red-650 font-bold font-mono">{String(critical).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-650 shadow-sm">
            <ShieldAlert size={20} className="animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">High (P2)</p>
            <p className="text-3xl text-amber-600 font-bold font-mono">{String(high).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Minor (P3/P4)</p>
            <p className="text-3xl text-blue-600 font-bold font-mono">{String(other).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Response Goal</p>
            <p className="text-3xl text-emerald-600 font-bold font-mono">&lt; 5.0m</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Table grid */}
      <DataCard title="Live Incident Feed" subtitle="Unresolved issues across airport terminals.">
        {filteredIncidents.length === 0 ? (
          <EmptyState title="No active incidents reported" description="All terminals are reporting clear diagnostic health logs." icon={CheckCircle2} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Incident ID</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Severity</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Description &amp; Location</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Assigned Team</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className={cn(
                      "hover:bg-slate-55 transition-colors border-l-2",
                      incident.severity === 'CRITICAL' && incident.status !== 'RESOLVED' ? 'border-l-red-500 bg-red-50/20' : 'border-l-transparent'
                    )}
                  >
                    <td className="px-5 py-5 font-mono">
                      <Link href={`/admin/incidents/${incident.id}`} className="font-bold text-slate-900 hover:underline">
                        #{incident.id}
                      </Link>
                    </td>
                    <td className="px-5 py-5">
                      <span className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border", statusColor(incident.severity))}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-bold text-slate-900 leading-snug">{incident.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{incident.terminal}</p>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-[10px] font-mono shadow-sm">
                          {incident.assignedTo.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-650">
                          {incident.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border", statusColor(incident.status))}>
                        {incident.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-right">
                      {incident.status !== 'RESOLVED' && (
                        <div className="flex justify-end gap-2">
                          {incident.status === 'OPEN' && (
                            <button
                              onClick={() => handleAcknowledge(incident.id)}
                              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer"
                            >
                              Acknowledge
                            </button>
                          )}
                          <button
                            onClick={() => handleResolve(incident.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </div>
  )
}
