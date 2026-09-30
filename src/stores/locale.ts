import { defineStore } from 'pinia'
import { ref } from 'vue'
import { APP_SUPPORTED_LOCALES, APP_STORAGE_KEYS, type AppSupportedLocale } from '@/constants'
import { i18n } from '@/locales/setup'

export const useLocaleStore = defineStore(
  'locale',
  () => {
    const locale = ref<AppSupportedLocale>('zh-CN')

    function detectBrowserLocale(): AppSupportedLocale {
      const browserLang = navigator.language
      if (browserLang.startsWith('zh')) return 'zh-CN'
      if (browserLang.startsWith('ko')) return 'ko-KR'
      return 'en-US'
    }

    function setLocale(newLocale: AppSupportedLocale): void {
      locale.value = newLocale
      i18n.global.locale.value = newLocale
      document.documentElement.lang = newLocale
    }

    function init(): void {
      const stored = localStorage.getItem(APP_STORAGE_KEYS.LOCALE)
      if (stored) {
        const locale = JSON.parse(stored).locale as AppSupportedLocale
        const locales = APP_SUPPORTED_LOCALES.map((item) => item.code)
        if (locales.includes(locale)) {
          setLocale(locale)
          return
        }
      }
      setLocale(detectBrowserLocale())
    }

    return { locale, setLocale, init, detectBrowserLocale }
  },
  { persist: { key: APP_STORAGE_KEYS.LOCALE, pick: ['locale'] } },
)
