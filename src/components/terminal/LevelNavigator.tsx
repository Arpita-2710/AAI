'use client'

import React from 'react'
import { useTerminalStore, useLevelStore } from '@/lib/store'
import { useTerminalLevels } from '@/hooks/useTerminals'
import { cn } from '@/lib/utils'

export default function LevelNavigator() {
  const { selectedTerminal } = useTerminalStore()
  const { selectedLevel, setSelectedLevel } = useLevelStore()
  const { data: levelsList, isLoading, error } = useTerminalLevels(selectedTerminal)

  const getWhiBadgeColor = (whi: number) => {
    if (whi >= 75) return 'bg-green-50 text-green-700 border-green-250'
    if (whi >= 60) return 'bg-amber-50 text-amber-750 border-amber-250'
    return 'bg-red-50 text-red-700 border-red-200'
  }

  if (isLoading) {
    return (
      <div className="flex gap-2 font-sans py-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !levelsList) {
    return null
  }

  return (
    <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm w-full overflow-x-auto gap-2 font-sans">
      {levelsList.map((lvl) => {
        const isActive = selectedLevel === lvl.level_number
        const whi = lvl.avg_whi ?? 100
        return (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.level_number)}
            className={cn(
              "cursor-pointer px-4 py-2 text-xs font-bold transition-all uppercase rounded-xl flex items-center justify-between gap-3 border border-transparent whitespace-nowrap shrink-0",
              isActive
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <span>{lvl.label.split(' — ')[0] || `Level ${lvl.level_number}`}</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-extrabold font-mono border",
              isActive ? "bg-white/20 text-white border-transparent" : getWhiBadgeColor(whi)
            )}>
              {whi}%
            </span>
          </button>
        )
      })}
    </div>
  )
}
