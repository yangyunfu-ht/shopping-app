<template>
  <header class="app-header-element">
    <div class="app-header-left">
      <appHome class="app-header-home" />
      <appBreadcrumb class="app-header-breadcrumb" />
    </div>

    <appSetting class="app-header-setting" />
  </header>
</template>

<script setup lang="ts">
import appHome from './appHome'
import appBreadcrumb from './appBreadcrumb'
import appSetting from './appSetting'
</script>

<style lang="scss" scoped>
.app-header-element {
  display: grid;
  /* 默认布局：一行三列，左右固定宽度，中间自适应 */
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  column-gap: 8px;
  box-sizing: border-box;
  transition: var(--el-transition-all);
  background-color: #fff;
  box-shadow: var(--box-shadow);

  .app-header-left {
    display: flex;
    gap: 8px;
    justify-content: space-around;
    align-items: center;
  }

  .app-header-home,
  .app-header-setting {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
    padding: 8px;
    box-sizing: border-box;
  }

  .app-header-home {
    justify-self: start;
  }

  .app-header-setting {
    justify-self: end;
  }
}
</style>
