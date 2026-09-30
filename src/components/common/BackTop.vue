<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useBackTop } from '@/composables/useBackTop'

  const { visible, scrollToTop } = useBackTop()
</script>

<template>
  <Transition name="slide-up">
    <button
      v-show="visible"
      class="bg-primary hover:bg-primary/90 focus:ring-primary/50 fixed right-16 bottom-20 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-all hover:shadow-xl focus:ring-2 focus:outline-none max-sm:right-6 max-sm:bottom-6"
      aria-label="BackTop"
      @click="scrollToTop"
    >
      <Icon icon="mdi:arrow-up" />
    </button>
  </Transition>
</template>
