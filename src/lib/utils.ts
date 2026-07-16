import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UnitType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function severityBadgeClass(s: string): string {
  const map: Record<string, string> = {
    CRITICAL: 'bg-red-50 text-red-600 border border-red-200',
    HIGH:     'bg-orange-50 text-orange-600 border border-orange-200',
    MEDIUM:   'bg-yellow-50 text-yellow-750 border border-yellow-200',
    LOW:      'bg-green-50 text-green-600 border border-green-200',
    INFO:     'bg-blue-50 text-blue-600 border border-blue-200',
    SUCCESS:  'bg-green-50 text-green-600 border border-green-200',
    WARNING:  'bg-yellow-50 text-yellow-750 border border-yellow-200',
  }
  return map[s] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
}

export function statusBadgeClass(s: string): string {
  const map: Record<string, string> = {
    OPEN:         'bg-red-50 text-red-600 border border-red-200',
    IN_PROGRESS:  'bg-blue-50 text-blue-600 border border-blue-200',
    RESOLVED:     'bg-green-50 text-green-600 border border-green-200',
    ONLINE:       'bg-green-50 text-green-700 border border-green-200',
    OFFLINE:      'bg-red-50 text-red-700 border border-red-200',
    MAINTENANCE:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
    VACANT:       'bg-green-50 text-green-700 border border-green-200',
    OCCUPIED:     'bg-red-50 text-red-700 border border-red-200',
    CLEANING:     'bg-amber-50 text-amber-700 border border-amber-200',
    OUT_OF_ORDER: 'bg-slate-100 text-slate-500 border border-slate-200',
    ACTIVE:       'bg-green-50 text-green-700 border border-green-200',
    INACTIVE:     'bg-slate-100 text-slate-500 border border-slate-200',
  }
  return map[s] ?? 'bg-slate-100 text-slate-500 border border-slate-200'
}

export const severityColor = severityBadgeClass
export const statusColor = statusBadgeClass

export function severityBorderClass(s: string): string {
  const map: Record<string, string> = {
    CRITICAL: 'border-l-red-500',
    WARNING:  'border-l-amber-500',
    INFO:     'border-l-blue-500',
    SUCCESS:  'border-l-green-500',
  }
  return map[s] ?? 'border-l-slate-300'
}

export function batteryBarClass(pct: number): string {
  if (pct > 50) return 'bg-green-500'
  if (pct > 20) return 'bg-amber-500'
  return 'bg-red-500'
}

export function whiColor(score: number): string {
  if (score >= 75) return 'text-green-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}

export function trafficHeatColor(traffic: number): string {
  if (traffic >= 75) return 'bg-red-100 text-red-700 border border-red-200'
  if (traffic >= 50) return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (traffic >= 25) return 'bg-green-100 text-green-700 border border-green-200'
  return 'bg-blue-100 text-blue-700 border border-blue-200'
}

export function timeElapsed(createdAt: string | Date): string {
  const now = new Date()
  const created = new Date(createdAt)
  const diffMins = Math.floor((now.getTime() - created.getTime()) / 60000)
  if (diffMins < 0) return '0m'
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`
  return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`
}

export function computeWHI(params: {
  cleanliness_score: number
  occupancy_count: number
  unit_type: UnitType
  soap_pct: number
  paper_pct: number
  sanitizer_pct: number
  ammonia_ppm: number
}): number {
  const CAPACITY: Record<UnitType, number> = { PPM: 4, PPF: 4, PPD: 2, STF: 3 }
  const capacity = CAPACITY[params.unit_type]
  const occupancyLoadPct = Math.min((params.occupancy_count / capacity) * 100, 100)
  const supplyScore = (params.soap_pct + params.paper_pct + params.sanitizer_pct) / 3
  const airScore = Math.max(0, 100 - Math.min((params.ammonia_ppm / 50) * 100, 100))
  return Math.round((
    params.cleanliness_score * 0.35 +
    (100 - occupancyLoadPct) * 0.20 +
    supplyScore * 0.25 +
    airScore * 0.20
  ) * 10) / 10
}

export function parseDeviceId(deviceId: string): { terminal: string; level: number; type: UnitType; unit: number } | null {
  const match = deviceId.match(/^(T1|T2|CGO)-L(\d)-([A-Z]{3})-(\d{3})$/)
  if (!match) return null
  return { terminal: match[1], level: parseInt(match[2]), type: match[3] as UnitType, unit: parseInt(match[4]) }
}

export function supplyAlertClass(pct: number): string {
  if (pct <= 10) return 'bg-red-500'
  if (pct <= 20) return 'bg-amber-500'
  if (pct <= 40) return 'bg-yellow-400'
  return 'bg-green-500'
}

export function formatTimestamp(dateStr: string | Date): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}



