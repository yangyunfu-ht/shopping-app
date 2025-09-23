import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGlobalStore } from './globalStore'
import { useMenuStore } from './menuStore'
import { useUserStore } from './userStore'
import { useRouter } from 'vue-router'

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('Bearer aa3773e4383e442388691d219d820a34')

    const router = useRouter()
    const globalStore = useGlobalStore()
    const menuStore = useMenuStore()
    const userStore = useUserStore()

    const setToken = (newToken: string) => {
      token.value = newToken
      router.replace({ path: '/home/homePage' })
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
