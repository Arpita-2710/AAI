'use client'
import React from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import RoleBadge from '../auth/RoleBadge'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserProfileDrawer({ open, onOpenChange }: Props) {
  const { user } = useUser()
  const role = (user?.publicMetadata as any)?.role || 'UNKNOWN'

  if (!user) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md mx-auto">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-white text-lg font-bold">Operator Profile</DrawerTitle>
            <DrawerDescription className="text-slate-400 text-xs">
              System access credentials and terminal metadata.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-6 text-xs select-none">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-full border border-slate-700 overflow-hidden bg-slate-950">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-lg">A</div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{user.fullName || user.username}</h3>
                <span className="text-[10px] text-slate-455 font-mono block mt-1">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-455 font-medium">Session ID</span>
                <span className="font-mono text-slate-200">{user.id.substring(0, 12)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-455 font-medium">User Profile ID</span>
                <span className="font-mono text-blue-400 font-bold">{user.username || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-455 font-medium">Current Role</span>
                <RoleBadge role={role} size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-455 font-medium">Login Timestamp</span>
                <span className="text-slate-200">
                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-2 pb-6 border-t border-slate-800 mt-4">
            <SignOutButton redirectUrl="/sign-in">
              <button className="w-full py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer">
                Terminate Session
              </button>
            </SignOutButton>
            <DrawerClose className="w-full py-2.5 border border-slate-750 text-slate-300 font-bold rounded-lg text-xs hover:bg-slate-855 cursor-pointer">
              Close Drawer
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
