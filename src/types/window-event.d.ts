/** 全局Toast事件类型 */
export type ToastType = 'error' | 'success' | 'warn' | 'info'

/** 全局Toast事件详情 */
export interface ToastDetail {
  message: string
  type: ToastType
  /** 毫秒，默认3000 */
  duration?: number
}

declare global {
  interface WindowEventMap {
    'app:toast': CustomEvent<ToastDetail>
  }
}

export {}
