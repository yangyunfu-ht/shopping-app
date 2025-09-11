import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const menuStore = defineStore(
  'menu',
  () => {
    const appMenus = ref<RouteRecordRaw[]>([])
    const appMenuCollapse = ref(false)
    const appDrawerAside = ref(false)

    const setAppMenus = (menus: RouteRecordRaw[]) => {
      appMenus.value = menus
    }

    const setAppMenuCollapse = (expand: boolean) => {
      appMenuCollapse.value = expand
    }

    const setAppDrawerAside = (visible: boolean) => {
      appDrawerAside.value = visible
    }

    return {
      appMenus,
      appMenuCollapse,
      appDrawerAside,
      setAppMenus,
      setAppMenuCollapse,
      setAppDrawerAside,
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
