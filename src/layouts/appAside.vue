<template>
  <div class="app-aside-element">
    <div class="app-logo">app-logo</div>
    <div class="app-menu-search">app-menu-search</div>
    <div class="app-menu-data">
      <renderAppMen :menus="menus" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
