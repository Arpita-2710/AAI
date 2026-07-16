'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDevices, Device } from '@/db'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import DeviceCard from '@/components/terminal/DeviceCard'
import { Cpu, Search, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

function DeviceStatusContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState<Device[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    const status = searchParams.get('status')
    if (status) {
      setStatusFilter(status.toUpperCase())
    }
  }, [searchParams])

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDevices()
        setDevices(data)
      } catch (err) {
        console.error('Error fetching devices:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Retrieving hardware telemetry states..." />
  }

  const filteredDevices = devices.filter((dev) => {
    const matchesSearch =
      dev.id.toLowerCase().includes(search.toLowerCase()) ||
      dev.type.toLowerCase().includes(search.toLowerCase()) ||
      dev.location.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || dev.status.toUpperCase() === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  // derive telemetry stats
  const total = devices.length
  const online = devices.filter(x => x.status === 'ONLINE').length
  const offline = devices.filter(x => x.status === 'OFFLINE').length
  const maintenance = devices.filter(x => x.status === 'MAINTENANCE').length

  return (
    <div className="space-y-6 font-sans text-sm">
      <PageHeader
        title="Device Telemetry Status"
        subtitle="Network states, battery indexes, and hardware ping latencies across active nodes."
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search node ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-60"
              />
            </div>
            <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl">
              {['ALL', 'ONLINE', 'OFFLINE', 'MAINTENANCE'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer",
                    statusFilter === opt ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Total Managed Nodes</p>
            <p className="text-3xl text-slate-900 font-bold font-mono">{String(total).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Cpu size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Online Nodes</p>
            <p className="text-3xl text-green-600 font-bold font-mono">{String(online).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 shadow-sm">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Offline Nodes</p>
            <p className="text-3xl text-red-655 font-bold font-mono">{String(offline).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-650 shadow-sm">
            <AlertTriangle size={20} className={cn(offline > 0 && "animate-pulse")} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Maintenance</p>
            <p className="text-3xl text-blue-600 font-bold font-mono">{String(maintenance).padStart(2, '0')}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <RefreshCw size={20} />
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredDevices.length === 0 ? (
        <EmptyState title="No Devices Found" description="Try broadening your search or change status filter options." icon={Cpu} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DeviceStatusPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Hardware Telemetry..." />}>
      <DeviceStatusContent />
    </Suspense>
  )
}
