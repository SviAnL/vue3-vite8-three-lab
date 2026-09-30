import { useLocaleStore } from '@/stores'

/** 格式化日期 */
export function formatDate(date: string | Date): string {
  if (!date) return ''
  const localeStore = useLocaleStore()
  const locale = localeStore.locale
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** 格式化数字 */
export function formatNumber(num: number): string {
  const localeStore = useLocaleStore()
  const locale = localeStore.locale
  return new Intl.NumberFormat(locale).format(num)
}

/** 格式化相对时间 */
export function formatRelativeTime(date: string): string {
  const localeStore = useLocaleStore()
  const locale = localeStore.locale

  const now = Date.now()
  const target = new Date(date).getTime()
  const diff = now - target
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return rtf.format(-seconds, 'second')

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return rtf.format(-minutes, 'minute')

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')

  const days = Math.floor(hours / 24)
  if (days < 30) return rtf.format(-days, 'day')

  const months = Math.floor(days / 30)
  return rtf.format(-months, 'month')
}

/** 格式化时长 (秒 -> mm:ss) */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
