<template>
  <div class="page">
    <div class="page-menu__tree">菜单信息</div>
    <div class="page-menu__table"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: grid;
  grid-template-columns: 230px 1fr;
  grid-template-rows: 1fr;
  gap: 8px;
  box-sizing: border-box;

  .page-menu__tree {
    padding: 8px;
    box-sizing: border-box;
    background-color: var(--el-color-white);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }

  .page-menu__table {
    padding: 8px;
    box-sizing: border-box;
    background-color: var(--el-color-white);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }
}
</style>
