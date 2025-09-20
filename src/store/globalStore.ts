import { useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const isRequestLocked = ref(false)
    const { width: appWidth } = useWindowSize()
    const appMessageVisible = ref(false)

    const lockREquests = () => {
      isRequestLocked.value = true
    }

    const unlockRequests = () => {
      isRequestLocked.value = false
    }

    const setAppMessageVisible = (visible: boolean) => {
      appMessageVisible.value = visible
    }

    const resetStore = () => {
      isRequestLocked.value = false
      appMessageVisible.value = false
    }

    return {
      isRequestLocked,
      appWidth,
      appMessageVisible,
      lockREquests,
      unlockRequests,
      setAppMessageVisible,
      resetStore,
    }
  },
  {
    persist: {
      key: 'global',
      pick: ['isRequestLocked', 'appWidth', 'appMessageVisible'],
      storage: sessionStorage,
    },
  }
)
