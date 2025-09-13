<template>
  <el-drawer
    v-model="visible"
    direction="ltr"
    title=""
    :show-close="false"
    :with-header="false"
    :size="218"
    @close="handleClose"
  >
    <div class="app-drawer-aside">
      <app-logo />

      <search-app-menu @select="handleClose" />

      <render-app-menu
        :menus="menus"
        :collapse="false"
      />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import appLogo from './appLogo'
import searchAppMenu from './searchAppMenu'
import renderAppMenu from './renderAppMenu'
import { useMenuStore } from '@/store/menuStore'

const menuStore = useMenuStore()
const menus = computed(() => menuStore.appMenus)

const visible = computed(() => menuStore.appDrawerAside)

const handleClose = () => {
  menuStore.setAppDrawerAside(false)
}
</script>

<style lang="scss" scoped>
.app-drawer-aside {
  display: grid;
  grid-template-rows: 70px 50px 1fr;
  grid-template-columns: 1fr;
  padding: 8px;
  box-sizing: border-box;
}
</style>
