'use client'
import React, { useState } from 'react'
import { LogEntry } from '../../types'
import { cn, severityBorderClass } from '@/lib/utils'

interface Props {
  logs: LogEntry[]
}

export default function LogsTable({ logs }: Props) {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const limit = 8

  const handleExport = () => {
    alert('Audit workbook exported successfully')
  }

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.ip.toLowerCase().includes(search.toLowerCase()) ||
      log.userId.toLowerCase().includes(search.toLowerCase()) ||
      log.eventType.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())

    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const totalPages = Math.ceil(filtered.length / limit) || 1
  const paginatedLogs = filtered.slice((page - 1) * limit, page * limit)

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white border border-slate-200 p-4 rounded-xl items-center shadow-sm">
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter by IP, User, details..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all w-full sm:w-64"
          />
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value)
              setPage(1)
            }}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all w-full sm:w-auto active:scale-[0.98] shadow-sm text-sm cursor-pointer"
        >
          Export Logs
        </button>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-left">
            <tr>
              <th className="px-5 py-3 font-semibold uppercase tracking-wider w-12 min-w-[3rem] max-w-[3rem] text-center">#</th>
              <th className="px-5 py-3 font-semibold uppercase tracking-wider">Timestamp</th>
              <th className="px-5 py-3 font-semibold uppercase tracking-wider">Event Type</th>
              <th className="px-5 py-3 font-semibold uppercase tracking-wider">Operator ID</th>
              <th className="px-5 py-3 font-semibold uppercase tracking-wider">IP Address</th>
              <th className="px-5 py-3 font-semibold uppercase tracking-wider">Details Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, rowIndex) => (
                <tr
                  key={log.id}
                  className={cn(
                    "border-l-2 hover:bg-slate-50 transition-colors",
                    severityBorderClass(log.severity)
                  )}
                >
                  <td className="px-5 py-3.5 text-xs text-slate-400 tabular-nums font-mono text-center w-12 min-w-[3rem] max-w-[3rem]">
                    {(page - 1) * limit + rowIndex + 1}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">{log.eventType}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-semibold">{log.userId}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-semibold">{log.ip}</td>
                  <td className="px-5 py-3.5 text-slate-700">{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 font-bold">
                  No matching security records found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl text-xs text-slate-500 font-medium shadow-sm">
        <span>
          Page {page} of {totalPages} ({filtered.length} entries)
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-650 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold active:scale-[0.98] cursor-pointer"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-650 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold active:scale-[0.98] cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
