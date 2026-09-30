<script setup lang="ts">
  const { t } = useI18n()

  const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-border bg-surface border-t py-4">
    <div class="text-center">
      <p class="text-muted text-sm">
        {{ t('footer.copyright', { year }) }}
      </p>
      <p class="text-muted/70 mt-1 text-xs">
        {{ t('footer.description') }}
      </p>
    </div>
  </footer>
</template>
