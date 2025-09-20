import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGlobalStore } from './globalStore'
import { useMenuStore } from './menuStore'
import { useUserStore } from './userStore'

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const globalStore = useGlobalStore()
    const menuStore = useMenuStore()
    const userStore = useUserStore()

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const removeToken = async () => {
      token.value = ''
      globalStore.resetStore()
      menuStore.resetStore()
      userStore.resetStore()
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
