<template>
  <header class="app-header-element">
    <appBreadcrumb />

    <div>
      <appSetting />
    </div>
  </header>
</template>

<script setup lang="ts">
import appBreadcrumb from './appBreadcrumb'
import appSetting from './appSetting'
</script>

<style lang="scss" scoped>
.app-header-element {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  box-sizing: border-box;
}

:deep(.el-breadcrumb) {
  font-size: 16px;
}
</style>
