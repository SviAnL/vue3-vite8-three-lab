<script setup lang="ts">
  interface Props {
    fullscreen?: boolean
    text?: string
  }

  withDefaults(defineProps<Props>(), {
    fullscreen: false,
    text: '',
  })
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center',
      fullscreen ? 'bg-background/80 fixed inset-0 z-300 backdrop-blur-sm' : 'py-8',
    ]"
    role="status"
    :aria-label="text || 'BaseLoading'"
  >
    <div class="flex flex-col items-center gap-3">
      <div class="relative h-10 w-10">
        <div
          class="border-border border-t-primary absolute inset-0 animate-spin rounded-full border-4"
        ></div>
      </div>
      <p v-if="text" class="text-muted text-sm">
        {{ text }}
      </p>
    </div>
  </div>
</template>
