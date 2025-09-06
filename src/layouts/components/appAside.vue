<template>
  <aside class="app-aside-element">
    <appLogo class="app-logo" />

    <searchAppMenu class="app-menu-search" />

    <renderAppMen
      class="app-menu-data"
      :menus="menus"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import appLogo from './appLogo'
import searchAppMenu from './searchAppMenu'
import renderAppMen from './renderAppMenu'
import { menuStore } from '@/store/menuStore'

const useMenuStore = menuStore()
const menus = computed(() => useMenuStore.appMenus)
</script>

<style lang="scss" scoped>
.app-aside-element {
  display: flex;
  flex-direction: column;

  .app-logo {
    height: 60px;
    flex-shrink: 0;
  }

  .app-menu-search {
    height: 60px;
    flex-shrink: 0;
  }

  .app-menu-data {
    flex-grow: 1;
  }
}
</style>
