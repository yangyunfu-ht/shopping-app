import type { permissionReturn } from '#/user'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const avatar = ref('')
    const deptId = ref<null | number>(null)
    const email = ref('')
    const userId = ref<null | number>(null)
    const nickname = ref('')
    const username = ref('')
    const permissions = ref<string[]>([])
    const roles = ref<string[]>([])

    const setPermissions = async (
      params: permissionReturn
    ): Promise<boolean> => {
      if (params.permissions.length && params.user?.id) {
        avatar.value = params.user.avatar
        deptId.value = params.user.deptId
        email.value = params.user.email
        userId.value = params.user.id
        nickname.value = params.user.nickname
        username.value = params.user.username
        permissions.value = params.permissions
        roles.value = params.roles

        return true
      } else {
        return false
      }
    }

    const resetStore = () => {
      permissions.value = []
      avatar.value = ''
      deptId.value = null
      email.value = ''
      userId.value = null
      nickname.value = ''
      username.value = ''
    }

    return {
      avatar,
      deptId,
      email,
      userId,
      nickname,
      username,
      permissions,
      roles,
      setPermissions,
      resetStore,
    }
  },
  {
    persist: {
      key: 'user',
      pick: [
        'avatar',
        'deptId',
        'email',
        'userId',
        'nickname',
        'username',
        'permissions',
        'roles',
      ],
      storage: sessionStorage,
    },
  }
)
