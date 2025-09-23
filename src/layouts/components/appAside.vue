<template>
  <aside
    class="app-aside-element"
    :style="{ width: collapse ? '64px' : '210px' }"
  >
    <appLogo :collapse="collapse" />

    <searchAppMenu
      :collapse="collapse"
      :drawer-aside="false"
      class="app-menu-search"
    />

    <div class="app-menu-data">
      <renderAppMen
        :menus="menus"
        :collapse="collapse"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import appLogo from './appLogo'
import searchAppMenu from './searchAppMenu'
import renderAppMen from './renderAppMenu'
import { useMenuStore } from '@/store/menuStore'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'
import { screenSize } from '@/utils/enum'

const menuStore = useMenuStore()
const globalStore = useGlobalStore()

const menus = computed(() => menuStore.appMenus)
const collapse = computed(() => menuStore.appMenuCollapse)
const { appMenuCollapse } = storeToRefs(menuStore)
const { appWidth } = storeToRefs(globalStore)

watch(
  () => appWidth.value,
  () => {
    if (appWidth.value <= screenSize.default) {
      if (!appMenuCollapse.value) {
        menuStore.setAppMenuCollapse(true)
      }
    } else {
      if (appMenuCollapse.value) {
        menuStore.setAppMenuCollapse(false)
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.app-aside-element {
  min-height: 100%;
  display: grid;
  grid-template-rows: 72px 56px 1fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  background-color: var(--el-menu-bg-color);
  transition: var(--el-transition-all);

  .app-logo,
  .app-menu-search {
    box-sizing: border-box;
    width: 100%;
  }

  .app-menu-data {
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
