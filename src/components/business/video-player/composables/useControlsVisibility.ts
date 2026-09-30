import { useThrottleFn } from '@vueuse/core'
import { onBeforeUnmount, ref, watch } from 'vue'

interface Options {
  isPlaying: Ref<boolean>
  isScrubbing: Ref<boolean>
  isTouch: Ref<boolean>
}

export function useControlsVisibility({ isPlaying, isScrubbing, isTouch }: Options) {
  const showControls = ref(true)
  const isHovering = ref(false)

  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let leaveTimer: ReturnType<typeof setTimeout> | undefined

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = undefined
    }
  }
  function clearLeaveTimer() {
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
  }
  function clearAllTimers() {
    clearHideTimer()
    clearLeaveTimer()
  }

  function scheduleHide(delay = 2500) {
    clearHideTimer()
    if (!isPlaying.value || isScrubbing.value) return
    hideTimer = setTimeout(() => {
      showControls.value = false
    }, delay)
  }

  function revealControls() {
    clearAllTimers()
    if (!showControls.value) showControls.value = true
    scheduleHide()
  }

  const onPointerMove = useThrottleFn(() => {
    if (isTouch.value) return
    revealControls()
  }, 120)

  function onPointerEnter() {
    isHovering.value = true
    if (isTouch.value) return
    revealControls()
  }

  /** 延迟隐藏，避免快速离开→立即进入造成的二次闪烁 */
  function onPointerLeave() {
    isHovering.value = false
    if (isTouch.value || isScrubbing.value || !isPlaying.value) return
    clearAllTimers()
    leaveTimer = setTimeout(() => {
      showControls.value = false
    }, 180)
  }

  /** 移动端点击视频切换显隐 */
  function toggleControls() {
    if (showControls.value && isPlaying.value) {
      clearAllTimers()
      showControls.value = false
    } else {
      revealControls()
    }
  }

  watch(isPlaying, (playing) => {
    if (playing) {
      scheduleHide()
    } else {
      clearAllTimers()
      showControls.value = true
    }
  })

  onBeforeUnmount(clearAllTimers)

  return {
    showControls,
    isHovering,
    revealControls,
    scheduleHide,
    clearAllTimers,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
    toggleControls,
  }
}
