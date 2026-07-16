'use client'

import React from 'react'
import { useTerminalStore } from '@/lib/store'
import { TerminalId } from '@/types'

const OPTIONS: { id: TerminalId; label: string }[] = [
  { id: 'T1', label: 'T1 Arrivals' },
  { id: 'T2', label: 'T2 Departures' },
  { id: 'T3', label: 'T3 International' },
  { id: 'T4', label: 'T4 Concourse A' },
  { id: 'T5', label: 'T5 Concourse B' },
  { id: 'CGO', label: 'CGO Cargo' },
]

export default function TerminalSelector() {
  const { selectedTerminal, setSelectedTerminal } = useTerminalStore()

  return (
    <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm w-fit gap-1 font-sans">
      {OPTIONS.map((opt) => {
        const isActive = selectedTerminal === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => setSelectedTerminal(opt.id)}
            className={`cursor-pointer px-4 py-1.5 text-xs font-bold transition-all uppercase rounded-xl border-none ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
