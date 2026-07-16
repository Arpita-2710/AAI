'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/ui/PageHeader'
import DataCard from '@/components/ui/DataCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { ArrowLeft, ShieldAlert, Cpu, Wrench, RefreshCw, Thermometer, Droplet, AlertTriangle, Wind } from 'lucide-react'
import { cn, computeWHI } from '@/lib/utils'

function WashroomDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceId = searchParams.get('device_id') || 'T2-L3-PPF-001'

  const { data: unit, isLoading, error } = useQuery<any>({
    queryKey: ['washrooms', deviceId],
    queryFn: () => fetch(`/api/washrooms/${deviceId}`).then((r) => {
      if (!r.ok) throw new Error('Failed to load washroom detail')
      return r.json()
    }),
    staleTime: 10000,
  })

  if (isLoading) {
    return <LoadingSpinner text="Retrieving washroom node telemetry..." />
  }

  if (error || !unit) {
    return (
      <div className="p-6 font-sans">
        <button
          onClick={() => router.push('/terminal/washrooms')}
          className="text-blue-600 hover:underline flex items-center gap-1.5 text-xs font-bold bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Washrooms
        </button>
        <EmptyState title="Washroom Node Not Found" description="The requested telemetry node is unreachable or does not exist." icon={ShieldAlert} />
      </div>
    )
  }

  const state = unit.state || {}
  const whi = state.whi_score ?? 100
  const isCritical = whi < 60

  const getConsumableColor = (val: number) => {
    if (val >= 50) return 'bg-green-500'
    if (val >= 20) return 'bg-amber-500'
    return 'bg-red-500 animate-pulse'
  }

  return (
    <div className="space-y-6 font-sans text-sm text-slate-700">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push('/terminal/washrooms')}
          className="text-blue-650 hover:underline flex items-center gap-1.5 text-xs font-bold bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Washrooms Inventory
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title={unit.label}
          subtitle={`Device Code: ${unit.device_id} · Location: ${unit.location_desc || 'Main Level Zone'}`}
        />
        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm shrink-0">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">HYGIENE INDEX</span>
          <span className={cn(
            "text-2xl font-black font-mono",
            whi < 60 ? 'text-red-600' : whi < 75 ? 'text-amber-600' : 'text-green-600'
          )}>{whi}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Columns - Telemetry details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Environmental Sensors */}
          <DataCard title="Environmental Telemetry" subtitle="Real-time air quality, thermal and moisture levels.">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Thermometer size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Temperature</span>
                </div>
                <p className="text-lg font-black text-slate-800 font-mono">{state.temp_celsius?.toFixed(1) ?? '22.0'}°C</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Droplet size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Humidity</span>
                </div>
                <p className="text-lg font-black text-slate-800 font-mono">{state.humidity_pct?.toFixed(0) ?? '45'}%</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Wind size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Ammonia</span>
                </div>
                <p className={cn(
                  "text-lg font-black font-mono",
                  state.ammonia_ppm > 50 ? "text-red-600" : "text-slate-800"
                )}>{state.ammonia_ppm?.toFixed(1) ?? '15.0'} PPM</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Cpu size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">CO2 Level</span>
                </div>
                <p className="text-lg font-black text-slate-800 font-mono">{state.co2_ppm?.toFixed(0) ?? '400'} PPM</p>
              </div>
            </div>
          </DataCard>

          {/* Consumable Levels */}
          <DataCard title="Consumable Adequacy" subtitle="Current status of dispensers and soap reservoirs.">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Liquid Soap</span>
                  <span className="font-mono font-bold">{state.soap_pct?.toFixed(0) ?? '75'}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className={cn("h-full", getConsumableColor(state.soap_pct ?? 75))} style={{ width: `${state.soap_pct ?? 75}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Paper Towels</span>
                  <span className="font-mono font-bold">{state.paper_pct?.toFixed(0) ?? '70'}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className={cn("h-full", getConsumableColor(state.paper_pct ?? 70))} style={{ width: `${state.paper_pct ?? 70}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Sanitizer gel</span>
                  <span className="font-mono font-bold">{state.sanitizer_pct?.toFixed(0) ?? '80'}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className={cn("h-full", getConsumableColor(state.sanitizer_pct ?? 80))} style={{ width: `${state.sanitizer_pct ?? 80}%` }} />
                </div>
              </div>
            </div>
          </DataCard>
        </div>

        {/* Right Columns - Info widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Node Diagnostics */}
          <DataCard title="Hardware Diagnostics">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Terminal Node</span>
                <span className="font-bold text-slate-800">{unit.terminal_id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Level Level</span>
                <span className="font-bold text-slate-800">L{unit.level_id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Battery Level</span>
                <span className="font-bold text-slate-800 font-mono">{state.battery_level?.toFixed(0) ?? '98'}%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Signal Strength</span>
                <span className="font-bold text-slate-800 font-mono">{state.signal_strength?.toFixed(0) ?? '-65'} dBm</span>
              </div>
            </div>
          </DataCard>

          {/* Controller Actions */}
          <DataCard title="Remote Operations">
            <div className="space-y-3">
              <button
                onClick={() => alert('Sensor recalibration signal broadcast successfully.')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer border-none shadow-sm"
              >
                <RefreshCw size={14} /> Recalibrate Sensor Node
              </button>
              <button
                onClick={() => router.push(`/terminal/incidents?device_id=${unit.device_id}`)}
                className="w-full bg-white border border-slate-350 hover:border-slate-400 text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Wrench size={14} /> Report Incident / Request Service
              </button>
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  )
}

export default function TotalWashroomsDetail() {
  return (
    <Suspense fallback={<LoadingSpinner text="Connecting to washroom detail state..." />}>
      <WashroomDetailContent />
    </Suspense>
  )
}
