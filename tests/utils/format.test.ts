// tests/format.test.ts
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLocaleStore } from '@/stores'
import { formatDate, formatNumber, formatRelativeTime, formatDuration } from '@/utils'

describe('utils/format', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    // 固定当前时间：2026-09-17 00:00:00
    vi.setSystemTime(new Date('2026-09-17T00:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatDuration', () => {
    it('0秒 → 00:00', () => {
      expect(formatDuration(0)).toBe('00:00')
    })
    it('59秒 → 00:59', () => {
      expect(formatDuration(59)).toBe('00:59')
    })
    it('60秒 → 01:00', () => {
      expect(formatDuration(60)).toBe('01:00')
    })
    it('90秒 → 01:30', () => {
      expect(formatDuration(90)).toBe('01:30')
    })
    it('3661秒 → 61:01', () => {
      expect(formatDuration(3661)).toBe('61:01')
    })
  })

  describe('formatDate', () => {
    it('空输入返回空字符串', () => {
      expect(formatDate('')).toBe('')
    })

    it('zh-CN 语言格式化日期', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      const res = formatDate('2026-09-17')
      expect(res).toContain('2026')
      expect(res).toContain('9月')
      expect(res).toContain('17日')
    })

    it('en-US 语言格式化日期', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('en-US')
      const res = formatDate('2026-09-17')
      expect(res).toContain('2026')
      expect(res).toContain('September')
    })

    it('ko-KR 语言格式化日期', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('ko-KR')
      const res = formatDate('2026-09-17')
      expect(res).toContain('2026')
    })
  })

  describe('formatNumber', () => {
    it('zh-CN 数字格式化', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      expect(formatNumber(123456)).toBe('123,456')
    })
    it('en-US 数字格式化', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('en-US')
      expect(formatNumber(123456)).toBe('123,456')
    })
  })

  describe('formatRelativeTime', () => {
    it('10秒前', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      // 当前固定时间 2026-09-17 00:00:00
      const targetDate = '2026-09-16T23:59:50'
      expect(formatRelativeTime(targetDate)).toBe('10秒钟前')
    })

    it('5分钟前', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      const targetDate = '2026-09-16T23:55:00'
      expect(formatRelativeTime(targetDate)).toBe('5分钟前')
    })

    it('2小时前', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      const targetDate = '2026-09-16T22:00:00'
      expect(formatRelativeTime(targetDate)).toBe('2小时前')
    })

    it('3天前', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      const targetDate = '2026-09-14T00:00:00'
      expect(formatRelativeTime(targetDate)).toBe('3天前')
    })

    it('2个月前', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('zh-CN')
      const targetDate = '2026-07-17T00:00:00'
      expect(formatRelativeTime(targetDate)).toBe('2个月前')
    })

    it('英文环境相对时间', () => {
      const localeStore = useLocaleStore()
      localeStore.setLocale('en-US')
      const targetDate = '2026-09-16T23:59:50'
      expect(formatRelativeTime(targetDate)).toBe('10 seconds ago')
    })
  })
})
