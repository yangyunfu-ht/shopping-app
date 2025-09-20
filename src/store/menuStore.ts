import type { Tag } from '#/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const router = useRouter()

    const appMenus = ref<RouteRecordRaw[]>([])
    const appMenuCollapse = ref(false)
    const appDrawerAside = ref(false)
    const appTagsHistory = ref<Tag[]>([])

    const setAppMenus = (menus: RouteRecordRaw[]) => {
      appMenus.value = menus
    }

    const setAppMenuCollapse = (expand: boolean) => {
      appMenuCollapse.value = expand
    }

    const setAppDrawerAside = (visible: boolean) => {
      appDrawerAside.value = visible
    }

    const addAppTagsHistory = (tag: Tag) => {
      appTagsHistory.value.unshift(tag)
    }

    const removeAppTagsHistory = (tag: Tag) => {
      appTagsHistory.value = appTagsHistory.value.filter(
        (t) => t.fullPath !== tag.fullPath
      )
    }

    const closeOtherTags = (tag: Tag) => {
      appTagsHistory.value = appTagsHistory.value.filter(
        (t) => t.fullPath === tag.fullPath
      )
      router.push(tag.fullPath)
    }

    const closeAllTags = () => {
      appTagsHistory.value = []
      router.push('/')
    }

    const resetStore = () => {
      appMenus.value = []
      appMenuCollapse.value = false
      appDrawerAside.value = false
      appTagsHistory.value = []
    }

    return {
      appMenus,
      appMenuCollapse,
      appDrawerAside,
      appTagsHistory,
      setAppMenus,
      setAppMenuCollapse,
      setAppDrawerAside,
      addAppTagsHistory,
      removeAppTagsHistory,
      closeOtherTags,
      closeAllTags,
      resetStore,
    }
  },
  {
    persist: {
      key: 'menu',
      pick: ['appMenus', 'appMenuCollapse', 'appDrawerAside', 'appTagsHistory'],
      storage: sessionStorage,
    },
  }
)
