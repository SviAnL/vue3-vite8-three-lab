import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from './build/vite-plugins'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_APP_BASE_URL,

    define: {
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },

    plugins: createVitePlugins(mode),

    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },

    server: {
      port: Number(env.VITE_APP_PORT),
      host: true,
    },

    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vue-vendor',
                test: /[\\/]node_modules[\\/](vue|vue-router|pinia|vue-i18n)[\\/]/,
              },
            ],
          },
        },
      },
    },
  }
})
