<script setup lang="ts">
  import { formatDuration } from '@/utils'

  interface Props {
    currentTime: number
    duration: number
    bufferedPercent: number
    isTouch: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    seek: [time: number]
    'scrub-start': []
    'scrub-end': []
  }>()

  const progressRef = ref<HTMLDivElement>()
  const isScrubbing = ref(false)
  const scrubTime = ref(0)
  const hoverTime = ref<number | null>(null)
  const hoverPercent = ref(0)

  const displayTime = computed(() => (isScrubbing.value ? scrubTime.value : props.currentTime))

  const progressPercent = computed(() => {
    if (!props.duration || !Number.isFinite(props.duration)) return 0
    return Math.min(100, Math.max(0, (displayTime.value / props.duration) * 100))
  })

  function ratioFromClientX(clientX: number) {
    const el = progressRef.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return 0
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }

  function onScrubStart(event: PointerEvent) {
    if (!props.duration || !Number.isFinite(props.duration)) return
    const el = event.currentTarget as HTMLElement
    try {
      el.setPointerCapture(event.pointerId)
    } catch {
      /* ignore */
    }
    isScrubbing.value = true
    hoverTime.value = null
    emit('scrub-start')
    scrubTime.value = ratioFromClientX(event.clientX) * props.duration
  }

  function onProgressPointerMove(event: PointerEvent) {
    // 拖拽中：只更新 scrubTime，不写回 video，松手才 seek（移动端更跟手）
    if (isScrubbing.value) {
      scrubTime.value = ratioFromClientX(event.clientX) * props.duration
      return
    }
    if (props.isTouch || !props.duration) return
    const ratio = ratioFromClientX(event.clientX)
    hoverPercent.value = ratio * 100
    hoverTime.value = ratio * props.duration
  }

  function onScrubEnd(event: PointerEvent) {
    if (!isScrubbing.value) return
    const el = event.currentTarget as HTMLElement
    try {
      el.releasePointerCapture(event.pointerId)
    } catch {
      /* ignore */
    }
    const target = Math.min(scrubTime.value, props.duration || scrubTime.value)
    emit('seek', target)
    isScrubbing.value = false
    hoverTime.value = null
    emit('scrub-end')
  }

  function onProgressLeave() {
    if (isScrubbing.value) return
    hoverTime.value = null
  }
</script>

<template>
  <div
    ref="progressRef"
    class="group/progress relative flex h-8 w-full touch-none items-center sm:h-6"
    role="slider"
    aria-label="播放进度"
    :aria-valuemin="0"
    :aria-valuemax="Math.round(duration)"
    :aria-valuenow="Math.round(displayTime)"
    @pointerdown="onScrubStart"
    @pointermove="onProgressPointerMove"
    @pointerup="onScrubEnd"
    @pointercancel="onScrubEnd"
    @pointerleave="onProgressLeave"
  >
    <!-- 轨道 -->
    <div
      class="relative w-full rounded-full bg-white/25 transition-all duration-150"
      :class="isScrubbing ? 'h-1.5' : 'h-1 group-hover/progress:h-1.5'"
    >
      <!-- 缓冲 -->
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-white/30"
        :style="{ width: `${bufferedPercent}%` }"
      ></div>
      <!-- 已播放 -->
      <div
        class="bg-primary absolute inset-y-0 left-0 rounded-full"
        :style="{ width: `${progressPercent}%` }"
      ></div>
    </div>

    <!-- 拖拽滑块 -->
    <div
      class="bg-primary pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_3px_rgba(0,0,0,0.25)] transition-transform duration-150"
      :class="isScrubbing ? 'scale-125' : 'scale-100'"
      :style="{ left: `${progressPercent}%` }"
    ></div>

    <!-- 悬停时间预览 -->
    <Transition name="fade">
      <div
        v-if="hoverTime !== null && !isScrubbing"
        class="hc:text-gray-50 pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full rounded-md bg-black/85 px-2 py-1 text-xs font-medium whitespace-nowrap text-white tabular-nums shadow-lg backdrop-blur-sm"
        :style="{ left: `${hoverPercent}%` }"
      >
        {{ formatDuration(hoverTime) }}
      </div>
    </Transition>
  </div>
</template>
