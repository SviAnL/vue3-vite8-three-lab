<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useEventListener, useMediaQuery } from '@vueuse/core'
  import { VIDEO_PROGRESS_STORAGE_KEY } from '@/constants'
  import { useControlsVisibility } from './composables/useControlsVisibility'
  import { useVideoFullscreen } from './composables/useVideoFullscreen'
  import { useVideoPlayer } from './composables/useVideoPlayer'
  import VideoControls from './VideoControls.vue'
  import VideoProgressBar from './VideoProgressBar.vue'
  import type { VideoElement } from './types'

  interface Props {
    src: string
    poster?: string
    title?: string
    autoResumeMusic?: boolean
    videoId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    poster: '',
    title: '',
    autoResumeMusic: true,
    videoId: '',
  })

  const emit = defineEmits<{ play: []; pause: []; ended: [] }>()

  const { t } = useI18n()

  const containerRef = ref<HTMLElement>()
  const videoRef = ref<VideoElement>()
  const isScrubbing = ref(false)

  /** 粗指针设备（手机 / 平板） */
  const isTouch = useMediaQuery('(pointer: coarse)')

  const storageKey = computed(() => `${VIDEO_PROGRESS_STORAGE_KEY}${props.videoId || props.src}`)

  const {
    isPlaying,
    isBuffering,
    isEnded,
    currentTime,
    duration,
    bufferedPercent,
    volume,
    isMuted,
    playbackRate,
    togglePlay,
    toggleMute,
    setVolume,
    setRate,
    seek,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onLoadedMetadata,
    updateBuffered,
    onError,
  } = useVideoPlayer({
    videoRef,
    storageKey,
    autoResumeMusic: toRef(props, 'autoResumeMusic'),
    t,
  })

  /* 全屏 */
  const { isFullscreenActive, toggleFullscreen } = useVideoFullscreen(containerRef, videoRef)

  /* 控制条显隐 */
  const {
    showControls,
    isHovering,
    revealControls,
    scheduleHide,
    clearAllTimers,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
    toggleControls,
  } = useControlsVisibility({ isPlaying, isScrubbing, isTouch })

  /* 播放状态对外事件 */
  watch(isPlaying, (playing) => {
    if (playing) {
      emit('play')
    } else {
      emit('pause')
    }
  })

  watch(isEnded, (ended) => {
    if (ended) emit('ended')
  })

  /* 点击 / 双击处理 */
  let clickTimer: ReturnType<typeof setTimeout> | undefined

  /**
   * 桌面端：单击延迟 200ms 执行，若期间发生双击则取消单击。
   * 移动端：单击切换控制条显隐，双击不处理（避免双击缩放）。
   */
  function onVideoClick() {
    if (isTouch.value) {
      toggleControls()
      return
    }
    clearTimeout(clickTimer)
    clickTimer = setTimeout(() => {
      void togglePlay()
      revealControls()
    }, 200)
  }

  function onVideoDblClick() {
    if (isTouch.value) return
    clearTimeout(clickTimer)
    void toggleFullscreen()
  }

  /* 进度条事件 */
  function onScrubStart() {
    isScrubbing.value = true
    revealControls()
  }

  function onScrubEnd() {
    isScrubbing.value = false
    scheduleHide()
  }

  /* 快捷键 */
  useEventListener(document, 'keydown', (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    if (
      target &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    ) {
      return
    }
    const focused = containerRef.value?.contains(document.activeElement)
    if (!isHovering.value && !isFullscreenActive.value && !focused) return

    const video = videoRef.value
    if (!video) return

    switch (event.key) {
      case ' ':
      case 'k':
        event.preventDefault()
        void togglePlay()
        revealControls()
        break
      case 'ArrowRight':
        event.preventDefault()
        video.currentTime = Math.min(duration.value || 0, video.currentTime + 5)
        revealControls()
        break
      case 'ArrowLeft':
        event.preventDefault()
        video.currentTime = Math.max(0, video.currentTime - 5)
        revealControls()
        break
      case 'ArrowUp':
        event.preventDefault()
        setVolume(volume.value + 0.1)
        revealControls()
        break
      case 'ArrowDown':
        event.preventDefault()
        setVolume(volume.value - 0.1)
        revealControls()
        break
      case 'f':
        event.preventDefault()
        void toggleFullscreen()
        break
      case 'm':
        event.preventDefault()
        toggleMute()
        break
    }
  })

  /* 原生全屏事件 */
  useEventListener(videoRef, 'webkitbeginfullscreen', () => {
    showControls.value = false
  })
  useEventListener(videoRef, 'webkitendfullscreen', () => {
    showControls.value = true
  })

  onBeforeUnmount(() => {
    clearTimeout(clickTimer)
  })
