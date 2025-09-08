import { defineStore } from 'pinia'
import { ref } from 'vue'
import { globalStore } from './globalStore'
import { menuStore } from './menuStore'
import { userStore } from './userStore'

export const tokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const useGlobalStore = globalStore()
    const useMenuStore = menuStore()
    const useUserStore = userStore()

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const removeToken = async () => {
      token.value = ''
      useGlobalStore.$reset()
      useMenuStore.$reset()
      useUserStore.$reset()
    }

    return {
      token,
      setToken,
      removeToken,
    }
  },
  {
    persist: {
      key: 'token',
      pick: ['token'],
      storage: sessionStorage,
    },
  }
)
