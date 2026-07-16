import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center font-sans gap-3">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Connecting to Telemetry Stream...</p>
    </div>
  )
}
