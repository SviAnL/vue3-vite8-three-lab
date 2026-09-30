<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { VIDEO_PLAYBACK_RATES } from '@/constants'
  import { formatDuration } from '@/utils'

  interface Props {
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    isMuted: boolean
    playbackRate: number
    isFullscreen: boolean
    isTouch: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    'toggle-play': []
    'toggle-mute': []
    'set-volume': [value: number]
    'set-rate': [value: number]
    'toggle-fullscreen': []
  }>()

  function onVolumeInput(event: Event) {
    emit('set-volume', Number((event.target as HTMLInputElement).value))
  }

  function onRateChange(event: Event) {
    emit('set-rate', Number((event.target as HTMLSelectElement).value))
  }
</script>

<template>
  <div class="mt-1 flex items-center justify-between gap-2">
    <!-- 左侧：播放 / 音量 / 时间 -->
    <div class="flex min-w-0 items-center gap-0.5 sm:gap-1.5">
      <button
        type="button"
        class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/15 active:scale-95"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
        @click="emit('toggle-play')"
      >
        <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" class="h-5 w-5" />
      </button>

      <template v-if="!isTouch">
        <button
          type="button"
          class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/15 active:scale-95"
          :aria-label="isMuted ? 'Unmute' : 'Mute'"
          @click="emit('toggle-mute')"
        >
          <Icon
            :icon="isMuted || volume === 0 ? 'mdi:volume-off' : 'mdi:volume-high'"
            class="h-5 w-5"
            :class="isMuted || volume === 0 ? 'text-red-400' : ''"
          />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          aria-label="Volume"
          class="accent-primary h-1 w-16 cursor-pointer lg:w-20"
          :value="volume"
          @input="onVolumeInput"
        />
      </template>

      <span class="ml-1 shrink-0 text-xs tabular-nums sm:text-sm">
        {{ formatDuration(currentTime) }}
        <span class="hc:text-placeholder text-white/50">/ {{ formatDuration(duration) }}</span>
      </span>
    </div>

    <!-- 右侧：倍速 / 全屏 -->
    <div class="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
      <div class="relative">
        <select
          aria-label="Playback speed"
          :value="playbackRate"
          class="hc:text-gray-50 hc:bg-white/80 cursor-pointer appearance-none rounded-md bg-white/15 py-1 pr-6 pl-2 text-xs font-medium text-white transition outline-none hover:bg-white/25"
          @change="onRateChange"
        >
          <option
            v-for="rate in VIDEO_PLAYBACK_RATES"
            :key="rate"
            :value="rate"
            class="hc:text-gray-50 bg-neutral-900 text-white"
          >
            {{ rate }}x
          </option>
        </select>
        <Icon
          icon="mdi:chevron-down"
          class="hc:text-gray-50 pointer-events-none absolute top-1/2 right-1.5 h-3.5 w-3.5 -translate-y-1/2 text-white/70"
        />
      </div>

      <button
        type="button"
        class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/15 active:scale-95"
        :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        @click="emit('toggle-fullscreen')"
      >
        <Icon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
