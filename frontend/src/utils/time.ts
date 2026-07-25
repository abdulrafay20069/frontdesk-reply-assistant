const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diff = now - date

  if (diff < 0) return 'just now'
  if (diff < MINUTE) return 'just now'
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  const days = Math.floor(diff / DAY)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function groupByDate<T extends { timestamp: string }>(
  items: T[],
): { label: string; items: T[] }[] {
  const groups: Map<string, T[]> = new Map()

  for (const item of items) {
    const date = new Date(item.timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateKey = date.toDateString()
    const todayKey = today.toDateString()
    const yesterdayKey = yesterday.toDateString()

    let label: string
    if (dateKey === todayKey) {
      label = 'Today'
    } else if (dateKey === yesterdayKey) {
      label = 'Yesterday'
    } else {
      label = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const group = groups.get(label) || []
    group.push(item)
    groups.set(label, group)
  }

  const order = ['Today', 'Yesterday']
  return Array.from(groups.entries())
    .sort((a, b) => {
      const ai = order.indexOf(a[0])
      const bi = order.indexOf(b[0])
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return b[0].localeCompare(a[0])
    })
    .map(([label, items]) => ({ label, items }))
}
