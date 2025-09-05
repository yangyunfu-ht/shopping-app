import type { Directive, DirectiveBinding } from 'vue'
import { userStore } from '@/store/userStore'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    const useUserStore = userStore()

    const permissions: string[] = useUserStore.permissions

    if (Array.isArray(value)) {
      const hasPermission = value.some((permissionId) =>
        permissions.includes(permissionId)
      )
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }

    if (!Array.isArray(value)) {
      const hasPermission = permissions.includes(value)
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
