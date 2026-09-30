/** 邮箱校验 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** 字符串短横线转小驼峰 */
export function kebabToCamel(kebab: string): string {
  if (!kebab) return ''
  if (!kebab.includes('-')) return kebab
  return kebab.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}
