import client from '../../api/client'
import type { BusinessProfile, BusinessProfilePayload } from '../../types'

export async function fetchBusinessProfile(): Promise<BusinessProfile> {
  const res = await client.get('/business-profile')
  return res.data
}

export async function updateBusinessProfile(
  data: BusinessProfilePayload,
): Promise<BusinessProfile> {
  const res = await client.put('/business-profile', data)
  return res.data
}
