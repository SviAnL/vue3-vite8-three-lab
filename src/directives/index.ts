import type { Directive } from 'vue'

// eager:true 立即加载全部模块；不使用 import:default，拿到整个模块的所有导出
const modules = import.meta.glob('./**/*.ts', { eager: true })

const directives: Record<string, Directive> = {}

for (const filePath in modules) {
  const mod = modules[filePath] as Record<string, Directive>
  // 遍历文件导出，筛选以 v 开头的变量（vLazy / vClickOutside / vReveal）
  Object.entries(mod).forEach(([exportName, directive]) => {
    if (exportName.startsWith('v')) {
      directives[exportName] = directive
    }
  })
}

export function setupDirectives(app: import('vue').App) {
  Object.entries(directives).forEach(([key, dir]) => {
    // key: vLazy → 注册为 lazy
    app.directive(key.slice(1), dir)
  })
}
