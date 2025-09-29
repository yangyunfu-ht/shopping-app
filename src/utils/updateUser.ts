import type { permissionReturn } from '#/user'
import { useRequest } from '@/hooks/useRequest'
import { useTokenStore } from '@/store/tokenStore'
import { useUserStore } from '@/store/userStore'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'
import { Api } from '@/pages/login/api'
import { useMessage } from '@/hooks/useMessage'

export const updateUser = async () => {
  const tokenStore = useTokenStore()
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const { token } = storeToRefs(tokenStore)
  const { request } = useRequest()

  if (!token.value) return false

  try {
    const permission = await request<permissionReturn>({
      url: Api.permission,
      method: 'get',
    })
    if (permission.code === 0) {
      const hasPermissions = await userStore.setPermissions(permission.data)
      const hasMenus = await menuStore.setAppMenus(permission.data.menus)
      return hasPermissions && hasMenus
    } else {
      useMessage({
        message: permission.msg,
        type: 'error',
      })
      return false
    }
  } catch (err: any) {
    useMessage({
      message: err.message,
      type: 'error',
    })
    return false
  }
}
