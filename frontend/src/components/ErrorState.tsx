interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-16 mx-auto max-w-sm">
      <div className="bg-[#2e1a1a] border border-[#f87171] rounded-xl p-8 text-center">
        <span className="text-[#f87171] text-lg">&#10005;</span>
        <p className="mt-3 text-sm text-[#f87171]">{message}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm font-medium text-text-primary bg-surface-elevated border border-border-subtle rounded-lg hover:bg-surface transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default ErrorState
