function SkeletonCard() {
  return (
    <div className="rounded-xl bg-surface border border-border p-3">
      <div className="h-4 bg-surface-elevated rounded animate-pulse w-1/3 mb-3" />
      <div className="h-3 bg-surface-elevated rounded animate-pulse w-full mb-2" />
      <div className="h-3 bg-surface-elevated rounded animate-pulse w-2/3" />
    </div>
  )
}

export default SkeletonCard
