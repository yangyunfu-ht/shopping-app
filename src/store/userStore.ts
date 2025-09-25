import type { permissionReturn, User } from '#/user'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const permissions = ref<string[]>([])
    const user = reactive<User>({
      avatar: '',
      deptId: null,
      email: '',
      id: null,
      nickname: '',
      username: '',
    })

    const setPermissions = (params: permissionReturn): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (params.permissions.length && params.user) {
          permissions.value = params.permissions
          user.avatar = params.user.avatar
          user.deptId = params.user.deptId
          user.email = params.user.email
          user.id = params.user.id
          user.nickname = params.user.nickname
          user.username = params.user.username
          resolve(true)
        } else {
          reject(false)
        }
      })
    }

    const resetStore = () => {
      permissions.value = []
      user.avatar = ''
      user.deptId = null
      user.email = ''
      user.id = null
      user.nickname = ''
      user.username = ''
    }

    return {
      permissions,
      setPermissions,
      resetStore,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['permissions', 'user'],
      storage: sessionStorage,
    },
  }
)
