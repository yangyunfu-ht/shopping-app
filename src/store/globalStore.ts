import { defineStore } from 'pinia'
import { ref } from 'vue'

export const globalStore = defineStore(
  'global',
  () => {
    const isRequestLocked = ref(false)

    const lockREquests = () => {
      isRequestLocked.value = true
    }

    const unlockRequests = () => {
      isRequestLocked.value = false
    }

    return {
      isRequestLocked,
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
