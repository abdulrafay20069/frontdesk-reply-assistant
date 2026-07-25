import { useState } from 'react'
import { useActivityLog } from '../features/activityLog/hooks'
import { formatRelativeTime, groupByDate } from '../utils/time'
import ErrorState from '../components/ErrorState'
import type { ActivityEventType } from '../types'

const eventFilters: { label: string; value: ActivityEventType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Draft Generated', value: 'DRAFT_GENERATED' },
  { label: 'Draft Edited', value: 'DRAFT_EDITED' },
  { label: 'Approved', value: 'REPLY_APPROVED' },
  { label: 'Sent', value: 'REPLY_SENT' },
  { label: 'Failed', value: 'GENERATION_FAILED' },
]

const eventIcons: Record<ActivityEventType, string> = {
  DRAFT_GENERATED: '\u2726',
  DRAFT_EDITED: '\u270E',
  REPLY_APPROVED: '\u2713',
  REPLY_SENT: '\u279E',
  GENERATION_FAILED: '\u2715',
}

function describe(event: { eventType: ActivityEventType; actorFullName: string | null; relatedEntityType: string | null; relatedEntityId: string | null; detailText: string | null }): string {
  const actor = event.actorFullName || 'A user'
  switch (event.eventType) {
    case 'DRAFT_GENERATED':
      return `${actor} generated a draft reply for ${event.relatedEntityType ?? 'inquiry'} ${event.relatedEntityId ?? ''}`
    case 'DRAFT_EDITED':
      return `${actor} edited the draft reply`
    case 'REPLY_APPROVED':
      return `${actor} approved the reply`
    case 'REPLY_SENT':
      return `${actor} marked the reply as sent`
    case 'GENERATION_FAILED':
      return `Draft generation failed \u2014 ${event.detailText ?? 'unknown error'}`
  }
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-5 h-5 bg-[#222228] rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-[#222228] rounded w-1/3" />
        <div className="h-3 bg-[#222228] rounded w-2/3" />
      </div>
      <div className="h-3 bg-[#222228] rounded w-16 shrink-0" />
    </div>
  )
}

function ActivityLogPage() {
  const [filter, setFilter] = useState<ActivityEventType | undefined>(undefined)
  const { data: logs, isLoading, isError, refetch } = useActivityLog(filter)

  const groups = logs ? groupByDate(logs) : []

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-1">Activity Log</h1>
      <p className="text-sm text-text-secondary mb-6">
        Track all actions taken in the system.
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {eventFilters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-[#7c6af7] text-white'
                : 'bg-[#222228] text-[#8b8b9e] hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isError ? (
        <ErrorState message="Could not load activity log." onRetry={refetch} />
      ) : isLoading ? (
        <div className="bg-[#1a1a1f] border border-[#2e2e36] rounded-lg divide-y divide-[#2e2e36]">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : logs && logs.length > 0 ? (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs text-text-muted uppercase text-center mb-2">
                {group.label}
              </p>
              <div className="bg-[#1a1a1f] border border-[#2e2e36] rounded-lg divide-y divide-[#2e2e36]">
                {group.items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 px-4 py-3"
                  >
                    <span className="text-sm text-text-secondary shrink-0 mt-0.5">
                      {eventIcons[entry.eventType]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {entry.actorFullName || 'System'}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {describe(entry)}
                      </p>
                    </div>
                    <span className="text-xs text-text-muted shrink-0 whitespace-nowrap mt-0.5">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            className="opacity-20"
          >
            <line x1="20" y1="30" x2="100" y2="30" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="70" x2="90" y2="70" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="90" x2="60" y2="90" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="mt-4 text-sm text-text-secondary">
            Nothing logged yet. Actions you take will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default ActivityLogPage
