'use client'
import { useUser, UserProfile } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import RoleBadge from '@/components/auth/RoleBadge'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) return <LoadingSpinner />

  const role = user?.publicMetadata?.role as string ?? 'UNKNOWN'

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account details, security, and preferences"
      />

      {/* User Identity Card — AAI-specific info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          
          {/* Clerk avatar */}
          <img
            src={user?.imageUrl}
            alt={user?.fullName ?? 'User'}
            className="w-16 h-16 rounded-2xl ring-2 ring-slate-100"
          />

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900">
              {user?.fullName ?? user?.username}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <RoleBadge role={role} size="sm" variant="soft" />
              <span className="text-slate-400 text-xs font-mono">
                ID: {user?.username ?? 'N/A'}
              </span>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-slate-400 text-xs">Member since</p>
            <p className="text-slate-700 text-sm font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Full Clerk UserProfile — email, password, security, 2FA etc */}
      <div className="clerk-profile-wrapper">
        <UserProfile
          appearance={{
            elements: {
              rootBox:    'w-full',
              card:       'bg-white border border-slate-200 shadow-sm rounded-2xl w-full',
              navbar:     'bg-slate-50 border-r border-slate-200',
              navbarButton: 'text-slate-650 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors',
              navbarButtonActive: 'bg-slate-100 text-blue-700 font-bold',
              pageScrollBox:       'bg-transparent',
              headerTitle:         'text-slate-900 font-bold text-lg',
              headerSubtitle:      'text-slate-500 text-sm',
              formFieldLabel:      'text-slate-700 text-sm font-medium',
              formFieldInput:      'bg-white border-slate-300 text-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30',
              formButtonPrimary:   'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors',
              formButtonReset:     'text-slate-500 hover:text-slate-900 transition-colors',
              badge:               'bg-blue-50 text-blue-700 border border-blue-200',
              profileSectionTitle: 'text-slate-900 font-semibold text-sm',
              profileSectionContent: 'text-slate-600 text-sm',
              accordionTriggerButton: 'text-slate-700 hover:text-slate-900 transition-colors',
              alertText:           'text-red-650',
              identityPreviewText: 'text-slate-700',
              identityPreviewEditButton: 'text-blue-605 hover:text-blue-700',
            },
            variables: {
              colorPrimary:         '#3B82F6',
              colorBackground:      '#ffffff',
              colorText:            '#0f172a',
              colorTextSecondary:   '#475569',
              colorDanger:          '#ef4444',
              borderRadius:         '0.75rem',
            } as any
          }}
        />
      </div>
    </div>
  )
}
