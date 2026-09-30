import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { compression } from 'vite-plugin-compression2'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import ConsoleKeeper from 'vite-plugin-keep-console'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { PluginOption } from 'vite'

export function createVitePlugins(mode: string): PluginOption[] {
  const isAnalyze = mode === 'analyze'
  const isProd = ['production', 'analyze'].includes(mode)

  return [
    vue(),
    vueDevTools(),

    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: 'types/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
        filepath: 'types/.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),

    Components({
      dts: 'types/components.d.ts',
      resolvers: [
        IconsResolver({
          enabledCollections: ['mdi', 'ri'],
        }),
      ],
    }),

    Icons({ compiler: 'vue3', autoInstall: false }),

    ConsoleKeeper({
      // 设置oxc, 插件识别不了 `import type`, 故使用babel, 不影响外层打包压缩器依旧是 oxc, 插件内部 AST 解析换成 babel
      backend: 'babel',
      // 仅对 src 目录下的文件进行控制
      include: ['src'],
      // 允许使用 `keep-console` 注释来保留 console
      keepComments: ['keep-console'],
      // 输出日志 显示报告信息
      report: true,
    }),

    // 生产环境 Gzip / Brotli 压缩
    ...(isProd
      ? [
          compression({
            // 同时开启 gzip 和 brotli 两种压缩
            algorithms: ['gzip', 'brotliCompress'],
            // 只压缩大于 1024 字节（1KB）的文件
            threshold: 1024,
            // 不输出日志, 静默压缩
            logLevel: 'silent',
          }),
        ]
      : []),

    // 生产环境图片压缩
    isProd &&
      ViteImageOptimizer({
        // 输出压缩日志 看每张图片压缩率
        logStats: true,
        // 排除 node_modules 图片
        exclude: /node_modules/,
        // 包含 public 目录图片
        includePublic: true,
        // 不包含svg 项目未安装 svgo 且项目使用 iconify/vue 直接引库
        test: /\.(jpe?g|png|tiff|webp|avif)$/i,
        png: { quality: 80 },
        jpeg: {
          quality: 80,
          mozjpeg: true,
        },
        jpg: {
          quality: 80,
          mozjpeg: true,
        },
        webp: { quality: 80 },
        avif: { quality: 70 },
      }),

    // 分析模式打包体积可视化
    isAnalyze &&
      visualizer({
        open: true,
        filename: 'stats.html',
        gzipSize: true,
      }),

    tailwindcss(),
  ].filter(Boolean)
}
