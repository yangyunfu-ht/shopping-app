<template>
  <div class="page-layout">
    <div class="page-layout-search">
      <slot name="search"></slot>
    </div>
    <div class="page-layout-buttons">
      <slot name="buttons"></slot>
    </div>
    <div class="page-layout-table">
      <slot name="table"></slot>
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
  grid-template-rows: auto auto 1fr;
  grid-template-columns: 1fr;
  background-color: #fff;
  row-gap: 8px;

  .page-layout-search {
    border-bottom: 4px solid #f5f5f5;
  }

  .page-layout-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 8px;
  }

  .page-layout-table {
    padding: 0 8px 8px 8px;
    transition: all var(--el-transition-all);
  }
}
</style>
