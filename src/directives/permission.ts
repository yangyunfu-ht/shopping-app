import type { Directive, DirectiveBinding } from 'vue'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    const permissions: string[] = []

    // 如果指令绑定的值是一个数组，则表示需要多个权限中的任意一个
    if (Array.isArray(value)) {
      const hasPermission = value.some((permissionId) =>
        permissions.includes(permissionId)
      )
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }

    // 如果指令绑定的值是字符串，则表示需要单个权限
    if (!Array.isArray(value)) {
      const hasPermission = permissions.includes(value)
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
