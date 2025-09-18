<template>
  <div class="page-layout">
    <div class="page-layout-search">
      <slot name="search"></slot>
    </div>
    <div class="page-layout-content">
      <div class="page-layout-buttons">
        <slot name="buttons"></slot>
      </div>
      <div class="page-layout-table">
        <slot name="table"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page-layout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  row-gap: 8px;
  transition: var(--el-transition-all);
  overflow: auto;

  .page-layout-search {
    background-color: var(--el-color-white);
    box-shadow: var(--box-shadow);
  }

  .page-layout-content {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    background-color: var(--el-color-white);
    row-gap: 8px;
    padding: 8px;
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
  }

  .page-layout-buttons {
    padding: 4px 0;
  }

  .page-layout-table {
    height: 100%;
  }
}
</style>
