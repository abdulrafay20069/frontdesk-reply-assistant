import client from '../../api/client'
import type { InquirySummary, InquiryDetail, CreateInquiryPayload } from '../../types'

export async function fetchInquiries(status?: string): Promise<InquirySummary[]> {
  const params = status ? { status } : {}
  const res = await client.get('/inquiries', { params })
  return res.data
}

export async function fetchInquiry(id: string): Promise<InquiryDetail> {
  const res = await client.get(`/inquiries/${id}`)
  return res.data
}

export async function createInquiry(data: CreateInquiryPayload): Promise<InquirySummary> {
  const res = await client.post('/inquiries', data)
  return res.data
}
