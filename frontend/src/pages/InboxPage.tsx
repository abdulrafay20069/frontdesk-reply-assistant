import { useState } from 'react'
import { useInquiries } from '../features/inquiries/hooks'
import InquiryCard from '../components/InquiryCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import NewInquiryDrawer from '../components/NewInquiryDrawer'
import type { InquiryStatus } from '../types'

const statusTabs: { label: string; value: InquiryStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'New', value: 'NEW' },
  { label: 'Drafted', value: 'DRAFTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Sent', value: 'SENT' },
  { label: 'Failed', value: 'FAILED' },
]

function InboxPage() {
  const [activeStatus, setActiveStatus] = useState<InquiryStatus | undefined>(undefined)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: inquiries, isLoading, isError, refetch } = useInquiries(activeStatus)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Inbox</h1>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Inquiry
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-border-subtle mb-6 overflow-x-auto">
        {statusTabs.map((tab) => {
          const isActive = tab.value === activeStatus
          const count =
            tab.value === undefined
              ? undefined
              : inquiries?.filter((i) => i.status === tab.value).length
          return (
            <button
              key={tab.label}
              onClick={() => setActiveStatus(tab.value)}
              className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {count !== undefined && (
                <span className="ml-1.5 text-xs text-text-muted">({count})</span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {isError ? (
        <ErrorState message="Could not load inquiries." onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : inquiries && inquiries.length > 0 ? (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      ) : (
        <EmptyState message="No inquiries found." />
      )}

      {/* New Inquiry Drawer */}
      <NewInquiryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

export default InboxPage
