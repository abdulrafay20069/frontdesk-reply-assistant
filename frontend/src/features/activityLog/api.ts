import client from '../../api/client'
import type { ActivityLogEntry } from '../../types'

export async function fetchActivityLog(eventType?: string): Promise<ActivityLogEntry[]> {
  const params = eventType ? { eventType } : {}
  const res = await client.get('/api/activity-log', { params })
  return res.data
}
