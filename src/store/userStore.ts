import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const username = ref('')
    const password = ref('')
    const permissions = ref<string[]>([])

    const setPermissions = (userPermissions: string[]) => {
      permissions.value = userPermissions
    }

    const resetStore = () => {
      username.value = ''
      password.value = ''
      permissions.value = []
    }

    return {
      username,
      password,
      permissions,
      setPermissions,
      resetStore,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['username', 'password', 'permissions'],
      storage: sessionStorage,
    },
  }
)
