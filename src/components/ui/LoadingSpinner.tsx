import React from 'react'

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-mono uppercase tracking-wider">{text}</p>
    </div>
  )
}
