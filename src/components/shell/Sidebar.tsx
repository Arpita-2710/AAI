'use client'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import RoleBadge from '@/components/auth/RoleBadge'
import {
  LayoutDashboard, BarChart3, Cpu, AlertTriangle, Building2,
  Users, Settings, User, Bath, Map, Activity,
  FileBarChart, ClipboardList, Shield, LogOut, ChevronRight
} from 'lucide-react'
import type { Role } from '@/types'

interface SidebarProps {
  role: Role
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const links = {
    ADMIN: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Terminals', href: '/admin/terminals', icon: Building2 },
      { label: 'Incidents', href: '/admin/incidents', icon: AlertTriangle },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Profile', href: '/admin/profile', icon: User },
    ],
    TERMINAL: [
      { label: 'Dashboard', href: '/terminal', icon: LayoutDashboard },
      { label: 'Floor Heatmap', href: '/terminal/floor-heatmap', icon: Map },
      { label: 'Washrooms', href: '/terminal/washrooms', icon: Bath },
      { label: 'Incidents Queue', href: '/terminal/incidents', icon: AlertTriangle },
      { label: 'Device Status', href: '/terminal/device-status', icon: Cpu },
      { label: 'Live WHI', href: '/terminal/live-whi', icon: Activity },
      { label: 'Reports', href: '/terminal/reports', icon: FileBarChart },
      { label: 'Operation Log', href: '/terminal/audit-log', icon: ClipboardList },
      { label: 'Settings', href: '/terminal/settings', icon: Settings },
      { label: 'Profile', href: '/terminal/profile', icon: User },
    ],
    AUDITOR: [
      { label: 'System Event Log', href: '/audit', icon: Shield },
    ]
  }

  const roleLinks = links[role] || []

  return (
    <aside className="w-64 shrink-0 aai-sidebar-glass flex flex-col h-screen font-sans">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
            AAI
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 font-bold text-sm truncate">
              Washroom Monitor
            </p>
            <p className="text-slate-500 text-xs truncate">
              Smart Hygiene System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Navigation
        </div>
        {roleLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group border",
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
              )}
            >
              <item.icon
                size={17}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              <span className="truncate">{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto text-blue-600" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-100 p-4 space-y-3">
        {process.env.NODE_ENV === 'development' && (
          <Link
            href="/dev/role-switcher"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-all duration-150 border border-slate-200 hover:border-blue-200 font-bold"
          >
            <Shield size={14} className="text-blue-600" />
            <span>Dev Role Switcher</span>
          </Link>
        )}

        <div className="flex justify-center">
          <RoleBadge role={role} size="sm" />
        </div>
        
        <SignOutButton redirectUrl="/sign-in">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-650 hover:bg-red-50 transition-all duration-150 border border-transparent hover:border-red-500/10 font-medium cursor-pointer">
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
