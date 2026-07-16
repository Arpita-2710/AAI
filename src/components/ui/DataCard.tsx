import React from 'react'
import { cn } from '@/lib/utils'

interface DataCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export default function DataCard({ title, subtitle, children, className, actions }: DataCardProps) {
  return (
    <div className={cn(
      "aai-card-glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="font-semibold text-slate-900 text-sm tracking-tight">{title}</h3>}
            {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
