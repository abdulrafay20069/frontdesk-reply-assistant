import client from '../../api/client'
import type { Reply } from '../../types'

export async function generateDraft(inquiryId: string): Promise<Reply> {
  const res = await client.post(`/api/inquiries/${inquiryId}/draft`)
  return res.data
}

export async function updateDraft(replyId: string, draftText: string): Promise<Reply> {
  const res = await client.put(`/api/replies/${replyId}`, { draftText })
  return res.data
}

export async function approveReply(replyId: string): Promise<Reply> {
  const res = await client.post(`/api/replies/${replyId}/approve`)
  return res.data
}

export async function sendReply(replyId: string): Promise<Reply> {
  const res = await client.post(`/api/replies/${replyId}/send`)
  return res.data
}
