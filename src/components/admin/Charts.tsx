'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-3 py-2 text-sm text-slate-900 font-sans">
      {label && <p className="text-slate-500 text-xs mb-1 font-semibold">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.payload?.color || '#2563EB' }} className="font-semibold text-xs flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color || p.payload?.color || '#2563EB' }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// 1. Incidents Overview Line Chart (Dashboard)
const weeklyIncidentsData = [
  { day: 'Mon', incidents: 12 },
  { day: 'Tue', incidents: 8 },
  { day: 'Wed', incidents: 15 },
  { day: 'Thu', incidents: 6 },
  { day: 'Fri', incidents: 19 },
  { day: 'Sat', incidents: 23 },
  { day: 'Sun', incidents: 11 },
]

export function IncidentsOverviewLineChart() {
  return (
    <div className="w-full font-sans" style={{ height: '280px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={weeklyIncidentsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="dashboardIncidentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} interval="preserveStartEnd" />
          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => Math.round(v).toString()} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="incidents"
            name="Incident Count"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#dashboardIncidentGrad)"
            activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            dot={{ r: 4, fill: '#2563EB' }}
          />
          <Legend wrapperStyle={{ color: '#64748B', fontSize: '12px', marginTop: '10px' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 2. Washroom Health Donut Chart (Dashboard)
const healthOverviewData = [
  { name: 'Good (WHI > 75)', value: 7, color: '#22C55E' },
  { name: 'Fair (WHI 60-75)', value: 3, color: '#F59E0B' },
  { name: 'Poor (WHI < 60)', value: 2, color: '#EF4444' }
]

export function WashroomHealthDonutChart() {
  const total = healthOverviewData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="relative w-full flex items-center justify-center font-sans" style={{ height: '280px' }}>
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={healthOverviewData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {healthOverviewData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-sans">
          <span className="text-3xl font-extrabold text-slate-900 leading-none">{total}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1.5">Washrooms</span>
        </div>
      </div>
    </div>
  )
}

// 3. Washroom Health Trends Chart (Analytics)
const healthTrendsData = [
  { day: 'Day 1', score: 82 },
  { day: 'Day 2', score: 84 },
  { day: 'Day 3', score: 80 },
  { day: 'Day 4', score: 78 },
  { day: 'Day 5', score: 85 },
  { day: 'Day 6', score: 89 },
  { day: 'Day 7', score: 92 },
  { day: 'Day 8', score: 87 },
  { day: 'Day 9', score: 83 },
  { day: 'Day 10', score: 79 },
  { day: 'Day 11', score: 88 },
  { day: 'Day 12', score: 91 },
  { day: 'Day 13', score: 94 },
  { day: 'Day 14', score: 82 },
]

export function WashroomHealthTrendsChart() {
  return (
    <div className="w-full font-sans" style={{ height: '280px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={healthTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} interval="preserveStartEnd" />
          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} tickFormatter={(v) => Math.round(v).toString()} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            name="Hygiene Index (WHI)"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#trendsGrad)"
            activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            dot={{ r: 4, fill: '#059669' }}
          />
          <Legend wrapperStyle={{ color: '#64748B', fontSize: '12px', marginTop: '10px' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 4. Incident Frequency Horizontal Bar Chart (Analytics)
const incidentSeverityData = [
  { name: 'Critical', count: 5, color: '#DC2626' },
  { name: 'High', count: 8, color: '#EA580C' },
  { name: 'Medium', count: 12, color: '#CA8A04' },
  { name: 'Low', count: 15, color: '#16A34A' }
]

export function IncidentFrequencyBarChart() {
  return (
    <div className="w-full font-sans" style={{ height: '280px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={incidentSeverityData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} interval="preserveStartEnd" />
          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => Math.round(v).toString()} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Incident Count">
            {incidentSeverityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <Legend wrapperStyle={{ color: '#64748B', fontSize: '12px', marginTop: '10px' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
