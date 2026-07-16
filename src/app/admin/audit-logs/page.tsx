'use client'

import React, { useState, useEffect } from 'react'
import { getAuditLogs } from '@/db'
import { AuditLog } from '@/types'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { statusColor } from '@/lib/utils'
import { ShieldCheck, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAuditLogs()
        setLogs(data)
      } catch (err) {
        console.error('Error fetching audit logs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search)

    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  if (loading) {
    return <LoadingSpinner text="Retrieving operational audit registers..." />
  }

  return (
    <div className="space-y-6 font-sans text-sm">
      <PageHeader
        title="System Audit Logs"
        subtitle="Chronological register of security actions, metadata shifts, and system states."
      />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white border border-slate-200 p-4 rounded-xl items-center shadow-sm">
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all w-full"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <DataCard title="Audit Trail Registries" subtitle="System records tracking administrator decisions and device configurations.">
        {filteredLogs.length === 0 ? (
          <EmptyState title="No Records Found" description="Try adjusting your query filter parameters." icon={ShieldCheck} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Timestamp</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">User Entity</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Action Type</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">IP Address</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Details</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">{log.user || log.userId}</td>
                    <td className="px-5 py-3.5 text-blue-600 font-semibold whitespace-nowrap">{log.action}</td>
                    <td className="px-5 py-3.5 text-slate-550 whitespace-nowrap">{log.ip}</td>
                    <td className="px-5 py-3.5 text-slate-650">{log.details}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border", statusColor(log.severity))}>
                        {log.severity}
                      </span>
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
