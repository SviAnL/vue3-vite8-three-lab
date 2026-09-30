<script setup lang="ts">
  import BackTop from '@/components/common/BackTop.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import { KEEP_ALIVE_MAX } from '@/constants/app'
  import { useToastStore } from '@/stores'
  import type { ToastType } from '@/types/window-event'

  const route = useRoute()

  const { t } = useI18n()

  const appStore = useToastStore()

  const hasReadingProgress = computed(() => route.meta.hasProgress)

  const transitionName = computed(() => route.meta.transition)

  const toastClass = computed(() => {
    const map: Record<ToastType, string> = {
      error: 'bg-red-500',
      success: 'bg-emerald-500',
      warn: 'bg-amber-500',
      info: 'bg-sky-500',
    }
    return map[appStore.toastType]
  })

  watch(
    () => route.meta.titleKey,
    (key) => {
      if (key) {
        document.title = `${t(key)} | ${import.meta.env.VITE_APP_TITLE}`
      }
    },
    { immediate: true },
  )

  const cacheRoute = ref<string[]>([])

  watchEffect(() => {
    if (!route.meta.noKeepAlive && route.name && typeof route.name === 'string') {
      if (!cacheRoute.value.includes(route.name)) {
        cacheRoute.value.push(route.name)
      }
    }
  })
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- 导航栏 -->
    <AppHeader />

    <!-- 主内容 -->
    <main class="flex-1">
      <div class="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">
        <!-- 阅读进度条 -->
        <div v-if="hasReadingProgress" class="bg-border fixed top-16 left-0 z-20 h-0.5 w-full">
          <div
            class="bg-primary h-full origin-left animate-[reading-progress_linear] [animation-fill-mode:both] [animation-timeline:scroll(root)]"
          ></div>
        </div>

        <!-- 主应用 -->
        <RouterView v-slot="{ Component }">
          <Transition :name="transitionName" mode="out-in">
            <KeepAlive :include="cacheRoute" :max="KEEP_ALIVE_MAX">
              <component :is="Component" :key="route.path" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 回到顶部 -->
    <BackTop />

    <!-- 全局Toast提示 -->
    <Transition name="fade">
      <div
        v-if="appStore.showToast"
        role="alert"
        class="fixed top-4 left-1/2 z-500 -translate-x-1/2 rounded-lg px-6 py-3 text-white"
        :class="toastClass"
      >
        {{ appStore.toastMessage }}
      </div>
    </Transition>
  </div>
</template>
