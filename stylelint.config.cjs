/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  ignoreFiles: ['**/*.html'],
  rules: {
    // 禁止出现无法识别的 CSS @规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'plugin',
          'reference',
        ],
      },
    ],
    // 强制规定`@import`的写法, 完全关闭该规则, 不约束 @import 写法
    'import-notation': null,
    // 强制要求 CSS 类名必须匹配指定正则, 关闭类名校验
    'selector-class-pattern': null,
    // 禁止后面选择器优先级低于前面选择器(特异性下降), 防止样式覆盖踩坑, 关闭特异性顺序校验
    'no-descending-specificity': null,
  },
}