</script>

<template>
  <div
    ref="containerRef"
    class="group/player focus-visible:ring-primary hc:text-gray-50 relative isolate w-full touch-manipulation overflow-hidden rounded-xl bg-black text-white outline-none select-none focus-visible:ring-2"
    :class="isFullscreenActive ? 'h-screen w-screen rounded-none' : ''"
    tabindex="0"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointermove="onPointerMove"
  >
    <!-- 视频本体 -->
    <video
      ref="videoRef"
      class="block w-full bg-black object-contain"
      :class="isFullscreenActive ? 'h-screen' : 'aspect-video'"
      crossorigin="anonymous"
      :src="src"
      :poster="poster"
      :title="title"
      playsinline
      webkit-playsinline
      preload="metadata"
      @click="onVideoClick"
      @dblclick="onVideoDblClick"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @progress="updateBuffered"
      @waiting="isBuffering = true"
      @canplay="isBuffering = false"
      @playing="isBuffering = false"
      @error="onError"
    ></video>

    <!-- 中央播放 / 重播按钮 -->
    <Transition name="fade">
      <button
        v-if="!isPlaying && !isBuffering"
        type="button"
        class="absolute inset-0 z-20 flex cursor-pointer items-center justify-center"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
        @click.stop="togglePlay"
      >
        <span
          class="hc:text-gray-50 flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/75 active:scale-95 sm:h-16 sm:w-16"
        >
          <Icon :icon="isEnded ? 'mdi:replay' : 'mdi:play'" class="h-7 w-7 sm:h-8 sm:w-8" />
        </span>
      </button>
    </Transition>

    <!-- 缓冲指示 -->
    <Transition name="fade">
      <div
        v-if="isBuffering && isPlaying"
        class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <div
          class="h-11 w-11 animate-spin rounded-full border-[3px] border-white/25 border-t-white"
        ></div>
      </div>
    </Transition>

    <!-- 控制条 -->
    <div
      class="absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black/90 via-black/55 to-transparent px-3 pt-10 pb-3 transition-all duration-200 ease-out sm:px-4 sm:pb-4"
      :class="
        showControls ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
      "
      @pointerenter="!isTouch && clearAllTimers()"
      @pointerleave="!isTouch && scheduleHide()"
    >
      <VideoProgressBar
        :current-time="currentTime"
        :duration="duration"
        :buffered-percent="bufferedPercent"
        :is-touch="isTouch"
        @seek="seek"
        @scrub-start="onScrubStart"
        @scrub-end="onScrubEnd"
      />

      <VideoControls
        :is-playing="isPlaying"
        :current-time="currentTime"
        :duration="duration"
        :volume="volume"
        :is-muted="isMuted"
        :playback-rate="playbackRate"
        :is-fullscreen="isFullscreenActive"
        :is-touch="isTouch"
        @toggle-play="togglePlay"
        @toggle-mute="toggleMute"
        @set-volume="setVolume"
        @set-rate="setRate"
        @toggle-fullscreen="toggleFullscreen"
      />
    </div>
  </div>
</template>
