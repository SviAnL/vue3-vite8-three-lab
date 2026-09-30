import type { Directive, DirectiveBinding } from 'vue'

type ClickOutsideHandler = {
  documentHandler: (mouseup: MouseEvent, mousedown: MouseEvent) => void
  bindingFn: (mouseup: MouseEvent, mousedown: MouseEvent) => void
}

const nodeList = new Map<HTMLElement, ClickOutsideHandler[]>()

let startClick: MouseEvent | null = null

document.addEventListener('mousedown', (e) => {
  startClick = e
})
document.addEventListener('mouseup', (e) => {
  // 触发所有注册的 handler
  for (const handlers of nodeList.values()) {
    handlers.forEach(({ documentHandler }) => {
      if (!startClick) return
      documentHandler(e, startClick)
    })
  }
})

/**
 * 创建外部点击判断函数
 * @param el 绑定指令的元素
 * @param binding 指令binding
 */
function createDocumentHandler(
  el: HTMLElement,
  binding: DirectiveBinding<(mouseup: MouseEvent, mousedown: MouseEvent) => void>,
) {
  let excludes: HTMLElement[] = []
  const arg = binding.arg
  if (Array.isArray(arg)) {
    excludes = arg
  } else if (arg && arg instanceof HTMLElement) {
    excludes = [arg]
  }

  return function (mouseup: MouseEvent, mousedown: MouseEvent) {
    const mouseUpTarget = mouseup.target as Node | null
    const mouseDownTarget = mousedown?.target as Node | null

    // 边界兜底
    if (!mouseUpTarget || !mouseDownTarget) return

    // 1.点击在el内部 2.点击本身
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget)
    const isSelf = el === mouseUpTarget

    // 3.点击在排除元素内
    const isTargetExcluded =
      excludes.length &&
      excludes.some((item) => item.contains(mouseUpTarget) || item.contains(mouseDownTarget))

    if (isContainedByEl || isSelf || isTargetExcluded) {
      return
    }

    // 点击外部，执行回调
    binding.value(mouseup, mousedown)
  }
}

export const vClickOutside: Directive<
  HTMLElement,
  (mouseup: MouseEvent, mousedown: MouseEvent) => void
> = {
  beforeMount(el, binding) {
    // 校验必须传入函数
    if (typeof binding.value !== 'function') {
      console.warn('[vClickOutside] value must be a function')
      return
    }
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }
    const handlers = nodeList.get(el)
    if (!handlers) return
    handlers.push({
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    })
  },

  updated(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[vClickOutside] value must be a function')
      return
    }
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }
    const handlers = nodeList.get(el)
    if (!handlers) return

    const oldIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue)
    const newHandler = {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    }
    if (oldIndex >= 0) {
      handlers.splice(oldIndex, 1, newHandler)
    } else {
      handlers.push(newHandler)
    }
  },

  unmounted(el) {
    // 删除当前元素所有handler
    nodeList.delete(el)
  },
}
