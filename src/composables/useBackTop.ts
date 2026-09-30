import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from '@/utils'

/** 返回顶部可见性 */
export function useBackTop(threshold = 300, debounceDelay = 30) {
  const visible = ref(false)

  function onScroll() {
    visible.value = window.scrollY > threshold
  }

  const debouncedOnScroll = debounce(onScroll, debounceDelay)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    window.addEventListener('scroll', debouncedOnScroll, { passive: true })
    debouncedOnScroll()
  })

  onUnmounted(() => window.removeEventListener('scroll', debouncedOnScroll))

  return { visible, scrollToTop }
}
