<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { cn } from '@/utils'

  type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  type ButtonSize = 'sm' | 'md' | 'lg'

  interface Props {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
    type: 'button',
  })

  const emit = defineEmits<{ click: [event: MouseEvent] }>()

  const classes = computed(() => {
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border border-border bg-transparent hover:bg-surface-hover text-foreground',
      ghost: 'bg-transparent hover:bg-surface-hover text-foreground',
      danger: 'bg-error text-white hover:bg-error/90',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
    }

    return cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variants[props.variant],
      sizes[props.size],
      props.block && 'w-full',
    )
  })

  function handleClick(e: MouseEvent) {
    if (!props.disabled && !props.loading) emit('click', e)
  }
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading" @click="handleClick">
    <Icon v-if="loading" icon="ri:loader-4-line" class="h-4 w-4 animate-spin" aria-hidden="true" />
    <slot></slot>
  </button>
</template>
