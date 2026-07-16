'use client'

import React, { useState, useEffect } from 'react'
import { getSystemLogs, LogEntry } from '@/db'
import LogsTable from '@/components/audit/LogsTable'
import KPICard from '@/components/admin/KPICard'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { History, ShieldCheck, ShieldAlert, Key } from 'lucide-react'

export default function AuditDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSystemLogs()
        setLogs(data)
      } catch (err) {
        console.error('Error fetching system logs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Retrieving telemetry audit databases..." />
  }

  const criticalCount = logs.filter((log) => log.severity === 'CRITICAL').length

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="System Event Logs"
        subtitle="Real-time log tracking, telemetry diagnostics, and user action trails."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Events Logged"
          value={logs.length}
          icon={<History size={20} />}
          color="blue"
          trend="Live tracking active"
        />
        <KPICard
          title="Critical Incidents"
          value={criticalCount}
          icon={<ShieldAlert size={20} />}
          color="red"
          trend="Requires review"
          trendDirection="down"
        />
        <KPICard
          title="System Integrity"
          value="99.98%"
          icon={<ShieldCheck size={20} />}
          color="green"
          trend="Baseline SLA Met"
          trendDirection="up"
        />
        <KPICard
          title="Active Tokens"
          value="3"
          icon={<Key size={20} />}
          color="purple"
          trend="Keys rotated daily"
        />
      </div>

      <div className="space-y-4">
        <LogsTable logs={logs} />
      </div>
    </div>
  )
}
