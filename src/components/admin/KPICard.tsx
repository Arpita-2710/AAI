import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple'
  trend?: string
  trendDirection?: 'up' | 'down'
  linkText?: string
}

export default function KPICard({ title, value, icon, color, trend, trendDirection, linkText }: Props) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border border-blue-200',
    red: 'bg-red-50 text-red-600 border border-red-200',
    green: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    yellow: 'bg-orange-50 text-orange-600 border border-orange-200',
    purple: 'bg-violet-50 text-violet-700 border border-violet-200'
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200 cursor-default flex items-start justify-between gap-4 font-sans shadow-sm w-full">
      <div className="flex-1 min-w-0">
        <h3 className="text-3xl font-bold text-slate-900 tabular-nums leading-none tracking-tight">{value}</h3>
        <p className="text-sm text-slate-500 mt-1.5 leading-snug font-medium truncate">{title}</p>
        {trend && (
          <div className="text-xs mt-2 flex items-center gap-1">
            {trendDirection === 'up' ? (
              <span className="text-emerald-600 flex items-center gap-0.5 font-medium">
                <ArrowUpRight size={14} /> {trend}
              </span>
            ) : trendDirection === 'down' ? (
              <span className="text-red-500 flex items-center gap-0.5 font-medium">
                <ArrowDownRight size={14} /> {trend}
              </span>
            ) : (
              <span className="text-slate-400">{trend}</span>
            )}
          </div>
        )}
        {linkText && (
          <div className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center gap-0.5">
            {linkText}
          </div>
        )}
      </div>
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
        colorClasses[color]
      )}>
        {icon}
      </div>
    </div>
  )
}
