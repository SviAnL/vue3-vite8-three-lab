/// <reference types="vitest" />
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },

  test: {
    globals: true,

    environment: 'jsdom',

    include: ['tests/**/*.{test,spec}.{js,ts}'],

    coverage: {
      provider: 'v8',

      reporter: ['text', 'json', 'html'],

      include: [
        'src/api/**/*.ts',
        'src/composables/**/*.ts',
        'src/constants/**/*.ts',
        'src/stores/**/*.ts',
        'src/utils/**/*.ts',
      ],

      exclude: ['**/index.ts'],
    },
  },
})
