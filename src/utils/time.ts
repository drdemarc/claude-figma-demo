export function formatTimeAgo(pubDate: string): string {
  const now = Date.now()
  const then = new Date(pubDate).getTime()
  const diffMs = now - then

  if (isNaN(then)) return ''

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
