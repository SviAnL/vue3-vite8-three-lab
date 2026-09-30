import type { ToastDetail, ToastType } from '@/types/window-event'

/**
 * 全局Toast
 * @param message 提示文本
 * @param type 类型
 * @param duration 时长 ms
 */
function dispatchToast(message: string, type: ToastType, duration = 3000) {
  const event = new CustomEvent<ToastDetail>('app:toast', {
    detail: {
      message,
      type,
      duration,
    },
    bubbles: true,
    cancelable: true,
  })
  window.dispatchEvent(event)
}

export function toastError(message: string, duration?: number) {
  dispatchToast(message, 'error', duration)
}

export function toastSuccess(message: string, duration?: number) {
  dispatchToast(message, 'success', duration)
}

export function toastWarn(message: string, duration?: number) {
  dispatchToast(message, 'warn', duration)
}

export function toastInfo(message: string, duration?: number) {
  dispatchToast(message, 'info', duration)
}
