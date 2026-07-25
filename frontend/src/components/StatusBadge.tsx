import type { InquiryStatus } from '../types'

const statusConfig: Record<InquiryStatus, { bg: string; text: string }> = {
  NEW: { bg: 'bg-[#222228]', text: 'text-text-secondary' },
  DRAFTED: { bg: 'bg-accent/20', text: 'text-accent' },
  APPROVED: { bg: 'bg-success/20', text: 'text-success' },
  SENT: { bg: 'bg-success/20', text: 'text-success' },
  FAILED: { bg: 'bg-error/20', text: 'text-error' },
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
