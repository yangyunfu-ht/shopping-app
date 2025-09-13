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
import { useMenuStore } from '@/store/menuStore'
import { useWindowSize, watchThrottled } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { screenSize } from '@/utils/enum'

const menuStore = useMenuStore()
const { appMenuCollapse } = storeToRefs(menuStore)
const menus = computed(() => menuStore.appMenus)
const collapse = computed(() => menuStore.appMenuCollapse)

const { width } = useWindowSize()

watchThrottled(
  () => width.value,
  (value: number) => {
    if (value <= screenSize.default && !appMenuCollapse.value) {
      menuStore.setAppMenuCollapse(true)
    }
    if (value >= screenSize.large && appMenuCollapse.value) {
      menuStore.setAppMenuCollapse(false)
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
