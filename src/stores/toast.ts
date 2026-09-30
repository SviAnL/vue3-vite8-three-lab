import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastType, ToastDetail } from '@/types/window-event'

export const useToastStore = defineStore('app', () => {
  const toastMessage = ref('')
  const toastType = ref<ToastType>('success')
  const showToast = ref(false)

  function openToast(payload: ToastDetail): void {
    toastMessage.value = payload.message
    toastType.value = payload.type
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, payload.duration)
  }

  function hideToast(): void {
    showToast.value = false
  }

  return { toastMessage, toastType, showToast, openToast, hideToast }
})
