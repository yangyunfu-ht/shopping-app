import { defineStore } from 'pinia'
import { ref } from 'vue'

export const tokenStore = defineStore(
  'token',
  () => {
    const token = ref('')

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    return {
      token,
      setToken,
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
