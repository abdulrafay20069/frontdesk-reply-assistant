export type InquiryStatus = 'NEW' | 'DRAFTED' | 'APPROVED' | 'SENT' | 'FAILED'

export type InquiryChannel = 'EMAIL' | 'WEB_FORM' | 'MANUAL'

export type ActivityEventType =
  | 'DRAFT_GENERATED'
  | 'DRAFT_EDITED'
  | 'REPLY_APPROVED'
  | 'REPLY_SENT'
  | 'GENERATION_FAILED'

export type BusinessProfileTone =
  | 'WARM_FRIENDLY'
  | 'FORMAL_PROFESSIONAL'
  | 'DIRECT_EFFICIENT'

export interface InquirySummary {
  id: string
  customerName: string
  customerEmail: string
  channel: InquiryChannel
  messageText: string
  receivedAt: string
  status: InquiryStatus
}

export interface Reply {
  id: string
  inquiryId: string
  draftText: string | null
  aiModelUsed: string | null
  generatedAt: string | null
  lastEditedByUserId: string | null
  approvedAt: string | null
  approvedByUserId: string | null
  sentAt: string | null
}

export interface InquiryDetail {
  id: string
  customerName: string
  customerEmail: string
  channel: InquiryChannel
  messageText: string
  receivedAt: string
  status: InquiryStatus
  reply: Reply | null
}

export interface BusinessProfile {
  id: string
  businessName: string
  description: string | null
  tone: BusinessProfileTone
  faqContext: string | null
  updatedAt: string
}

export interface ActivityLogEntry {
  id: string
  eventType: ActivityEventType
  relatedEntityType: string | null
  relatedEntityId: string | null
  actorUserId: string | null
  actorFullName: string | null
  timestamp: string
  detailText: string | null
}

export interface BusinessProfilePayload {
  businessName: string
  description: string | null
  tone: BusinessProfileTone
  faqContext: string | null
}

export interface CreateInquiryPayload {
  customerName: string
  customerEmail: string
  channel: InquiryChannel
  messageText: string
}
