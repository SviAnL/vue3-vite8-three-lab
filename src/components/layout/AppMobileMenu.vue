<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  interface Props {
    navItems: {
      path: string
      label: string
    }[]
    isActive: (path: string) => boolean
  }

  defineProps<Props>()

  defineEmits(['closeMenu'])
</script>

<template>
  <div class="fixed inset-0 z-1000 lg:hidden" @click="$emit('closeMenu')">
    <div class="absolute inset-0 bg-black/50"></div>

    <aside
      class="bg-surface absolute top-0 right-0 h-full w-72 p-6 shadow-xl"
      role="dialog"
      aria-label="Mobile menu"
      @click.stop
    >
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold">Menu</span>
        <button class="text-2xl" aria-label="Close menu" @click="$emit('closeMenu')">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <LangSwitch class="my-4" />

      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-foreground'"
          class="hover:bg-surface-hover rounded-lg px-4 py-3 text-base font-medium transition-colors"
          @click="$emit('closeMenu')"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
  </div>
</template>
