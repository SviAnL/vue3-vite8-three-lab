import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MUSIC_PLAY_LIST, APP_STORAGE_KEYS } from '@/constants'

export const useMusicStore = defineStore(
  'music',
  () => {
    const playlist = ref(MUSIC_PLAY_LIST)
    const currentIndex = ref(0)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const volume = ref(0.7)
    const isMuted = ref(false)
    const isExpanded = ref(false)
    const wasPlayingBeforeVideo = ref(false)
    const position = ref({ x: -1, y: -1 })

    const currentSong = computed(() => playlist.value[currentIndex.value])

    const progress = computed(() => {
      if (!currentSong.value?.duration) return 0
      return (currentTime.value / currentSong.value.duration) * 100
    })

    function play(): void {
      isPlaying.value = true
    }

    function pause(): void {
      isPlaying.value = false
    }

    function toggle(): void {
      isPlaying.value = !isPlaying.value
    }

    function next(): void {
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
      currentTime.value = 0
    }

    function prev(): void {
      currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
      currentTime.value = 0
    }

    function setVolume(v: number): void {
      volume.value = Math.max(0, Math.min(1, v))
      isMuted.value = v === 0
    }

    function toggleMute(): void {
      isMuted.value = !isMuted.value
    }

    function setCurrentTime(t: number): void {
      currentTime.value = t
    }

    function toggleExpanded(): void {
      isExpanded.value = !isExpanded.value
    }

    function pauseForVideo(): void {
      wasPlayingBeforeVideo.value = isPlaying.value
      pause()
    }

    function resumeAfterVideo(autoResume = true): void {
      if (autoResume && wasPlayingBeforeVideo.value) {
        play()
      }
    }

    function setPosition(x: number, y: number): void {
      position.value = { x, y }
    }

    return {
      playlist,
      currentIndex,
      isPlaying,
      currentTime,
      volume,
      isMuted,
      isExpanded,
      position,
      currentSong,
      progress,
      play,
      pause,
      toggle,
      next,
      prev,
      setVolume,
      toggleMute,
      setCurrentTime,
      toggleExpanded,
      pauseForVideo,
      resumeAfterVideo,
      setPosition,
    }
  },
  {
    persist: {
      key: APP_STORAGE_KEYS.MUSIC,
      pick: ['currentIndex', 'volume', 'isMuted', 'position'],
    },
  },
)
