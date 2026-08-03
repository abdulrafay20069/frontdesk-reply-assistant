import { AlertCircle, CheckCircle2, PencilLine, Send, Sparkles } from 'lucide-react'
import { useState, type ReactNode } from 'react'
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

const eventIcons: Record<ActivityEventType, ReactNode> = {
  DRAFT_GENERATED: <Sparkles size={16} strokeWidth={1.5} className="text-accent" />,
  DRAFT_EDITED: <PencilLine size={16} strokeWidth={1.5} className="text-accent" />,
  REPLY_APPROVED: <CheckCircle2 size={16} strokeWidth={1.5} className="text-success" />,
  REPLY_SENT: <Send size={16} strokeWidth={1.5} className="text-accent" />,
  GENERATION_FAILED: <AlertCircle size={16} strokeWidth={1.5} className="text-error" />,
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
      <div className="w-5 h-5 bg-surface-elevated rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-surface-elevated rounded w-1/3" />
        <div className="h-3 bg-surface-elevated rounded w-2/3" />
      </div>
      <div className="h-3 bg-surface-elevated rounded w-16 shrink-0" />
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
      <p className="text-[13px] text-text-secondary mb-4">
        Track all actions taken in the system.
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {eventFilters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-accent text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
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
        <div className="bg-surface border border-border rounded-lg divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : logs && logs.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-[11px] text-text-muted uppercase text-center mb-2">
                {group.label}
              </p>
              <div className="bg-surface border border-border rounded-lg divide-y divide-border">
                {group.items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 px-4 py-2"
                  >
                    <span className="shrink-0 mt-0.5">
                      {eventIcons[entry.eventType]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary truncate">
                        {entry.actorFullName || 'System'}
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        {describe(entry)}
                      </p>
                    </div>
                    <span className="text-[11px] text-text-muted shrink-0 whitespace-nowrap mt-0.5">
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
            <line x1="20" y1="30" x2="100" y2="30" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="70" x2="90" y2="70" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="90" x2="60" y2="90" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="mt-4 text-[13px] text-text-secondary">
            No activity yet.
          </p>
        </div>
      )}
    </div>
  )
}

export default ActivityLogPage
