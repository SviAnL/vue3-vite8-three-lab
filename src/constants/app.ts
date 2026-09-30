/** KeepAlive最大缓存页面数量 */
export const KEEP_ALIVE_MAX = 5

/** Token 前缀 */
export const APP_TOKEN_PREFIX = 'Bearer '

/** 本地存储键名 */
export const APP_STORAGE_KEYS = {
  TOKEN: 'SVIANL_TOKEN',
  THEME: 'SVIANL_THEME',
  LOCALE: 'SVIANL_LOCALE',
  MUSIC: 'SVIANL_MUSIC',
}

/** 支持的语言 */
export const APP_SUPPORTED_LOCALES = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'EN' },
  { code: 'ko-KR', label: '한국어' },
] as const

/** 支持的语言类型 */
export type AppSupportedLocale = (typeof APP_SUPPORTED_LOCALES)[number]['code']

/** 支持的主题 */
export const APP_SUPPORTED_THEMES = [
  { mode: 'dark', label: 'theme.dark', icon: '🌙' },
  { mode: 'light', label: 'theme.light', icon: '☀️' },
  { mode: 'high-contrast', label: 'theme.highContrast', icon: '🔆' },
  { mode: 'system', label: 'theme.system', icon: '💻' },
] as const

/** 支持的主题类型 */
export type AppSupportedTheme = (typeof APP_SUPPORTED_THEMES)[number]['mode']

/** 导航菜单 */
export const APP_MAIN_NAV = [{ path: '/', label: 'nav.home' }]
