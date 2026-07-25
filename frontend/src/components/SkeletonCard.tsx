function SkeletonCard() {
  return (
    <div className="rounded-xl bg-[#1a1a1f] border border-[#2e2e36] p-4">
      <div className="h-4 bg-[#222228] rounded animate-pulse w-1/3 mb-3" />
      <div className="h-3 bg-[#222228] rounded animate-pulse w-full mb-2" />
      <div className="h-3 bg-[#222228] rounded animate-pulse w-2/3" />
    </div>
  )
}

export default SkeletonCard
