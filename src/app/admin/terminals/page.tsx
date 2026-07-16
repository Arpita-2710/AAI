'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTerminals } from '@/hooks/useTerminals'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { Building2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TerminalsPage() {
  const { data: terminalsList, isLoading, error } = useTerminals()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return <LoadingSpinner text="Retrieving terminal network registries..." />
  }

  if (error || !terminalsList) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
        Failed to load terminals.
      </div>
    )
  }

  const filteredTerminals = terminalsList.filter((term) => {
    return (
      term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const getWhiColorClass = (whi: number) => {
    if (whi >= 75) return 'text-green-600'
    if (whi >= 60) return 'text-amber-600'
    return 'text-red-600 font-bold'
  }

  return (
    <div className="space-y-6 font-sans text-sm text-slate-700">
      <PageHeader
        title="Terminals Overview"
        subtitle="Manage and view diagnostic states of Netaji Subhas Chandra Bose International Airport terminals."
        actions={
          <input
            type="text"
            placeholder="Search terminals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-60"
          />
        }
      />

      {filteredTerminals.length === 0 ? (
        <EmptyState title="No Terminals Found" description="Try adjusting your filter parameters." icon={Building2} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Terminal</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Levels</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Total Units</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Online</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Offline</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Avg WHI</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Open Incidents</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredTerminals.map((term) => {
                const total = term.total_units ?? 0
                const online = term.online_units ?? 0
                const offline = total - online
                const avgWhi = term.avg_whi ?? 0
                const openIncidents = term.open_incidents ?? 0

                return (
                  <tr key={term.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 font-mono">{term.id}</span>
                        <div>
                          <p className="font-semibold text-slate-800 leading-snug">{term.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold capitalize text-slate-600">{term.type}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono">{term.total_levels}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono text-slate-900">{total}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono text-green-600">{online}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono text-red-655">{offline}</td>
                    <td className={cn("px-6 py-4 text-center font-bold font-mono", getWhiColorClass(avgWhi))}>
                      {avgWhi}%
                    </td>
                    <td className="px-6 py-4 text-center font-bold font-mono">
                      <span className={cn(
                        "px-2 py-0.5 rounded font-bold text-xs",
                        openIncidents > 0 ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
                      )}>
                        {openIncidents}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/terminals/${term.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                      >
                        View Levels <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
