import { prefersReducedMotion } from '@/utils'
import type { Directive } from 'vue'

interface RevealEl extends HTMLElement {
  _revealObserver?: IntersectionObserver
}

export const vReveal: Directive<RevealEl> = {
  mounted(el: RevealEl) {
    if (typeof window === 'undefined') return

    if (prefersReducedMotion()) return

    if (!window.IntersectionObserver) {
      el.classList.remove('opacity-0', 'translate-y-8')
      return
    }

    el.classList.add('opacity-0', 'translate-y-8', 'transition-[opacity,transform]', 'duration-700')

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )

    el._revealObserver = observer

    observer.observe(el)
  },

  updated(el: RevealEl) {
    // 如果元素被复用，动画已经触发过就不再处理
    const observer = el._revealObserver
    if (!observer) return
  },

  unmounted(el: RevealEl) {
    const observer = el._revealObserver

    if (observer) {
      observer.unobserve(el)
      observer.disconnect()
    }

    delete el._revealObserver
  },
}
