import { useState, useEffect } from 'react'
import { useBusinessProfile, useUpdateBusinessProfile } from '../features/profile/hooks'
import ErrorState from '../components/ErrorState'
import type { BusinessProfileTone } from '../types'

const toneOptions: {
  value: BusinessProfileTone
  label: string
  description: string
  example: string
}[] = [
  {
    value: 'WARM_FRIENDLY',
    label: 'Warm & Friendly',
    description: 'Warm, friendly, and conversational',
    example: '"We\'d love to help with that!"',
  },
  {
    value: 'FORMAL_PROFESSIONAL',
    label: 'Formal & Professional',
    description: 'Formal, professional, and precise',
    example: '"We appreciate your inquiry."',
  },
  {
    value: 'DIRECT_EFFICIENT',
    label: 'Direct & Efficient',
    description: 'Direct, efficient, and to the point',
    example: '"Your request has been processed."',
  },
]

function SettingsPage() {
  const { data: profile, isLoading, isError, refetch } = useBusinessProfile()
  const updateMutation = useUpdateBusinessProfile()

  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [tone, setTone] = useState<BusinessProfileTone>('WARM_FRIENDLY')
  const [faqContext, setFaqContext] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName)
      setDescription(profile.description ?? '')
      setTone(profile.tone)
      setFaqContext(profile.faqContext ?? '')
    }
  }, [profile])

  const handleSave = () => {
    updateMutation.mutate(
      { businessName, description: description || null, tone, faqContext: faqContext || null },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        },
      },
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <ErrorState message="Could not load business profile." onRetry={refetch} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 animate-pulse">
        <div className="mx-auto max-w-[640px] space-y-6">
          <div className="h-6 bg-[#222228] rounded w-48" />
          <div className="h-4 bg-[#222228] rounded w-72" />
          <div className="h-12 bg-[#222228] rounded-lg w-full" />
          <div className="h-20 bg-[#222228] rounded-lg w-full" />
          <div className="h-24 bg-[#222228] rounded-lg w-full" />
          <div className="h-40 bg-[#222228] rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-[640px]">
        <h1 className="text-2xl font-semibold text-text-primary">Business Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Configure how the AI represents your business.
        </p>

        <div className="mt-8 space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Tone
            </label>
            <div className="flex gap-3">
              {toneOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTone(opt.value)}
                  className={`flex-1 p-4 rounded-xl border text-left transition-all duration-150 ${
                    tone === opt.value
                      ? 'border-[#7c6af7] bg-[#1c1a2e]'
                      : 'border-border-subtle bg-surface hover:border-accent/50'
                  }`}
                >
                  <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                  <p className="text-xs text-text-secondary mt-1">{opt.description}</p>
                  <p className="text-xs text-text-muted italic mt-1">{opt.example}</p>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Context */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              FAQ Context
            </label>
            <textarea
              value={faqContext}
              onChange={(e) => setFaqContext(e.target.value)}
              rows={8}
              placeholder="Q: What are your business hours?&#10;A: We're open Monday through Friday, 9am to 5pm.&#10;&#10;Q: Do you offer refunds?&#10;A: Yes, within 30 days of purchase."
              className="w-full px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              saved
                ? 'bg-success/20 text-success'
                : 'bg-accent hover:bg-accent-hover text-white disabled:opacity-60'
            }`}
          >
            {updateMutation.isPending
              ? 'Saving...'
              : saved
                ? 'Saved \u2713'
                : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
