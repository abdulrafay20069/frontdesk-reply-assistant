interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-16 mx-auto max-w-sm">
      <div className="bg-[rgba(244,114,114,0.1)] border border-error rounded-xl p-8 text-center">
        <span className="text-error text-lg">&#10005;</span>
        <p className="mt-3 text-[13px] text-error">{message || 'Something went wrong.'}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-[13px] font-medium text-text-primary bg-surface-elevated border border-border-subtle rounded-lg hover:bg-surface transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default ErrorState
