import { useEventListener, useFullscreen } from '@vueuse/core'
import { computed, ref } from 'vue'
import type { VideoElement } from '../types'

export function useVideoFullscreen(
  containerRef: Ref<HTMLElement | undefined>,
  videoRef: Ref<VideoElement | undefined>,
) {
  const { isFullscreen, isSupported, enter, exit } = useFullscreen(containerRef)
  const isNativeFullscreen = ref(false)

  useEventListener(videoRef, 'webkitbeginfullscreen', () => {
    isNativeFullscreen.value = true
  })
  useEventListener(videoRef, 'webkitendfullscreen', () => {
    isNativeFullscreen.value = false
  })

  const isFullscreenActive = computed(() => isFullscreen.value || isNativeFullscreen.value)

  async function toggleFullscreen() {
    const video = videoRef.value
    if (!video) return

    if (video.webkitDisplayingFullscreen) {
      video.webkitExitFullscreen?.()
      return
    }
    if (isFullscreen.value) {
      await exit()
      return
    }
    if (isSupported.value) {
      try {
        await enter()
        return
      } catch {
        /* 降级到原生 */
      }
    }
    video.webkitEnterFullscreen?.()
  }

  return { isFullscreenActive, toggleFullscreen }
}
