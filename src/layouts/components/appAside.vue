<template>
  <aside
    class="app-aside-element"
    :style="{ width: collapse ? '80px' : '210px' }"
  >
    <appLogo class="app-logo" />

    <searchAppMenu class="app-menu-search" />

    <renderAppMen
      class="app-menu-data"
      :menus="menus"
      :collapse="collapse"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import appLogo from './appLogo'
import searchAppMenu from './searchAppMenu'
import renderAppMen from './renderAppMenu'
import { menuStore } from '@/store/menuStore'
import { useWindowSize, watchThrottled } from '@vueuse/core'

const useMenuStore = menuStore()
const menus = computed(() => useMenuStore.appMenus)
const collapse = computed(() => useMenuStore.appMenuCollapse)

const { width } = useWindowSize()

watchThrottled(
  () => width.value,
  (value: number) => {
    if (value <= 1100) {
      useMenuStore.setAppMenuCollapse(true)
      useMenuStore.setAppDrawerAside(false)
    }
    if (value > 1100) {
      useMenuStore.setAppMenuCollapse(false)
      useMenuStore.setAppDrawerAside(false)
    }
    if (value <= 900) {
      useMenuStore.setAppMenuCollapse(true)
      useMenuStore.setAppDrawerAside(false)
    }
  },
  { throttle: 500 }
)
</script>

<style lang="scss" scoped>
.app-aside-element {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  box-sizing: border-box;
  background-color: #fff;
  transition: var(--el-transition-all);

  .app-logo,
  .app-menu-search {
    box-sizing: border-box;
    flex-shrink: 0;
  }
}
</style>
