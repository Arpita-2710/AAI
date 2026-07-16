'use client'
import React, { useState } from 'react'
import { Stall } from '../../types'
import { statusColor } from '../../lib/utils'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip'

interface Props {
  stalls: Stall[]
}

export default function StallGrid({ stalls }: Props) {
  const [selectedStall, setSelectedStall] = useState<string | null>(null)

  return (
    <TooltipProvider>
      <div className="space-y-6 font-sans">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 select-none">
          {stalls.map((stall) => {
            const colorClass = statusColor(stall.status)
            const isSelected = selectedStall === stall.id

            return (
              <Tooltip key={stall.id}>
                <TooltipTrigger>
                  <button
                    onClick={() => setSelectedStall(isSelected ? null : stall.id)}
                    className={`rounded-xl p-3 text-center text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-[1.02] border focus:outline-none flex flex-col items-center justify-center gap-1 ${colorClass} ${
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white scale-[1.04]' : ''
                    }`}
                  >
                    <span className="font-bold text-sm text-inherit">{stall.label}</span>
                    <span className="opacity-80 text-[10px] uppercase tracking-wider text-inherit">{stall.status}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-slate-200 text-slate-900 text-xs p-3 rounded-lg shadow-xl">
                  <p className="font-bold text-slate-800">Stall {stall.label}</p>
                  <p className="text-slate-500 mt-1">ID: <span className="font-mono text-slate-800">{stall.id}</span></p>
                  <p className="text-slate-500">Status: <span className="font-bold text-slate-700">{stall.status}</span></p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 border-t border-slate-200 pt-4 justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-green-50 border border-green-200 inline-block"></span>
            <span>Vacant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-red-50 border border-red-200 inline-block"></span>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-50 border border-amber-200 inline-block"></span>
            <span>Cleaning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-200 inline-block"></span>
            <span>Out of Order</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
