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
  display: flex;
  flex-direction: column;
  transition: var(--el-transition-all);
  background-color: var(--el-color-white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  .page-layout-search {
    border-bottom: 2px solid var(--bg-color);
  }

  .page-layout-content {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    padding: 8px;
    box-sizing: border-box;

    .page-layout-buttons {
      padding: 4px 0;
    }

    .page-layout-table {
      flex-grow: 1;
    }
  }
}
</style>
