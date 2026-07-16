'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import UserProfileDrawer from '../shell/UserProfileDrawer';

interface HeaderProps {
  title: string;
  placeholder?: string;
  onSearchChange?: (val: string) => void;
}

export default function Header({ title, placeholder = 'Search facilities...', onSearchChange }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUser();

  const userName = user?.fullName || user?.username || 'Operator';
  const avatar = user?.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2GesO-YP3f1uzTyVSdDUVpTEQxwdDpd6APuZ5Pg-4I9-r_TTny1j4oiP3R4pKdldmFGyU-IAGdNzHrgTHSGJQdbQh1b1SKxNKdg14pUdaRUHI3XwkWXFDlOMyT5rAAZ8PL1WmbIpc6CciQyHFBwqmHBPgi6Rl5MWmiJgaYdirFOKPsiW5Y1CbLLC_BbaKg3mexsmf-yiP9C-8rjbthogxCvLVivtGoUY5O3fvSSn5DC-cVEE5_L5TNft_ccIWXVzSwliR3Uuis8Ds';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex justify-between items-center shrink-0 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 leading-tight">{title}</h1>
      </header>

      <UserProfileDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  );
}
