<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  interface Props {
    description?: string
    action?: string
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    action: '',
  })

  const emit = defineEmits<{ action: [] }>()

  const { t } = useI18n()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-16 text-center"
    role="status"
    aria-label="BaseEmpty"
  >
    <Icon class="h-22 w-22 opacity-30" aria-hidden="true" icon="mdi:inbox-outline" />

    <p class="text-foreground mb-2 text-base font-medium">
      <slot>{{ t('common.empty') }}</slot>
    </p>

    <p v-if="description" class="text-muted mb-4 text-sm">
      {{ description }}
    </p>

    <button
      v-if="action"
      class="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg px-4 py-2 text-white transition-colors"
      @click="emit('action')"
    >
      {{ action }}
    </button>
  </div>
</template>
