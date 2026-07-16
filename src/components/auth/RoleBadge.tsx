import React from 'react'

interface Props {
  role: string
  size?: 'sm' | 'md'
  variant?: 'filled' | 'soft'
}

export default function RoleBadge({ role, size = 'md', variant = 'filled' }: Props) {
  const normalized = role.toUpperCase()

  const config: Record<
    string,
    {
      filled: { bg: string; text: string; border: string }
      soft: { bg: string; text: string; border: string }
      label: string
    }
  > = {
    ADMIN: {
      filled: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600' },
      soft: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      label: 'ADMINISTRATOR'
    },
    TERMINAL: {
      filled: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-600' },
      soft: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      label: 'TERMINAL OPERATOR'
    },
    AUDITOR: {
      filled: { bg: 'bg-violet-600', text: 'text-white', border: 'border-violet-600' },
      soft: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
      label: 'SYSTEM AUDITOR'
    }
  }

  const badge = config[normalized] || {
    filled: { bg: 'bg-red-650', text: 'text-white', border: 'border-red-650' },
    soft: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    label: 'UNKNOWN ROLE'
  }

  const style = variant === 'filled' ? badge.filled : badge.soft
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'

  return (
    <span className={`inline-flex items-center font-bold tracking-wider rounded border font-mono ${style.bg} ${style.text} ${style.border} ${sizeClass}`}>
      {badge.label}
    </span>
  )
}
