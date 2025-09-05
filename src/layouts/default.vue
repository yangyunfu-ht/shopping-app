<template>
  <div class="app-container">
    <header
      class="app-header"
      style="padding-left: 200px"
    >
      app-header
      <RouterLink
        to="/home"
        style="margin-right: 100px"
        >首页</RouterLink
      >
      <RouterLink
        to="/about"
        style="margin-right: 100px"
        >关于</RouterLink
      >
      <RouterLink
        to="/mine"
        style="margin-right: 100px"
        >我的</RouterLink
      >
      <RouterLink
        to="/data"
        style="margin-right: 100px"
        >数据</RouterLink
      >
    </header>
    <section class="app-content">
      <aside class="app-content__aside">app-content__aside</aside>
      <main class="app-content__main">
        <!-- <div>app-content__main</div> -->
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
  flex-direction: column;
  height: 100vh; /* 100vh 表示视口高度的100% */
}

/* 头部固定高度 */
.app-header {
  height: 50px;
  background-color: #f0f0f0;
  flex-shrink: 0; /* 阻止头部收缩 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 内容区，占据剩余空间 */
.app-content {
  display: flex;
  flex-grow: 1; /* 占据剩余的垂直空间 */
  overflow: hidden; /* 防止父容器滚动，将滚动行为交给子元素 */
}

/* 左侧边栏固定宽度 */
.app-content__aside {
  width: 200px;
  background-color: #e0e0e0;
  flex-shrink: 0; /* 阻止左侧边栏收缩 */
}

/* 主要内容区，占据剩余空间并允许内部滚动 */
.app-content__main {
  flex-grow: 1; /* 占据剩余的水平空间 */
  background-color: #fff;
  overflow-y: auto; /* 关键：只允许垂直滚动 */
  padding: 8px;
}
</style>
