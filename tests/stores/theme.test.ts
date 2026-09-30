import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { APP_SUPPORTED_THEMES } from '@/constants'
import { useThemeStore } from '@/stores'

function mockPrefersDark(isDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? isDark : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    mockPrefersDark(false)
  })

  it('初始mode为system，系统亮色时resolvedTheme=light', () => {
    const themeStore = useThemeStore()
    themeStore.init()
    expect(themeStore.mode).toBe('system')
    expect(themeStore.resolvedTheme).toBe('light')
    expect(themeStore.isDark).toBe(false)
    expect(themeStore.isHighContrast).toBe(false)
  })

  it('系统暗色，mode=system → resolvedTheme=dark', () => {
    mockPrefersDark(true)
    const themeStore = useThemeStore()
    themeStore.init()
    expect(themeStore.resolvedTheme).toBe('dark')
    expect(themeStore.isDark).toBe(true)
  })

  it('setTheme 设置 dark，resolvedTheme=dark', () => {
    const themeStore = useThemeStore()
    themeStore.setTheme('dark')
    expect(themeStore.mode).toBe('dark')
    expect(themeStore.resolvedTheme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('setTheme 设置 high-contrast，resolvedTheme=high-contrast', () => {
    const themeStore = useThemeStore()
    themeStore.setTheme('high-contrast')
    expect(themeStore.resolvedTheme).toBe('high-contrast')
    expect(themeStore.isHighContrast).toBe(true)
  })

  it('cycleTheme 循环切换主题', () => {
    const themeStore = useThemeStore()
    const modes = APP_SUPPORTED_THEMES.map((i) => i.mode)
    expect(themeStore.mode).toBe('system')
    themeStore.cycleTheme()
    expect(themeStore.mode).toBe(modes[(modes.indexOf('system') + 1) % modes.length])
  })

  it('applyTheme 设置 meta theme-color', () => {
    const themeStore = useThemeStore()
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)

    themeStore.setTheme('dark')
    expect(meta.content).toBe('#0f172a')

    themeStore.setTheme('light')
    expect(meta.content).toBe('#f8fafc')

    themeStore.setTheme('high-contrast')
    expect(meta.content).toBe('#000')
  })

  it('init 注册系统暗色模式监听事件', () => {
    const mockMediaQueryList = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    window.matchMedia = vi.fn().mockImplementation(() => mockMediaQueryList)

    const themeStore = useThemeStore()
    themeStore.init()

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalled()
  })
})
