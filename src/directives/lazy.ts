import { IMG_LAZY_PLACEHOLDER, IMG_LAZY_ERROR_PLACEHOLDER } from '@/constants'
import type { Directive, DirectiveBinding } from 'vue'

interface LazyImageEl extends HTMLImageElement {
  _lazyObserver?: IntersectionObserver
  _lazySrc?: string
}

export const vLazy: Directive<LazyImageEl, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    if (typeof window === 'undefined') return
    if (!window.IntersectionObserver) {
      el.src = binding.value
      return
    }

    const realSrc = binding.value
    el._lazySrc = realSrc
    el.dataset.src = realSrc

    el.src = IMG_LAZY_PLACEHOLDER
    el.classList.add('transition-opacity', 'duration-500', 'opacity-50')

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          if (!el._lazySrc) return
          el.src = el._lazySrc

          // 原图加载完成，添加淡入效果
          el.onload = () => {
            el.classList.add('opacity-100')
          }
          // 加载失败兜底
          el.onerror = () => {
            el.classList.add('opacity-100')
            el.src = IMG_LAZY_ERROR_PLACEHOLDER
          }
          observer.unobserve(el)
        }
      },
      { rootMargin: '100px' },
    )

    el._lazyObserver = observer
    observer.observe(el)
  },

  updated(el, binding: DirectiveBinding<string>) {
    const newSrc = binding.value
    if (newSrc === el._lazySrc) return

    el._lazySrc = newSrc
    el.dataset.src = newSrc

    // 已经加载完成，直接替换图片
    if (el._lazyObserver === undefined) {
      el.src = newSrc
    }
  },

  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.unobserve(el)
      el._lazyObserver.disconnect()
    }
    delete el._lazyObserver
    delete el._lazySrc
    el.onload = null
    el.onerror = null
  },
}
