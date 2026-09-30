<script setup lang="ts">
  import { APP_SUPPORTED_LOCALES } from '@/constants'
  import { useLocaleStore } from '@/stores'

  const localeStore = useLocaleStore()
</script>

<template>
  <div class="border-border flex items-center gap-1 rounded-lg border p-1">
    <button
      v-for="loc in APP_SUPPORTED_LOCALES"
      :key="loc.code"
      class="cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors"
      :class="
        localeStore.locale === loc.code
          ? 'bg-primary text-white'
          : 'text-muted hover:text-foreground'
      "
      :aria-pressed="localeStore.locale === loc.code"
      @click="localeStore.setLocale(loc.code)"
    >
      {{ loc.label }}
    </button>
  </div>
</template>
