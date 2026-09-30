<script setup lang="ts">
  import { APP_SUPPORTED_THEMES } from '@/constants'
  import { useThemeStore } from '@/stores'
  import { kebabToCamel } from '@/utils'

  const { t } = useI18n()

  const themeStore = useThemeStore()

  const currentIcon = computed(
    () => APP_SUPPORTED_THEMES.find((th) => th.mode === themeStore.mode)?.icon || '☀️',
  )
</script>

<template>
  <button
    class="hover:bg-surface-hover flex cursor-pointer items-center gap-1 rounded-lg p-2 transition-colors"
    :aria-label="t('theme.' + kebabToCamel(themeStore.mode))"
    :title="t('theme.' + kebabToCamel(themeStore.mode))"
    @click="themeStore.cycleTheme()"
  >
    <span class="text-lg" aria-hidden="true">{{ currentIcon }}</span>
  </button>
</template>
