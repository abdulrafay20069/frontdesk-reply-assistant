import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useInquiry } from '../features/inquiries/hooks'
import {
  useGenerateDraft,
  useUpdateDraft,
  useApproveReply,
  useSendReply,
} from '../features/replies/hooks'
import ErrorState from '../components/ErrorState'
import StatusBadge from '../components/StatusBadge'
import { formatRelativeTime } from '../utils/time'

const cyclingMessages = ['Reading inquiry...', 'Writing draft...', 'Reviewing tone...']

function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: inquiry, isLoading, isError, refetch } = useInquiry(id!)

  const generateDraftMutation = useGenerateDraft()
  const updateDraftMutation = useUpdateDraft()
  const approveReplyMutation = useApproveReply()
  const sendReplyMutation = useSendReply()

  const [draftText, setDraftText] = useState('')
  const [draftChanged, setDraftChanged] = useState(false)
  const [cycleIndex, setCycleIndex] = useState(0)

  const cycleRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (generateDraftMutation.isPending) {
      cycleRef.current = setInterval(() => {
        setCycleIndex((i) => (i + 1) % cyclingMessages.length)
      }, 800)
    } else {
      if (cycleRef.current) clearInterval(cycleRef.current)
      setCycleIndex(0)
    }
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current)
    }
  }, [generateDraftMutation.isPending])

  useEffect(() => {
    if (inquiry?.reply?.draftText) {
      setDraftText(inquiry.reply.draftText)
    } else {
      setDraftText('')
    }
    setDraftChanged(false)
  }, [inquiry?.reply?.draftText])

  const handleGenerateDraft = () => {
    if (!id) return
    generateDraftMutation.mutate(id)
  }

  const handleSaveDraft = () => {
    if (!inquiry?.reply?.id) return
    updateDraftMutation.mutate(
      { replyId: inquiry.reply.id, draftText },
      { onSuccess: () => setDraftChanged(false) },
    )
  }

  const handleApprove = () => {
    if (!inquiry?.reply?.id) return
    approveReplyMutation.mutate(inquiry.reply.id)
  }

  const handleSend = () => {
    if (!inquiry?.reply?.id) return
    sendReplyMutation.mutate(inquiry.reply.id)
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <ErrorState message="Could not load this inquiry." onRetry={refetch} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 animate-pulse">
        <div className="h-4 bg-surface-elevated rounded w-24 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <div className="h-5 bg-surface-elevated rounded w-3/4" />
              <div className="h-4 bg-surface-elevated rounded w-full" />
              <div className="h-4 bg-surface-elevated rounded w-2/3" />
            </div>
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="h-32 bg-surface-elevated rounded w-full" />
            </div>
            <div className="flex gap-3">
              <div className="bg-surface-elevated rounded h-8 w-24" />
              <div className="bg-surface-elevated rounded h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <p className="text-text-secondary">Inquiry not found.</p>
      </div>
    )
  }

  const reply = inquiry.reply
  const isGenerating = generateDraftMutation.isPending

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Back link */}
      <Link
        to="/inbox"
        className="inline-flex items-center gap-1 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Inbox
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left column — customer info */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border-subtle rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                {inquiry.customerName}
              </h2>
              <StatusBadge status={inquiry.status} />
            </div>
            <p className="text-[13px] text-text-primary leading-relaxed whitespace-pre-wrap">
              {inquiry.messageText}
            </p>

            {/* Metadata chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              <div className="px-3 py-1.5 bg-surface-elevated rounded-lg text-xs text-text-secondary">
                {inquiry.customerEmail}
              </div>
              <div className="px-3 py-1.5 bg-surface-elevated rounded-lg text-xs text-text-secondary">
                {inquiry.channel.replace('_', ' ')}
              </div>
              <div className="px-3 py-1.5 bg-surface-elevated rounded-lg text-xs text-text-secondary">
                {formatRelativeTime(inquiry.receivedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Right column — reply area */}
        <div className="md:col-span-3">
          <div className="bg-surface border border-border-subtle rounded-lg p-6">
            {/* State: NEW or FAILED — no reply yet */}
            {(inquiry.status === 'NEW' || inquiry.status === 'FAILED') && (
              <div className="flex flex-col items-center justify-center py-12">
                {inquiry.status === 'FAILED' && (
                  <div className="w-full mb-6 p-4 border border-error/50 rounded-lg bg-error/5">
                    <p className="text-[13px] text-error">
                      The AI generation failed. Please try again.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleGenerateDraft}
                  disabled={isGenerating}
                  className="px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-[13px] font-medium rounded-lg transition-colors"
                >
                  {isGenerating ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="draft-dot" />
                      <span className="draft-dot" />
                      <span className="draft-dot" />
                      <span>{cyclingMessages[cycleIndex]}</span>
                    </span>
                  ) : (
                    'Generate Draft'
                  )}
                </button>
                <p className="mt-3 text-[11px] text-text-muted text-center max-w-xs">
                  Draft a reply using your saved tone.
                </p>
              </div>
            )}

            {/* State: DRAFTED — editable textarea */}
            {(inquiry.status === 'DRAFTED' || inquiry.status === 'APPROVED') && reply && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <textarea
                  value={draftText}
                  onChange={(e) => {
                    setDraftText(e.target.value)
                    setDraftChanged(true)
                  }}
                  rows={8}
                  className="w-full px-4 py-3 bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    {inquiry.status === 'DRAFTED' && (
                      <button
                        onClick={handleSaveDraft}
                        disabled={!draftChanged || updateDraftMutation.isPending}
                        className="px-4 py-1.5 bg-surface-elevated border border-border-subtle hover:border-accent text-text-primary text-[13px] font-medium rounded-lg transition-colors disabled:opacity-40"
                      >
                        {updateDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
                      </button>
                    )}
                    {inquiry.status === 'DRAFTED' && (
                      <button
                        onClick={handleApprove}
                        disabled={approveReplyMutation.isPending}
                        className="px-4 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-[13px] font-medium rounded-lg transition-colors"
                      >
                        {approveReplyMutation.isPending ? 'Approving...' : 'Approve'}
                      </button>
                    )}
                    {inquiry.status === 'APPROVED' && (
                      <button
                        onClick={handleSend}
                        disabled={sendReplyMutation.isPending}
                        className="px-4 py-1.5 bg-success hover:opacity-90 disabled:opacity-60 text-white text-[13px] font-medium rounded-lg transition-colors"
                      >
                        {sendReplyMutation.isPending ? 'Sending...' : 'Send'}
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-text-muted">
                    {draftText.length} characters
                  </span>
                </div>

                {/* Last edited */}
                {reply.lastEditedByUserId && (
                  <p className="mt-3 text-xs text-text-muted">
                    Last edited {reply.generatedAt ? formatRelativeTime(reply.generatedAt) : ''}
                  </p>
                )}
              </motion.div>
            )}

            {/* State: SENT — read-only */}
            {inquiry.status === 'SENT' && reply && (
              <div>
                {/* Checkmark */}
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7.5L6 10.5L11 4" stroke="#6ee7a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.18, delay: 0.1, ease: 'easeOut' }}
                    className="text-[13px] font-medium text-success"
                  >
                    Reply sent
                  </motion.span>
                </div>

                <div className="w-full px-4 py-3 bg-surface-elevated border border-border-subtle rounded-lg text-[13px] text-text-primary resize-none opacity-70">
                  {draftText}
                </div>

                {reply.sentAt && (
                  <p className="mt-3 text-xs text-text-muted">
                    Sent {formatRelativeTime(reply.sentAt)}
                  </p>
                )}

                <Link
                  to="/inbox"
                  className="inline-block mt-6 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-[13px] font-medium rounded-lg transition-colors"
                >
                  Back to Inbox
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InquiryDetailPage
