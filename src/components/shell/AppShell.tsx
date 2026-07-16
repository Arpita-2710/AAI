'use client'
import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { Role } from '@/types'

interface AppShellProps {
  role: Role
  children: React.ReactNode
}

export default function AppShell({ children, role }: AppShellProps) {
  return (
    <>
      {/* Background image layer — fixed, behind everything */}
      <div className="aai-bg-image" aria-hidden="true" />

      {/* Blur + color overlay layer */}
      <div className="aai-bg-overlay" aria-hidden="true" />

      {/* App shell — sits above both background layers */}
      <div className="aai-app-shell flex h-screen overflow-hidden font-sans">
        <Sidebar role={role} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header role={role} />
          <main className="aai-main-content flex-1 overflow-y-auto">
            <div className="p-6 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
