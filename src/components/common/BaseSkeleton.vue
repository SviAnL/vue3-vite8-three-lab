<script setup lang="ts">
  interface Props {
    lines?: number
  }

  const props = withDefaults(defineProps<Props>(), { lines: 3 })

  const displayLines = computed(() => {
    const num = props.lines ?? 1
    return num < 1 ? 0 : num - 1
  })
</script>

<template>
  <div class="animate-pulse space-y-3" role="status">
    <div class="bg-surface-hover h-36 rounded-xl"></div>
    <div class="bg-surface-hover h-6 w-3/4 rounded"></div>
    <div v-for="i in displayLines" :key="i" class="bg-surface-hover h-3 rounded"></div>
  </div>
</template>
