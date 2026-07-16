'use client'
import React, { useEffect, useState } from 'react'
import RoleBadge from './RoleBadge'

export default function LiveRoleBadge() {
  const [role, setRole] = useState<string>('UNKNOWN')

  useEffect(() => {
    const handleCheck = () => {
      const usernameInput = document.querySelector('input[name="identifier"]') as HTMLInputElement
      if (usernameInput) {
        const val = usernameInput.value.trim().toUpperCase()
        if (/^AP-\d{3}$/.test(val)) {
          setRole('ADMIN')
        } else if (/^TP-\d{3}$/.test(val)) {
          setRole('TERMINAL')
        } else if (/^ALP-\d{3}$/.test(val)) {
          setRole('AUDITOR')
        } else {
          setRole('UNKNOWN')
        }
      }
    }

    const interval = setInterval(handleCheck, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">Live Role Preview</span>
      <RoleBadge role={role} size="sm" variant="soft" />
    </div>
  )
}
