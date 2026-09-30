import { useRafFn, useStorage, useThrottleFn } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MEDIA_ERROR_MESSAGE, VIDEO_RATE_STORAGE_KEY, VIDEO_VOLUME_STORAGE_KEY } from '@/constants'
import { useMusicStore } from '@/stores'
import { toastError } from '@/utils'
import type { VideoElement } from '../types'

interface Options {
  videoRef: Ref<VideoElement | undefined>
  storageKey: Ref<string>
  autoResumeMusic: Ref<boolean>
  t: (key: string) => string
}

export function useVideoPlayer({ videoRef, storageKey, autoResumeMusic, t }: Options) {
  const musicStore = useMusicStore()

  const isPlaying = ref(false)
  const isBuffering = ref(false)
  const isEnded = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const bufferedPercent = ref(0)

  /* ------------------------- 全局偏好：音量 / 速率 ------------------------- */
  // 两者都作为全局偏好存储，所有视频共享
  const volume = useStorage(VIDEO_VOLUME_STORAGE_KEY, 1)
  const isMuted = ref(volume.value === 0)
  const playbackRate = useStorage(VIDEO_RATE_STORAGE_KEY, 1)

  const storedTime = useStorage(storageKey, 0)

  const persistProgress = useThrottleFn(() => {
    const video = videoRef.value
    if (!video) return
    storedTime.value = video.ended ? 0 : video.currentTime
  }, 800)

  /* rAF 平滑进度更新 */
  const { pause: pauseRaf, resume: resumeRaf } = useRafFn(
    () => {
      const video = videoRef.value
      if (!video) return
      currentTime.value = video.currentTime
      persistProgress()
    },
    { immediate: false },
  )

  watch(isPlaying, (playing) => {
    if (playing) resumeRaf()
    else pauseRaf()
  })

  /* 播放控制 */
  async function togglePlay() {
    const video = videoRef.value
    if (!video) return
    if (video.paused || video.ended) {
      try {
        await video.play()
      } catch {
        /* 被策略或手势中断 */
      }
    } else {
      video.pause()
    }
  }

  function toggleMute() {
    const video = videoRef.value
    if (!video) return
    const next = !isMuted.value
    isMuted.value = next
    video.muted = next
    if (!next && volume.value === 0) {
      volume.value = 1
      video.volume = 1
    }
  }

  function setVolume(value: number) {
    const clamped = Math.min(1, Math.max(0, value))
    volume.value = clamped
    isMuted.value = clamped === 0
    const video = videoRef.value
    if (video) {
      video.volume = clamped
      video.muted = clamped === 0
    }
  }

  function setRate(rate: number) {
    playbackRate.value = rate
    if (videoRef.value) videoRef.value.playbackRate = rate
  }

  function seek(time: number) {
    const video = videoRef.value
    if (!video) return
    const target = Math.min(time, duration.value || time)
    video.currentTime = target
    currentTime.value = target
    persistProgress()
  }

  /* 事件回调 */
  function onPlay() {
    isPlaying.value = true
    isEnded.value = false
    isBuffering.value = false
    musicStore.pauseForVideo()
  }

  function onPause() {
    isPlaying.value = false
    musicStore.resumeAfterVideo(autoResumeMusic.value)
  }

  function onEnded() {
    isPlaying.value = false
    isEnded.value = true
    storedTime.value = 0
    musicStore.resumeAfterVideo(autoResumeMusic.value)
  }

  function onTimeUpdate() {
    const video = videoRef.value
    if (!video) return
    if (!isPlaying.value) currentTime.value = video.currentTime
  }

  function onLoadedMetadata() {
    const video = videoRef.value
    if (!video) return
    duration.value = Number.isFinite(video.duration) ? video.duration : 0

    // 应用已存储的全局偏好：音量 / 静音 / 速率
    video.volume = volume.value
    video.muted = isMuted.value
    video.playbackRate = playbackRate.value

    // 恢复播放进度
    const saved = Number(storedTime.value) || 0
    if (saved > 1 && saved < duration.value - 1) {
      video.currentTime = saved
      currentTime.value = saved
    }
    updateBuffered()
  }

  function updateBuffered() {
    const video = videoRef.value
    if (!video || !video.duration || !Number.isFinite(video.duration)) {
      bufferedPercent.value = 0
      return
    }
    try {
      const { buffered } = video
      const end = buffered.length ? buffered.end(buffered.length - 1) : 0
      bufferedPercent.value = Math.min(100, (end / video.duration) * 100)
    } catch {
      bufferedPercent.value = 0
    }
  }

  function onError(event: Event) {
    const videoEl = event.target as HTMLVideoElement
    const code = videoEl.error?.code ?? 0
    const message = MEDIA_ERROR_MESSAGE[code] || t('video.unknownVideoError')
    toastError(message)
  }

  function saveOnUnmount() {
    const video = videoRef.value
    if (!video) return
    try {
      localStorage.setItem(storageKey.value, String(video.ended ? 0 : video.currentTime))
    } catch {
      /* ignore */
    }
  }

  onMounted(() => {
    // 元素已存在时提前同步一次，避免 loadedmetadata 前的短暂跳变
    if (videoRef.value) {
      videoRef.value.volume = volume.value
      videoRef.value.muted = isMuted.value
      videoRef.value.playbackRate = playbackRate.value
    }
  })

  onBeforeUnmount(saveOnUnmount)

  return {
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
    saveOnUnmount,
  }
}
