import { describe, it, expect } from 'vitest'
import { cn } from '@/utils'

describe('utils/dom cn 类名合并', () => {
  it('拼接多个字符串类名', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('自动过滤 falsy 值：false / null / undefined', () => {
    expect(cn('btn', false, null, undefined, 'btn-primary')).toBe('btn btn-primary')
  })

  it('全部为假值返回空字符串', () => {
    expect(cn(false, null, undefined)).toBe('')
  })

  it('混合条件类名', () => {
    const active = true
    const disabled = false
    expect(cn('card', active && 'card--active', disabled && 'card--disabled')).toBe(
      'card card--active',
    )
  })
})
