import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { APP_SUPPORTED_THEMES, APP_STORAGE_KEYS, type AppSupportedTheme } from '@/constants'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const mode = ref<AppSupportedTheme>('system')
    const resolvedTheme = ref<Exclude<AppSupportedTheme, 'system'>>('light')

    const isDark = computed(() => resolvedTheme.value === 'dark')
    const isHighContrast = computed(() => resolvedTheme.value === 'high-contrast')

    function resolveTheme() {
      if (mode.value === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      if (mode.value === 'high-contrast') return 'high-contrast'
      return mode.value
    }

    function applyTheme(): void {
      resolvedTheme.value = resolveTheme()
      document.documentElement.setAttribute('data-theme', resolvedTheme.value)
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        const colors: Record<string, string> = {
          light: '#f8fafc',
          dark: '#0f172a',
          'high-contrast': '#000',
        }
        meta.setAttribute('content', colors[resolvedTheme.value])
      }
    }

    function setTheme(newMode: AppSupportedTheme): void {
      mode.value = newMode
      applyTheme()
    }

    function cycleTheme(): void {
      const modes = APP_SUPPORTED_THEMES.map((item) => item.mode)
      const idx = modes.indexOf(mode.value)
      setTheme(modes[(idx + 1) % modes.length])
    }

    function init(): void {
      applyTheme()
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (mode.value === 'system') applyTheme()
      })
    }

    watch(mode, applyTheme)

    return { mode, resolvedTheme, isDark, isHighContrast, setTheme, cycleTheme, init, applyTheme }
  },
  { persist: { key: APP_STORAGE_KEYS.THEME, pick: ['mode'] } },
)
