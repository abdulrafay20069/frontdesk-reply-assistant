import { Link } from 'react-router-dom'
import type { InquirySummary } from '../types'
import StatusBadge from './StatusBadge'
import { formatRelativeTime } from '../utils/time'

function InquiryCard({ inquiry }: { inquiry: InquirySummary }) {
  const preview =
    inquiry.messageText.length > 120
      ? inquiry.messageText.slice(0, 120) + '…'
      : inquiry.messageText

  return (
    <Link
      to={`/inquiries/${inquiry.id}`}
      className="block bg-surface border border-border-subtle rounded-lg p-3 hover:border-accent transition-colors duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-text-primary truncate leading-tight">
            {inquiry.customerName}
          </p>
          <p className="text-[13px] text-text-secondary mt-1 line-clamp-2 leading-tight">
            {preview}
          </p>
          <p className="text-[11px] text-text-muted mt-2">
            {formatRelativeTime(inquiry.receivedAt)}
          </p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>
    </Link>
  )
}

export default InquiryCard
