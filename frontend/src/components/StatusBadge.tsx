import { motion } from 'framer-motion'
import type { InquiryStatus } from '../types'

const statusConfig: Record<InquiryStatus, { bg: string; text: string }> = {
  NEW: { bg: 'bg-surface-elevated', text: 'text-text-secondary' },
  DRAFTED: { bg: 'bg-accent/20', text: 'text-accent' },
  APPROVED: { bg: 'bg-success/20', text: 'text-success' },
  SENT: { bg: 'bg-success/20', text: 'text-success' },
  FAILED: { bg: 'bg-error/20', text: 'text-error' },
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const config = statusConfig[status]
  return (
    <motion.span
      key={status}
      initial={false}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-colors duration-200 ${config.bg} ${config.text}`}
    >
      {status}
    </motion.span>
  )
}

export default StatusBadge
