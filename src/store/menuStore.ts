import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const menuStore = defineStore(
  'menu',
  () => {
    const appMenus = ref<RouteRecordRaw[]>([])

    const setAppMenus = (menus: RouteRecordRaw[]) => {
      appMenus.value = menus
    }

    return {
      appMenus,
      setAppMenus,
    }
  },
  {
    persist: {
      key: 'menu',
      pick: ['appMenus'],
      storage: sessionStorage,
    },
  }
)
