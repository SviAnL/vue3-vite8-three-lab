import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { APP_STORAGE_KEYS } from '@/constants'
import { useLocaleStore } from '@/stores'

// mock i18n
vi.mock('@/locales/setup', () => ({
  i18n: {
    global: {
      locale: {
        value: 'zh-CN',
      },
    },
  },
}))

describe('Locale Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    // 清空localStorage
    localStorage.clear()
  })

  describe('detectBrowserLocale', () => {
    it('浏览器语言 zh 开头 → 返回 zh-CN', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'zh-CN',
      })
      const store = useLocaleStore()
      expect(store.detectBrowserLocale()).toBe('zh-CN')
    })

    it('浏览器语言 ko 开头 → 返回 ko-KR', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'ko-KR',
      })
      const store = useLocaleStore()
      expect(store.detectBrowserLocale()).toBe('ko-KR')
    })

    it('其他语言 → 默认 en-US', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'ja-JP',
      })
      const store = useLocaleStore()
      expect(store.detectBrowserLocale()).toBe('en-US')
    })
  })

  describe('setLocale', () => {
    it('设置语言，同步更新i18n和html lang属性', () => {
      const store = useLocaleStore()
      store.setLocale('ko-KR')
      expect(store.locale).toBe('ko-KR')
      expect(document.documentElement.lang).toBe('ko-KR')
    })
  })

  describe('init', () => {
    it('本地存储存在合法语言，读取并设置', () => {
      localStorage.setItem(APP_STORAGE_KEYS.LOCALE, JSON.stringify({ locale: 'ko-KR' }))
      const store = useLocaleStore()
      store.init()
      expect(store.locale).toBe('ko-KR')
    })

    it('本地存储的语言不存在支持列表，自动探测浏览器语言', () => {
      localStorage.setItem(APP_STORAGE_KEYS.LOCALE, JSON.stringify({ locale: 'ja-JP' }))
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-US',
      })
      const store = useLocaleStore()
      store.init()
      expect(store.locale).toBe('en-US')
    })

    it('本地存储为空，自动探测浏览器语言', () => {
      localStorage.removeItem(APP_STORAGE_KEYS.LOCALE)
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'zh-CN',
      })
      const store = useLocaleStore()
      store.init()
      expect(store.locale).toBe('zh-CN')
    })
  })
})
