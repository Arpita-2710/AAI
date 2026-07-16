'use client'
import React from 'react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-750 flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="flex flex-col items-center text-center space-y-4 max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-red-600 shadow-sm animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">403 — Forbidden</h1>
        <p className="text-sm text-slate-500 font-medium">
          This portal access was explicitly forbidden by administrative security policies.
        </p>
        <div className="pt-6 w-full">
          <Link
            href="/sign-in"
            className="w-full inline-block py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm text-xs"
          >
            Return to Gateway login
          </Link>
        </div>
      </div>
    </div>
  )
}
