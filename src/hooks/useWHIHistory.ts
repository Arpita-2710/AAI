import { useQuery } from '@tanstack/react-query'

export interface WHIHistoryPoint {
  date: string
  avg_whi: number
  terminal_id: string
}

export function useWHIHistory(terminalId: string, days = 7) {
  return useQuery<WHIHistoryPoint[]>({
    queryKey: ['whi', 'history', terminalId, days],
    queryFn: () => fetch(`/api/whi/history?terminal=${terminalId}&days=${days}`).then((r) => {
      if (!r.ok) throw new Error('Failed to load WHI history')
      return r.json()
    }),
    staleTime: 60000,
    enabled: !!terminalId,
  })
}
