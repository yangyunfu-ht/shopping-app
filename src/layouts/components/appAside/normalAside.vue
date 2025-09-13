<template>
  <aside
    class="app-aside-element"
    :style="{ width: collapse ? '64px' : '210px' }"
  >
    <appLogo />

    <searchAppMenu class="app-menu-search" />

    <div class="app-menu-data">
      <renderAppMen
        :menus="menus"
        :collapse="collapse"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import appLogo from '../appLogo'
import searchAppMenu from '../searchAppMenu'
import renderAppMen from '../renderAppMenu'
import { useMenuStore } from '@/store/menuStore'

const menuStore = useMenuStore()
const menus = computed(() => menuStore.appMenus)
const collapse = computed(() => menuStore.appMenuCollapse)
</script>

<style lang="scss" scoped>
.app-aside-element {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 56px 56px 1fr;
  grid-template-columns: 1fr;

  box-sizing: border-box;
  background-color: #fff;
  transition: var(--el-transition-all);

  .app-logo,
  .app-menu-search {
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .app-menu-data {
    overflow-y: auto;
  }
}
</style>
