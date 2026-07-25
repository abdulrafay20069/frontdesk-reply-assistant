import { useQuery } from '@tanstack/react-query'
import { fetchActivityLog } from './api'

export function useActivityLog(eventType?: string) {
  return useQuery({
    queryKey: ['activity-log', eventType],
    queryFn: () => fetchActivityLog(eventType),
    refetchInterval: 15_000,
  })
}
