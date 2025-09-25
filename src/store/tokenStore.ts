import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGlobalStore } from './globalStore'
import { useMenuStore } from './menuStore'
import { useUserStore } from './userStore'
import type { LoginReturn } from '#/user'

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const refreshToken = ref('')
    const expiresTime = ref<number | null>(null)

    const globalStore = useGlobalStore()
    const menuStore = useMenuStore()
    const userStore = useUserStore()

    const setToken = (params: LoginReturn): Promise<LoginReturn | null> => {
      return new Promise((resolve, reject) => {
        if (params.accessToken && params.refreshToken && params.refreshToken) {
          token.value = params.accessToken
          refreshToken.value = params.refreshToken
          expiresTime.value = params.expiresTime
          resolve(params)
        } else {
          reject(null)
        }
      })
    }

    const removeToken = async () => {
      token.value = ''
      refreshToken.value = ''
      expiresTime.value = null
      globalStore.resetStore()
      menuStore.resetStore()
      userStore.resetStore()
    }

    return {
      token,
      refreshToken,
      expiresTime,
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
