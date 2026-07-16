'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getWashrooms, getHeatmapZones, Washroom, HeatmapZone } from '@/db'
import { floorHeatmapZones } from '@/lib/mockData'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { Building2, MapPin } from 'lucide-react'
import { cn, statusColor, trafficHeatColor } from '@/lib/utils'

const mockTrends = [12, -8, 0, 5, -10, 15, -4, 0, 8, -6, 2, -12, 14, -7, 0, -3]

export default function FloorHeatmap() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [washrooms, setWashrooms] = useState<Washroom[]>([])
  const [heatmapZonesList, setHeatmapZonesList] = useState<HeatmapZone[]>([])
  const [activeLevel, setActiveLevel] = useState<'L1' | 'L2' | 'MZ'>('L1')

  useEffect(() => {
    async function loadData() {
      try {
        const [w, hz] = await Promise.all([
          getWashrooms(),
          getHeatmapZones()
        ])
        setWashrooms(w)
        setHeatmapZonesList(hz.length > 0 ? hz : floorHeatmapZones)
      } catch (err) {
        console.error('Error loading terminal heatmap metrics:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Querying terminal node zones..." />
  }

  const maleUnits = washrooms.filter(w => w.name.toLowerCase().includes('gents'))
  const femaleUnits = washrooms.filter(w => w.name.toLowerCase().includes('ladies'))
  const avgWhi = washrooms.length > 0 ? Math.round(washrooms.reduce((acc, curr) => acc + curr.whi, 0) / washrooms.length) : 0

  const getWhiTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-650'
  }

  const getWhiBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6 font-sans text-sm text-slate-700">
      <PageHeader
        title="Floor Heatmap"
        subtitle="Live density, usage velocity, and hygiene assessments mapped by gate cluster."
        actions={
          <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl">
            {(['L1', 'L2', 'MZ'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase ${
                  activeLevel === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-550 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {lvl === 'L1' ? 'Level 1' : lvl === 'L2' ? 'Level 2' : 'Mezzanine'}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Heatmap Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <DataCard
            title="Interactive Zone Map"
            subtitle="Diagnostic overlay displaying live metrics across Terminal Arrivals."
          >
            <div className="border border-slate-200 bg-slate-50 p-6 rounded-2xl relative shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Male Zones */}
                <div className="col-span-1 flex flex-col items-center justify-center border-r border-slate-200 pr-4">
                  <span className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Gents Units</span>
                  <span className="text-blue-600 text-4xl font-extrabold font-mono">{maleUnits.length}</span>
                </div>

                <div className="col-span-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {maleUnits.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => router.push('/terminal/washrooms')}
                      className="bg-white p-4 rounded-xl border border-slate-205 hover:border-slate-350 hover:shadow-sm transition-all cursor-pointer relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-500 font-mono">{w.id}</span>
                        <span className={cn("text-lg font-bold leading-none font-mono", getWhiTextColor(w.whi))}>
                          {w.whi}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div className={cn("h-full", getWhiBarColor(w.whi))} style={{ width: `${w.whi}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-span-1 md:col-span-5 h-[1px] bg-slate-200 my-2" />

                {/* Female Zones */}
                <div className="col-span-1 flex flex-col items-center justify-center border-r border-slate-200 pr-4">
                  <span className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Ladies Units</span>
                  <span className="text-violet-650 text-4xl font-extrabold font-mono">{femaleUnits.length}</span>
                </div>

                <div className="col-span-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {femaleUnits.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => router.push('/terminal/washrooms')}
                      className="bg-white p-4 rounded-xl border border-slate-205 hover:border-slate-350 hover:shadow-sm transition-all cursor-pointer relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-500 font-mono">{w.id}</span>
                        <span className={cn("text-lg font-bold leading-none font-mono", getWhiTextColor(w.whi))}>
                          {w.whi}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div className={cn("h-full", getWhiBarColor(w.whi))} style={{ width: `${w.whi}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DataCard>

          {/* Concourse Heatmap Section */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-xl font-semibold text-slate-800">Concourse Floor Heatmap</h3>
              <p className="text-sm text-slate-500 mt-1">Terminal 2 — Live Traffic Density</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              {heatmapZonesList.map((z, idx) => {
                const termLabel = `T-${String(idx + 1).padStart(2, '0')}`;
                const trend = mockTrends[idx % mockTrends.length];
                const bgClass = trafficHeatColor(z.traffic);
                return (
                  <div key={z.id} className={cn("p-4 rounded-xl border relative h-28 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer", bgClass)}>
                    <span className="text-xs font-semibold text-slate-600 self-start">{termLabel}</span>
                    <div className="text-center flex flex-col items-center">
                      <span className="text-xl font-bold font-mono">{z.traffic}</span>
                      <span className="text-[10px] text-slate-500 font-bold truncate max-w-full">{z.label}</span>
                    </div>
                    <div className="self-end mt-1">
                      {trend > 0 ? (
                        <span className="text-red-500 text-xs font-bold flex items-center gap-0.5">↑ +{trend}%</span>
                      ) : trend < 0 ? (
                        <span className="text-green-600 text-xs font-bold flex items-center gap-0.5">↓ {trend}%</span>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold flex items-center gap-0.5">→ 0%</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex-wrap gap-3">
              <span>Terminal Range: T-01 to T-16</span>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm"></span>
                  <span>High Traffic (&ge;75)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm"></span>
                  <span>Medium Traffic (50-74)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></span>
                  <span>Normal Traffic (25-49)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></span>
                  <span>Low Traffic (&lt;25)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <DataCard title="Density Diagnostics">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-500">Average Terminal WHI</span>
                <span className="font-mono text-green-600 font-bold text-base">{avgWhi}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-slate-500 font-medium">Optimal Nodes</p>
                  <p className="text-lg font-bold text-green-600 mt-1 font-mono">{washrooms.filter(w => w.whi >= 75).length}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-slate-500 font-medium">Critical Nodes</p>
                  <p className="text-lg font-bold text-red-655 mt-1 font-mono">{washrooms.filter(w => w.whi < 60).length}</p>
                </div>
              </div>
            </div>
          </DataCard>

          <DataCard title="Live Alerts Feed">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {washrooms.filter(w => w.whi < 65).map((w) => (
                <div key={w.id} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{w.id} — Critical</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{w.name}</p>
                  </div>
                  <span className="text-xs font-bold text-red-650 font-mono">{w.whi}%</span>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  )
}
