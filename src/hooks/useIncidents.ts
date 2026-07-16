import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Incident, IncidentWithContext, NewIncidentInput, IncidentFilters } from '@/types'

export function useIncidents(filters: IncidentFilters) {
  const queryParams = new URLSearchParams()
  if (filters.terminal) queryParams.set('terminal', filters.terminal)
  if (filters.severity) queryParams.set('severity', filters.severity)
  if (filters.status) queryParams.set('status', filters.status)
  if (filters.page) queryParams.set('page', String(filters.page))
  if (filters.limit) queryParams.set('limit', String(filters.limit))

  return useQuery<{ data: any[]; total: number; page: number }>({
    queryKey: ['incidents', filters],
    queryFn: () => fetch(`/api/incidents?${queryParams.toString()}`).then((r) => {
      if (!r.ok) throw new Error('Failed to load incidents')
      return r.json()
    }),
    staleTime: 15000,
  })
}

export function useIncident(id: number) {
  return useQuery<IncidentWithContext>({
    queryKey: ['incidents', id],
    queryFn: () => fetch(`/api/incidents/${id}`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load incident details for ID ${id}`)
      return r.json()
    }),
    staleTime: 10000,
    enabled: !isNaN(id) && id > 0,
  })
}

export function useCreateIncident() {
  const qc = useQueryClient()
  return useMutation<Incident, Error, NewIncidentInput>({
    mutationFn: (body) => fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((r) => {
      if (!r.ok) throw new Error('Failed to report incident')
      return r.json()
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
      qc.invalidateQueries({ queryKey: ['dashboard', 'summary'] })
    }
  })
}

export function usePatchIncident() {
  const qc = useQueryClient()
  return useMutation<Incident, Error, { id: number; status: 'IN_PROGRESS' | 'RESOLVED'; note?: string; actor: string }>({
    mutationFn: ({ id, ...body }) => fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((r) => {
      if (!r.ok) throw new Error('Failed to update incident status')
      return r.json()
    }),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
      qc.invalidateQueries({ queryKey: ['incidents', variables.id] })
      qc.invalidateQueries({ queryKey: ['dashboard', 'summary'] })
    }
  })
}
