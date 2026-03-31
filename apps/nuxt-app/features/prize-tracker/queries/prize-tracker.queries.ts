import type { DrawEvent, PrizeState } from '../types/prize-tracker.types'
import { useQuery } from '@tanstack/vue-query'

export const prizeTrackerKeys = {
  all: ['prize-tracker'] as const,
  state: () => [...prizeTrackerKeys.all, 'state'] as const,
  draws: () => [...prizeTrackerKeys.all, 'draws'] as const,
}

export function usePrizeStateQuery() {
  return useQuery({
    queryKey: prizeTrackerKeys.state(),
    queryFn: (): Promise<PrizeState[]> => $fetch('/api/prize-tracker/state'),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    enabled: import.meta.client,
  })
}

export function useDrawEventsQuery() {
  return useQuery({
    queryKey: prizeTrackerKeys.draws(),
    queryFn: (): Promise<DrawEvent[]> => $fetch('/api/prize-tracker/draws'),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    enabled: import.meta.client,
  })
}
