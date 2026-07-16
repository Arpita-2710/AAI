'use client'

import React from 'react'
import Link from 'next/link'
import { useDashboardSummary } from '@/hooks/useDashboard'
import { useIncidents } from '@/hooks/useIncidents'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import KPICard from '@/components/admin/KPICard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { IncidentsOverviewLineChart, WashroomHealthDonutChart } from '@/components/admin/Charts'
import { Building2, AlertTriangle, Cpu, ArrowRight, ShieldAlert } from 'lucide-react'
import { severityBadgeClass } from '@/lib/utils'

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useDashboardSummary()
  const { data: incidentsResponse, isLoading: incidentsLoading, error: incidentsError } = useIncidents({ limit: 5 })

  if (summaryLoading || incidentsLoading) {
    return <LoadingSpinner text="Retrieving admin diagnostics..." />
  }

  if (summaryError || incidentsError || !summary) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
        Failed to load dashboard metrics.
      </div>
    )
  }

  const incidents = incidentsResponse?.data || []

  const healthData = [
    { name: 'Vacant', value: summary.units_by_status.VACANT ?? 0, color: '#22C55E' },
    { name: 'Occupied', value: summary.units_by_status.OCCUPIED ?? 0, color: '#EF4444' },
    { name: 'Cleaning', value: summary.units_by_status.CLEANING ?? 0, color: '#EAB308' },
    { name: 'Out of Order', value: summary.units_by_status.OUT_OF_ORDER ?? 0, color: '#64748B' }
  ]

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Global status monitoring, active incident queue, and telemetry analysis."
      />

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Link href="/admin/terminals">
          <KPICard
            title="Total Terminals"
            value={3}
            icon={<Building2 size={20} />}
            color="blue"
            trend="Active Facility Groups"
            trendDirection="up"
          />
        </Link>
        <Link href="/admin/incidents">
          <KPICard
            title="Active Incidents"
            value={summary.open_incidents}
            icon={<AlertTriangle size={20} />}
            color="yellow"
            trend="Priority Queued"
            trendDirection="down"
          />
        </Link>
        <Link href="/admin/critical-alerts">
          <KPICard
            title="Critical Alerts"
            value={summary.critical_incidents}
            icon={<ShieldAlert size={20} />}
            color="red"
            trend="Immediate Action"
            trendDirection="down"
            linkText="View all &rarr;"
          />
        </Link>
        <Link href="/admin/devices">
          <KPICard
            title="Online Sensors"
            value={`${summary.online_units}/${summary.total_units}`}
            icon={<Cpu size={20} />}
            color="green"
            trend="Active Telemetry Nodes"
            trendDirection="up"
          />
        </Link>
      </div>

      {/* Main Grid: Charts */}
      <div className="grid grid-cols-12 gap-6">
        {/* Line Chart: Incidents Overview */}
        <div className="col-span-12 lg:col-span-7">
          <DataCard
            title="Incidents Overview (This Week)"
            subtitle="Weekly aggregate rate of reports logged."
          >
            <IncidentsOverviewLineChart />
            <div className="flex gap-4 mt-6 justify-center">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Critical
              </div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> Urgent
              </div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span> Medium
              </div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span> Low
              </div>
            </div>
          </DataCard>
        </div>

        {/* Donut Chart: Health Overview */}
        <div className="col-span-12 lg:col-span-5">
          <DataCard
            title="Washroom Health Overview"
            subtitle="Current rating breakdown of active facility nodes."
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <WashroomHealthDonutChart />
              <div className="space-y-3 w-full sm:w-auto shrink-0 font-sans">
                {healthData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center gap-6 group text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 font-mono">{item.value} Units</span>
                  </div>
                ))}
              </div>
            </div>
          </DataCard>
        </div>

        {/* Recent Incidents Table */}
        <div className="col-span-12">
          <DataCard
            title="Recent Incidents"
            subtitle="Latest system alerts logged on our networks."
            actions={
              <Link href="/admin/incidents" className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            }
          >
            {incidents.length === 0 ? (
              <EmptyState title="No Incidents Found" description="System is reporting clear diagnostic readings." icon={AlertTriangle} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Incident Ref</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Terminal</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Assigned Tech</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {incidents.map((incident) => (
                      <tr key={incident.id} className="hover:bg-slate-55 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 font-mono">#{incident.incident_ref}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-800">{incident.terminal_id}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase border ${severityBadgeClass(incident.severity)}`}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">{incident.assigned_to || 'Unassigned'}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">{new Date(incident.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/incidents/${incident.id}`}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 transition-colors text-blue-650"
                          >
                            <ArrowRight size={14} />
                          </Link>
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
