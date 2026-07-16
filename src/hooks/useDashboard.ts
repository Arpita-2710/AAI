import { useQuery } from '@tanstack/react-query'
import { DashboardSummary } from '@/types'

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => fetch('/api/dashboard/summary').then((r) => {
      if (!r.ok) throw new Error('Failed to load dashboard summary')
      return r.json()
    }),
    staleTime: 30000,
  })
}
