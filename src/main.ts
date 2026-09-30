import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { initWebVitals } from '@/utils/webVitals'
import App from './App.vue'
import { setupDirectives } from './directives'
import { i18n } from './locales/setup'
import router from './router'
import { useThemeStore, useLocaleStore, useToastStore } from './stores'
import type { ToastDetail } from '@/types/window-event'
import './styles/index.css'

// MSW 初始化
if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
  const { worker } = await import(/* webpackChunkName: "msw-mock-worker" */ './mock/browser')
  const baseUrl = import.meta.env.VITE_APP_BASE_URL ?? '/'
  // 去掉末尾斜杠
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const workerScriptUrl = `${normalizedBase}/mockServiceWorker.js`

  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: {
      url: workerScriptUrl,
    },
  })
}

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)

setupDirectives(app)

const themeStore = useThemeStore()

const localeStore = useLocaleStore()

const appStore = useToastStore()

themeStore.init()

localeStore.init()

window.addEventListener('app:toast', (e: CustomEvent<ToastDetail>) => {
  appStore.openToast(e.detail)
})

app.mount('#app')

// 应用挂载后初始化性能监控
initWebVitals()
