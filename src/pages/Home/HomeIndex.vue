<script setup lang="ts">
  import { testApi } from '@/api'
  import BaseLoading from '@/components/common/BaseLoading.vue'

  const { t } = useI18n()

  const loading = ref(true)

  const stats = ref()

  const skillTags = [
    'Vue.js',
    'TypeScript',
    'Node.js',
    'Tailwind CSS',
    'Vite',
    'Pinia',
    'Docker',
    'Git',
  ]

  const statItems = computed(() => [
    { label: t('home.stats.visits'), value: stats.value?.visits },
    { label: t('home.stats.projects'), value: stats.value?.projects },
    { label: t('home.stats.articles'), value: stats.value?.articles },
    { label: t('home.stats.experiences'), value: stats.value?.experiences },
  ])

  async function fetchData() {
    loading.value = true
    try {
      const [g, p, d, l] = await Promise.all([
        testApi.getTest(),
        testApi.postTest({ id: '1', name: '1' }),
        testApi.getTestDetail('1'),
        testApi.getTestList({
          page: 1,
          pageSize: 10,
        }),
      ])
      console.log('get', g)
      console.log('post', p)
      console.log('detail', d)
      console.log('list', l)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await fetchData()
  })
</script>

<template>
  <div>
    <section class="relative flex items-center py-20">
      <div class="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 class="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            <span v-for="(char, i) in t('home.slogan')" :key="i" class="inline-block">
              {{ char === ' ' ? '\u00A0' : char }}
            </span>
          </h1>
          <p class="text-muted mb-8 text-lg">
            Full-Stack Developer · Open Source Enthusiast · Tech Blogger
          </p>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="tag in skillTags"
              :key="tag"
              class="border-border bg-surface rounded-full border px-4 py-2 text-sm font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="relative">
            <div
              class="animate-pulse-slow bg-primary/20 absolute inset-0 rounded-full blur-2xl"
            ></div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=SviAnL"
              alt="Avatar"
              class="border-primary/30 relative h-48 w-48 rounded-full border-4 object-cover md:h-64 md:w-64"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="border-border border-y py-12">
      <BaseLoading v-if="loading" />
      <div v-else class="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div v-for="(item, idx) in statItems" :key="idx" class="text-center">
          <div class="text-primary text-3xl font-bold md:text-4xl">
            {{ item.value }}
          </div>
          <div class="text-muted mt-1 text-sm">
            {{ item.label }}
          </div>
        </div>
      </div>
    </section>

    <section class="py-8">
      <h2 v-reveal class="mb-8 text-2xl font-bold">
        {{ t('home.featured') }}
      </h2>
      <BaseLoading v-if="loading" />
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">123</div>
    </section>

    <section class="bg-surface/50">
      <h2 v-reveal class="mb-8 text-2xl font-bold">{{ t('home.latest') }}</h2>
      <BaseLoading v-if="loading" />
      <div v-else class="grid gap-6 md:grid-cols-3">456</div>
    </section>
  </div>
</template>
