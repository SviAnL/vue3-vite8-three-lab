<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import LangSwitch from '@/components/common/LangSwitch.vue'
  import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
  import { APP_MAIN_NAV } from '@/constants/app.ts'
  import AppMobileMenu from './AppMobileMenu.vue'

  const route = useRoute()

  const { t } = useI18n()

  const APP_TITLE = import.meta.env.VITE_APP_TITLE

  const menuOpen = ref(false)

  const navItems = computed(() => {
    return APP_MAIN_NAV.map((item) => ({
      ...item,
      label: t(item.label),
    }))
  })

  function isActive(path: string) {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
  }

  function openMenu() {
    menuOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  function closeMenu() {
    menuOpen.value = false
    document.body.style.overflow = ''
  }
</script>

<template>
  <header class="bg-background sticky top-0 z-50">
    <nav class="flex h-16 items-center justify-between px-4" aria-label="Main navigation">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-xl font-bold"
        @click="closeMenu"
      >
        <img src="/favicon.svg" alt="logo" class="h-8" />
        {{ APP_TITLE }}
      </RouterLink>

      <div class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="hover:bg-surface-hover rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.path) ? 'text-primary' : 'text-muted hover:text-foreground'"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <LangSwitch class="hidden sm:flex" />

        <ThemeSwitch />

        <button
          class="rounded-lg p-2 text-2xl lg:hidden"
          aria-label="Toggle menu"
          :aria-expanded="menuOpen"
          @click="openMenu"
        >
          <Icon :icon="menuOpen ? 'mdi:close' : 'ri:menu-line'" />
        </button>
      </div>
    </nav>
  </header>

  <Transition name="fade">
    <AppMobileMenu
      v-if="menuOpen"
      :nav-items="navItems"
      :is-active="isActive"
      @close-menu="closeMenu"
    />
  </Transition>
</template>
