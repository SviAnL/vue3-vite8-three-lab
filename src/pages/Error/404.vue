<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import BaseButton from '@/components/common/BaseButton.vue'

  const { t } = useI18n()
  const router = useRouter()
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center py-20">
    <div v-reveal class="text-center">
      <div class="text-primary mb-4 animate-pulse text-8xl font-bold">404</div>
      <h1 class="mb-2 text-2xl font-bold">
        {{ t('error.notFound') }}
      </h1>
      <p class="text-muted mb-8">
        {{ t('error.notFoundDesc') }}
      </p>
      <div class="flex justify-center gap-4">
        <BaseButton @click="router.push('/')">
          {{ t('common.backHome') }}
        </BaseButton>
        <BaseButton variant="outline" @click="router.back()">
          {{ t('common.backPrev') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
