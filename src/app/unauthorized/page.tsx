'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShieldX, ArrowRight, LogOut } from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'
import RoleBadge from '@/components/auth/RoleBadge'
import { Suspense } from 'react'

function UnauthorizedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const required = searchParams.get('required') || 'NONE'
  const current = searchParams.get('current') || 'NONE'

  const getPortalUrl = (role: string) => {
    const normalized = role.toUpperCase()
    if (normalized === 'ADMIN') return '/admin/dashboard'
    if (normalized === 'TERMINAL') return '/terminal'
    if (normalized === 'AUDITOR') return '/audit'
    return '/sign-in'
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-lg w-full z-10 shadow-xl relative">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldX size={40} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>
        <p className="text-slate-500 text-sm mt-2">
          You don't have permission to access this area of the system.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl mt-8 mb-8 overflow-hidden divide-y divide-slate-200">
        {/* Row 1 */}
        <div className="flex justify-between items-center px-5 py-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
              Your Current Role
            </p>
            <RoleBadge role={current} size="sm" />
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Access Level</p>
            <span className="text-red-600 text-xs font-bold uppercase tracking-wider">Insufficient</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center px-5 py-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
              Required Role
            </p>
            <RoleBadge role={required} size="sm" />
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Access Level</p>
            <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Required</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => router.push(getPortalUrl(current))}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer border-none"
        >
          <span>Go to My Portal</span>
          <ArrowRight size={16} />
        </button>

        <SignOutButton redirectUrl="/sign-in">
          <button className="w-full bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer">
            <LogOut size={16} />
            <span>Sign Out & Switch Account</span>
          </button>
        </SignOutButton>
      </div>
    </div>
  )
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Grids and Radial Blobs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-mono tracking-wider font-semibold">LOADING PRIVILEGES...</p>
        </div>
      }>
        <UnauthorizedContent />
      </Suspense>
    </div>
  )
}
