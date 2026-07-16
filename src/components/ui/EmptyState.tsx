import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
}

export default function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
      {Icon && <Icon size={40} className="text-slate-650 animate-pulse" />}
      <h3 className="text-slate-400 font-semibold text-base">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-sm">{description}</p>}
    </div>
  )
}
