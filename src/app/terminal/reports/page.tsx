'use client'
import { useState, useEffect, useCallback } from 'react'
import { FileBarChart, Plus, Download, RefreshCw,
  Clock, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { formatTimestamp } from '@/lib/utils'

export default function ReportsPage() {
  const [reports,     setReports]     = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [generating,  setGenerating]  = useState(false)
  const [reportType,  setReportType]  = useState('FACILITY')
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      const res  = await fetch('/api/terminal/reports')
      const json = await res.json()
      if (json.success) setReports(json.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  async function generateReport() {
    setGenerating(true)
    setSuccessMsg(null)
    try {
      const res  = await fetch('/api/terminal/reports', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: reportType }),
      })
      const json = await res.json()
      if (json.success) {
        setReports(prev => [json.data, ...prev])
        setSuccessMsg(`Report "${json.data.title}" generated successfully`)
        setTimeout(() => setSuccessMsg(null), 4000)
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and view facility reports"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-4
                py-2.5 text-sm text-slate-700 focus:outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="FACILITY">Facility Report</option>
              <option value="INCIDENT">Incident Summary</option>
              <option value="DEVICE">Device Health Report</option>
              <option value="WHI">WHI Analysis Report</option>
            </select>
            <button
              onClick={generateReport}
              disabled={generating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                disabled:opacity-60 text-white font-semibold px-5 py-2.5
                rounded-xl transition-colors shadow-sm text-sm border-none cursor-pointer"
            >
              {generating
                ? <RefreshCw size={15} className="animate-spin" />
                : <Plus size={15} />
              }
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        }
      />

      {/* Success message */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-xl
          px-4 py-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500 shrink-0" />
          <p className="text-green-700 text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {/* Recent Report History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4
          border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900">
              Recent Report History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {reports.length} report{reports.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          <button
            onClick={fetchReports}
            className="text-slate-400 hover:text-slate-700 p-2
              hover:bg-slate-100 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw size={20} className="animate-spin text-slate-400" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <FileBarChart size={32} className="text-slate-300" />
            <p className="text-slate-500 text-sm">No reports yet</p>
            <p className="text-slate-400 text-xs">
              Generate your first report using the button above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map(report => (
              <div key={report.id}
                className="flex items-center justify-between px-6 py-4
                  hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 bg-blue-50 border border-blue-100
                    rounded-xl flex items-center justify-center shrink-0">
                    <FileBarChart size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {report.title}
                    </p>
                    {report.summary && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {report.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="bg-blue-50 text-blue-600 border
                        border-blue-200 px-2 py-0.5 rounded text-xs font-medium">
                        {report.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs
                        text-slate-400 font-mono">
                        <Clock size={10} />
                        {formatTimestamp(report.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Download: ${report.title}\n\n${report.summary ?? ''}`)}
                  className="flex items-center gap-1.5 text-slate-500
                    hover:text-slate-900 bg-white hover:bg-slate-100
                    border border-slate-200 px-3 py-1.5 rounded-lg
                    text-xs font-medium transition-colors shrink-0 ml-4 cursor-pointer shadow-sm"
                >
                  <Download size={12} />
                  Export
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
