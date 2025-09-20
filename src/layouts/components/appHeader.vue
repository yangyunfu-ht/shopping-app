<template>
  <header class="app-header-element">
    <div class="app-header-element__top">
      <appHome />
      <appSetting />
    </div>
    <div class="app-header-element__bottom">
      <appTag />
    </div>
  </header>
</template>

<script setup lang="ts">
import appHome from './appHome'
import appSetting from './appSetting'
import appTag from './appTag.vue'
</script>

<style lang="scss" scoped>
.app-header-element {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .app-header-element__top {
    background-color: var(--el-color-white);
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 8px;
    box-sizing: border-box;
  }

  .app-header-element__bottom {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    box-sizing: border-box;
  }
}
</style>
