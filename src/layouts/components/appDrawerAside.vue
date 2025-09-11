<template>
  <el-drawer
    v-model="visible"
    direction="ltr"
    title=""
    :show-close="false"
    :with-header="false"
    :size="210"
    @close="handleClose"
  >
    <div class="app-drawer-aside">
      <app-logo></app-logo>

      <div class="app-drawer-menu">
        <render-app-menu
          :menus="menus"
          :collapse="false"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import appLogo from './appLogo'
import renderAppMenu from './renderAppMenu'
import { menuStore } from '@/store/menuStore'

const useMenuStore = menuStore()
const menus = computed(() => useMenuStore.appMenus)

const visible = computed(() => useMenuStore.appDrawerAside)

const handleClose = () => {
  useMenuStore.setAppDrawerAside(false)
}
</script>

<style lang="scss" scoped>
.app-drawer-aside {
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;

  .app-drawer-menu {
    padding: 8px;
    box-sizing: border-box;
  }
}
</style>
