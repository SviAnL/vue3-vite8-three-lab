<script setup lang="ts">
  import { cn } from '@/utils'

  interface Props {
    title?: string
    hoverable?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    hoverable: true,
    padding: 'md',
  })

  const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  }
</script>

<template>
  <div
    :class="
      cn(
        'border-border bg-surface rounded-xl border transition-all duration-300',
        paddingMap[padding],
        hoverable && 'hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg',
      )
    "
  >
    <h3 v-if="title" class="text-foreground mb-3 text-lg font-semibold">
      {{ title }}
    </h3>
    <slot></slot>
  </div>
</template>
