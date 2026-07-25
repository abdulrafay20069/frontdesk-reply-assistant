import client from '../../api/client'
import type { BusinessProfile, BusinessProfilePayload } from '../../types'

export async function fetchBusinessProfile(): Promise<BusinessProfile> {
  const res = await client.get('/api/business-profile')
  return res.data
}

export async function updateBusinessProfile(
  data: BusinessProfilePayload,
): Promise<BusinessProfile> {
  const res = await client.put('/api/business-profile', data)
  return res.data
}
