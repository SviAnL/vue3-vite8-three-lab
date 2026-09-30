/** 路由过渡动画类型 */
export type TransitionName =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom'
  | 'zoom-bounce'
  | 'flip'
  | 'fade-down'
  | 'fade-up'
  | 'scale-fade'
  | 'slide-fade'

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由标题*/
    titleKey?: string

    /** 路由过渡动画*/
    transition?: TransitionName

    /** 是否禁止缓存*/
    noKeepAlive?: boolean

    /** 是否显示阅读进度条*/
    hasProgress?: boolean
  }
}
