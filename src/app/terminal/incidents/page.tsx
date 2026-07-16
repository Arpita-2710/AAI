'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, X, AlertTriangle, Clock, CheckCircle,
  RefreshCw, Eye, ChevronDown, Filter, Search } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { severityBadgeClass, statusBadgeClass, formatTimestamp } from '@/lib/utils'
import type { Incident } from '@/types'

// ── New Incident Form Modal ───────────────────────────
function NewIncidentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (incident: Incident) => void
}) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    severity:    'MEDIUM',
    terminalId:  '',
    location:    '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Incident title is required')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/terminal/incidents', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Failed to create incident')
      }

      onSuccess(json.data)
      onClose()
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-slate-200 rounded-2xl
        shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Report New Incident
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Fill in the details to log a new incident report
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700
              hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl
              px-4 py-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-550 shrink-0" />
              <p className="text-red-650 text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Incident Title <span className="text-red-550">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Ammonia Level Critical — T1 Gents"
              className="w-full bg-white border border-slate-300 rounded-xl
                px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:border-blue-500
                focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Provide additional details about the incident..."
              rows={3}
              className="w-full bg-white border border-slate-300 rounded-xl
                px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:border-blue-500
                focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* Severity + Terminal row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Severity <span className="text-red-550">*</span>
              </label>
              <select
                value={form.severity}
                onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl
                  px-4 py-2.5 text-sm text-slate-900
                  focus:outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="CRITICAL">🔴 Critical</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Terminal
              </label>
              <select
                value={form.terminalId}
                onChange={e => setForm(p => ({ ...p, terminalId: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl
                  px-4 py-2.5 text-sm text-slate-900
                  focus:outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="">Select terminal</option>
                <option value="T1">Terminal 1 — Domestic Arrivals</option>
                <option value="T2">Terminal 2 — Domestic Departures</option>
                <option value="T3">Terminal 3 — International</option>
                <option value="T4">Concourse A</option>
                <option value="T5">Concourse B</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Specific Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Gate 5 Gents Washroom, Stall B3"
              className="w-full bg-white border border-slate-300 rounded-xl
                px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:border-blue-500
                focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-slate-300
                hover:border-slate-400 text-slate-700 font-medium
                py-2.5 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                text-white font-semibold py-2.5 rounded-xl transition-colors
                text-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Create Incident
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Incident Detail Modal ──────────────────────────────
function IncidentDetailModal({
  incident,
  onClose,
  onAcknowledge,
}: {
  incident: Incident
  onClose: () => void
  onAcknowledge: (id: string) => void
}) {
  const [acknowledging, setAcknowledging] = useState(false)

  async function handleAcknowledge() {
    setAcknowledging(true)
    try {
      const res = await fetch(`/api/terminal/incidents/${incident.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: 'IN_PROGRESS' }),
      })
      if (res.ok) {
        onAcknowledge(incident.id)
        onClose()
      }
    } finally {
      setAcknowledging(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white border border-slate-200 rounded-2xl
        shadow-2xl w-full max-w-lg">

        <div className="flex items-center justify-between px-6 py-4
          border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              Incident Details
            </h2>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg
              text-xs font-medium whitespace-nowrap border
              ${severityBadgeClass(incident.severity)}`}>
              {incident.severity}
            </span>
          </div>
          <button onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700
              hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase
              tracking-wider mb-1">Incident ID</p>
            <p className="font-mono text-sm text-slate-700">{incident.id}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase
              tracking-wider mb-1">Title</p>
            <p className="text-sm font-semibold text-slate-900">
              {incident.title}
            </p>
          </div>

          {incident.description && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase
                tracking-wider mb-1">Description</p>
              <p className="text-sm text-slate-700">{incident.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase
                tracking-wider mb-1">Status</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg
                text-xs font-medium whitespace-nowrap border
                ${statusBadgeClass(incident.status)}`}>
                {incident.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase
                tracking-wider mb-1">Terminal</p>
              <p className="text-sm text-slate-700">
                {(incident as any).terminalId ?? (incident as any).terminal_id ?? incident.terminal ?? '—'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase
              tracking-wider mb-1">Reported At</p>
            <p className="font-mono text-sm text-slate-500">
              {formatTimestamp((incident as any).createdAt ?? (incident as any).created_at ?? incident.timestamp ?? '')}
            </p>
          </div>

          {incident.assignedTo && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase
                tracking-wider mb-1">Assigned To</p>
              <p className="text-sm text-slate-700">{incident.assignedTo}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 bg-white border border-slate-300
              hover:bg-slate-50 text-slate-700 font-medium
              py-2.5 rounded-xl transition-colors text-sm">
            Close
          </button>
          {incident.status === 'OPEN' && (
            <button
              onClick={handleAcknowledge}
              disabled={acknowledging}
              className="flex-1 bg-blue-600 hover:bg-blue-700
                disabled:opacity-60 text-white font-semibold
                py-2.5 rounded-xl transition-colors text-sm
                flex items-center justify-center gap-2"
            >
              {acknowledging ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <CheckCircle size={15} />
              )}
              Acknowledge & Start
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────
export default function TerminalIncidentsPage() {
  const [incidents, setIncidents]         = useState<Incident[]>([])
  const [loading, setLoading]             = useState(true)
  const [showNewModal, setShowNewModal]   = useState(false)
  const [selectedIncident, setSelected]  = useState<Incident | null>(null)
  const [filterSeverity, setFilterSev]   = useState('ALL')
  const [filterStatus, setFilterStatus]  = useState('ALL')
  const [search, setSearch]              = useState('')

  const fetchIncidents = useCallback(async () => {
    try {
      const res  = await fetch('/api/terminal/incidents')
      const json = await res.json()
      if (json.success) setIncidents(json.data)
    } catch (err) {
      console.error('Failed to fetch incidents', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIncidents()
    // Poll every 30 seconds for new incidents
    const interval = setInterval(fetchIncidents, 30000)
    return () => clearInterval(interval)
  }, [fetchIncidents])

  function handleNewIncident(incident: Incident) {
    setIncidents(prev => [incident, ...prev])
  }

  function handleAcknowledge(id: string) {
    setIncidents(prev =>
      prev.map(i => i.id === id ? { ...i, status: 'IN_PROGRESS' as any } : i)
    )
  }

  // Filter
  const filtered = incidents.filter(i => {
    if (filterSeverity !== 'ALL' && i.severity !== filterSeverity) return false
    if (filterStatus   !== 'ALL' && i.status   !== filterStatus)   return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Stats
  const openCount     = incidents.filter(i => i.status === 'OPEN').length
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length
  const inProgressCount = incidents.filter(i => i.status === 'IN_PROGRESS').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Queue"
        subtitle={`${openCount} open · ${criticalCount} critical · ${inProgressCount} in progress`}
        actions={
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
              text-white font-semibold px-5 py-2.5 rounded-xl
              transition-colors shadow-sm text-sm border-none cursor-pointer"
          >
            <Plus size={16} />
            New Report
          </button>
        }
      />

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3
        shadow-sm flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
            text-slate-400" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg
              pl-9 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400
              focus:outline-none focus:border-blue-400
              focus:ring-2 focus:ring-blue-50"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={e => setFilterSev(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2
            text-sm text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2
            text-sm text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <button
          onClick={fetchIncidents}
          className="flex items-center gap-1.5 text-slate-500
            hover:text-slate-700 text-sm px-3 py-2 rounded-lg
            hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Incidents list */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <RefreshCw size={24} className="animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl
          shadow-sm flex flex-col items-center justify-center h-48 gap-3">
          <CheckCircle size={36} className="text-slate-300" />
          <p className="text-slate-500 font-medium">No incidents found</p>
          <p className="text-slate-400 text-sm">
            {search ? 'Try different search terms' : 'All clear — no active incidents'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(incident => (
            <div
              key={incident.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm
                hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-400">
                      {incident.id}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1
                      rounded-lg text-xs font-medium whitespace-nowrap border
                      ${severityBadgeClass(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1
                      rounded-lg text-xs font-medium whitespace-nowrap border
                      ${statusBadgeClass(incident.status)}`}>
                      {incident.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm truncate">
                    {incident.title}
                  </h3>
                  {incident.description && (
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                      {incident.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs
                    text-slate-400">
                    {((incident as any).terminalId || (incident as any).terminal_id || incident.terminal) && (
                      <span>Terminal: {(incident as any).terminalId ?? (incident as any).terminal_id ?? incident.terminal}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {formatTimestamp((incident as any).createdAt ?? (incident as any).created_at ?? incident.timestamp ?? '')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(incident)}
                  className="flex items-center gap-1.5 text-blue-600
                    hover:text-blue-750 bg-blue-50 hover:bg-blue-100
                    border border-blue-200 px-3 py-1.5 rounded-lg
                    text-xs font-medium transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  <Eye size={13} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showNewModal && (
        <NewIncidentModal
          onClose={() => setShowNewModal(false)}
          onSuccess={handleNewIncident}
        />
      )}

      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelected(null)}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </div>
  )
}
