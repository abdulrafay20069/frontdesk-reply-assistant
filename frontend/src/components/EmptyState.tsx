function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="opacity-30"
      >
        <rect x="20" y="30" width="80" height="60" rx="8" stroke="#d4a574" strokeWidth="2" fill="none" />
        <line x1="30" y1="48" x2="90" y2="48" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="60" x2="70" y2="60" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="72" x2="55" y2="72" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
        <circle cx="85" cy="85" r="18" stroke="#d4a574" strokeWidth="2" fill="none" />
        <line x1="98" y1="98" x2="108" y2="108" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="mt-4 text-text-secondary text-[13px]">{message}</p>
    </div>
  )
}

export default EmptyState
