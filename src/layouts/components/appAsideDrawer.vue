<template>
  <el-drawer
    v-model="visible"
    :size="210"
    :append-to-body="true"
    :show-close="false"
    direction="ltr"
    @close="handleClose"
  >
    <template #header>
      <div style="background-color: var(--el-menu-bg-color)">
        <appLogo :collapse="false" />

        <searchAppMenu
          :collapse="collapse"
          :drawer-aside="true"
          class="app-menu-search"
        />
      </div>
    </template>

    <div
      class="app-menu-data"
      style="height: 100%"
    >
      <renderAppMen
        :menus="menus"
        :collapse="collapse"
        @select="handleClose"
      />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import appLogo from './appLogo'
import searchAppMenu from './searchAppMenu'
import renderAppMen from './renderAppMenu'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'

const menuStore = useMenuStore()
const { appDrawerAside } = storeToRefs(menuStore)
const menus = computed(() => menuStore.appMenus)
const collapse = computed(() => menuStore.appMenuCollapse)

const visible = computed({
  get() {
    return appDrawerAside.value
  },
  set(val) {
    appDrawerAside.value = val
  },
})

const handleClose = () => {
  menuStore.setAppDrawerAside(false)
}
</script>

<style lang="scss" scoped>
.app-aside-element {
  height: 100%;
  display: grid;
  grid-template-rows: 56px 56px 1fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  background-color: var(--el-menu-bg-color);
  transition: var(--el-transition-all);
  overflow: hidden;

  .app-menu-data {
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--el-menu-bg-color);
  }
}
</style>
