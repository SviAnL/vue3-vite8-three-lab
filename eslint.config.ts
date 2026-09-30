import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importX, { createNodeResolver } from 'eslint-plugin-import-x'
import vuePlugin from 'eslint-plugin-vue'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import type { Linter } from 'eslint'

// 读取 auto‑import 自动导入全局变量
let autoImportGlobals: Record<string, string> = {}

const autoImportEslintPath = fileURLToPath(
  new URL('./types/.eslintrc-auto-import.json', import.meta.url),
)

if (existsSync(autoImportEslintPath)) {
  const content = readFileSync(autoImportEslintPath, 'utf-8')
  const json = JSON.parse(content) as { globals: Record<string, string> }
  autoImportGlobals = json.globals
}

// 公共变量
const commonGlobals = {
  ...globals.browser,
  ...autoImportGlobals,
}

// import‑x 公共Settings
const commonImportXSettings = {
  'import-x/resolver-next': [
    createTypeScriptImportResolver({
      alwaysTryTypes: true,
      tsconfig: {
        configFile: './tsconfig.json',
      },
      extensions: ['.js', '.ts', '.vue', '.tsx', '.jsx'],
    }),
    createNodeResolver({
      tsconfig: {
        configFile: './tsconfig.json',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    }),
  ],
  'import-x/extensions': ['.js', '.ts', '.vue', '.tsx', '.jsx'],
  'import-x/ignore': ['node_modules'],
}

// 公共规则，ts / tsx / jsx / vue 共用
const commonRules: Linter.RulesRecord = {
  // 未使用的变量检查, 忽略 _ 开头的变量
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  // 配置导入排序
  'import-x/order': [
    'warn',
    {
      groups: [
        'builtin', // 1. Node.js 内置模块
        'external', // 2. 第三方依赖
        'internal', // 3. 项目内部别名模块 (如 @/)
        'parent', // 4. 父级目录
        'sibling', // 5. 同级目录
        'index', // 6. 当前目录的 index 文件
        'object', // 7. TypeScript 对象导入
        'type', // 8. TypeScript 类型导入
      ],
      'newlines-between': 'never',
      alphabetize: { order: 'asc', orderImportKind: 'desc', caseInsensitive: true },
    },
  ],
  // 禁止模块循环依赖
  'import-x/no-cycle': 'error',
  // 必须写在文件最顶部
  'import-x/first': 'error',
  // 禁止同一个模块多次导入
  'import-x/no-duplicates': 'error',
  // 导入结束之后, 必须空一行再写代码
  'import-x/newline-after-import': 'error',
  // 禁止路径里写无意义的路径片段
  'import-x/no-useless-path-segments': 'warn',
}

// Vue 规则
const commonVueRules: Linter.RulesRecord = {
  'vue/multi-word-component-names': [
    'error',
    {
      ignores: ['404', '500'],
    },
  ],
  'vue/no-v-html': 'off',
}

export default defineConfig([
  {
    ignores: [
      'node_modules',
      'dist',
      'tsc-build',
      'src/types/auto-imports.d.ts',
      'src/types/components.d.ts',
    ],
  },

  js.configs.recommended,
  ...tsEslint.configs.strict,
  ...vuePlugin.configs['flat/recommended'],

  // ts 文件
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: commonGlobals,
      parser: tsEslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': importX,
    },
    settings: { ...commonImportXSettings },
    rules: { ...commonRules },
  },

  // tsx, jsx 文件
  {
    files: ['**/*.tsx', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: commonGlobals,
      parser: tsEslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'import-x': importX,
    },
    settings: { ...commonImportXSettings },
    rules: { ...commonRules },
  },

  // vue SFC文件
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: commonGlobals,
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': importX,
      vue: vuePlugin,
    },
    settings: {
      ...commonImportXSettings,
    },
    rules: {
      ...commonRules,
      ...commonVueRules,
    },
  },

  // cjs/config.* 文件
  {
    files: ['**/*.cjs', '*.config.js', '*.config.cjs', '*.config.ts'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
    },
  },

  eslintConfigPrettier,
])
