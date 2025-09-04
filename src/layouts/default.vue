<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main style="overflow-y: auto">
        <div style="height: 100%">
          {{ cachedRoutes }}
          <RouterLink
            to="/home"
            style="padding-right: 100px"
            >首页</RouterLink
          >

          <RouterLink
            to="/about"
            style="padding-right: 100px"
            >关于</RouterLink
          >

          <RouterLink
            to="/mine"
            style="padding-right: 100px"
            >我的</RouterLink
          >

          <router-view v-slot="{ Component }">
            <keep-alive :include="cachedRoutes">
              <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cachedRoutes = computed(() => {
  return router
    .getRoutes()
    .filter((route) => route.meta.keepAlive)
    .map((route) => route.name as string)
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;

  .el-aside {
    background-color: var(--el-color-primary);
  }

  .el-header {
    background-color: var(--el-color-danger);
  }

  .el-main {
    --el-main-padding: 8px;
  }
}
</style>
