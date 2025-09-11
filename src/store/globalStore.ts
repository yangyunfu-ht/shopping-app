import { useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const globalStore = defineStore(
  'global',
  () => {
    const isRequestLocked = ref(false)
    const { width: appWidth } = useWindowSize()

    const lockREquests = () => {
      isRequestLocked.value = true
    }

    const unlockRequests = () => {
      isRequestLocked.value = false
    }

    return {
      isRequestLocked,
      appWidth,
      lockREquests,
      unlockRequests,
    }
  },
  {
    persist: {
      key: 'global',
      pick: ['isRequestLocked'],
      storage: sessionStorage,
    },
  }
)
