<template>
  <div class="app-container">
    <app-aside class="app-aside" />

    <section class="app-content">
      <app-header class="app-header" />

      <main class="app-content__main">
        <RouterView v-slot="{ Component }">
          <KeepAlive :include="cachedRoutes">
            <component :is="Component"></component>
          </KeepAlive>
        </RouterView>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import appAside from '@/layouts/components/appAside.vue'
import appHeader from '@/layouts/components/appHeader.vue'

const router = useRouter()

const cachedRoutes = computed(() => {
  return router
    .getRoutes()
    .filter((route) => route.meta.keepAlive)
    .map((route) => route.name as string)
})
</script>

<style lang="scss" scoped>
/* 设置父容器，使其占据整个视口 */
.app-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh; /* 100vh 表示视口高度的100% */
}

/* 左侧边栏固定宽度 */
.app-aside {
  width: 210px;
  background-color: var(--el-color-primary);
  flex-shrink: 0; /* 阻止左侧边栏收缩 */
}

/* 内容区，占据剩余空间 */
.app-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 占据剩余的垂直空间 */
  overflow: hidden; /* 防止父容器滚动，将滚动行为交给子元素 */
}

/* 头部固定高度 */
.app-header {
  height: 56px;
  // background-color: #f5f5f5;
  flex-shrink: 0; /* 阻止头部收缩 */
  border-bottom: 4px solid #f5f5f5;
}

/* 主要内容区，占据剩余空间并允许内部滚动 */
.app-content__main {
  flex-grow: 1; /* 占据剩余的水平空间 */
  background-color: #fff;
  overflow-y: auto; /* 关键：只允许垂直滚动 */
}
</style>
