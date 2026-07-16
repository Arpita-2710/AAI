import { useQuery } from '@tanstack/react-query'
import { Terminal, Level, WashroomWithState } from '@/types'

export function useTerminals() {
  return useQuery<any[]>({
    queryKey: ['terminals'],
    queryFn: () => fetch('/api/terminals').then((r) => {
      if (!r.ok) throw new Error('Failed to load terminals')
      return r.json()
    }),
    staleTime: 30000,
  })
}

export function useTerminalLevels(terminalId: string) {
  return useQuery<Level[]>({
    queryKey: ['terminals', terminalId, 'levels'],
    queryFn: () => fetch(`/api/terminals/${terminalId}/levels`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load levels for terminal ${terminalId}`)
      return r.json()
    }),
    staleTime: 30000,
    enabled: !!terminalId,
  })
}

export function useLevelWashrooms(terminalId: string, level: number) {
  return useQuery<WashroomWithState[]>({
    queryKey: ['washrooms', terminalId, level],
    queryFn: () => fetch(`/api/terminals/${terminalId}/levels/${level}/washrooms`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load washrooms for terminal ${terminalId} level ${level}`)
      return r.json()
    }),
    staleTime: 30000,
    enabled: !!terminalId && !isNaN(level) && level > 0,
  })
}
