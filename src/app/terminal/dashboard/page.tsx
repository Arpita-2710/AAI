'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/terminal');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-slate-400 text-xs font-mono">
      Redirecting to Terminal Portal...
    </div>
  );
}
