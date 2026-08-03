import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useCreateInquiry } from '../features/inquiries/hooks'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { InquiryChannel } from '../types'

interface Props {
  open: boolean
  onClose: () => void
}

const channels: { value: InquiryChannel; label: string }[] = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'WEB_FORM', label: 'Web Form' },
  { value: 'MANUAL', label: 'Manual' },
]

function NewInquiryDrawer({ open, onClose }: Props) {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [channel, setChannel] = useState<InquiryChannel>('EMAIL')
  const [messageText, setMessageText] = useState('')
  const createMutation = useCreateInquiry()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { customerName, customerEmail, channel, messageText },
      {
        onSuccess: () => {
          setCustomerName('')
          setCustomerEmail('')
          setChannel('EMAIL')
          setMessageText('')
          onClose()
        },
      },
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.22, ease: isMobile ? 'easeOut' : 'easeOut' }}
            className={`fixed z-50 bg-surface ${
              isMobile
                ? 'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl border-t border-border-subtle overflow-y-auto'
                : 'top-0 right-0 h-full w-[400px] max-w-full border-l border-border-subtle'
            }`}
          >
            {isMobile && (
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 rounded-full bg-border" />
              </div>
            )}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-text-primary">New Inquiry</h2>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Customer name</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Customer email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Channel</label>
                <div className="flex gap-2">
                  {channels.map((ch) => (
                    <button
                      key={ch.value}
                      type="button"
                      onClick={() => setChannel(ch.value)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                        channel === ch.value
                          ? 'bg-accent text-white'
                          : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-[13px] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-[13px] font-medium rounded-lg transition-colors"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Inquiry'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NewInquiryDrawer
