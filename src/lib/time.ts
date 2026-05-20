import { formatDistanceToNowStrict } from 'date-fns'

// Compact "2m", "3h", "1d" style relative time for dense UI.
export function compactAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const full = formatDistanceToNowStrict(d, { addSuffix: false })
  return full
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' months', 'mo')
    .replace(' month', 'mo')
    .replace(' years', 'y')
    .replace(' year', 'y')
    .replace(/\s/g, '')
}
