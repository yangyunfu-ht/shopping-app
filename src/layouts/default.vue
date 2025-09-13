<template>
  <div class="app-container">
    <app-aside class="app-aside" />
    <appDrawerAside />

    <section class="app-content">
      <app-header class="app-header" />

      <main class="app-content__main">
        <RouterView v-slot="{ Component }">
          <KeepAlive :include="cachedRoutes">
            <Transition
              name="fade"
              mode="out-in"
            >
              <component :is="Component" />
            </Transition>
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
import appDrawerAside from './components/appDrawerAside.vue'

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
  background-color: var(--bg-color);
  padding: 8px 12px;
  gap: 8px;
  box-sizing: border-box;

  /* 左侧边栏固定宽度 */
  .app-aside {
    background-color: #fff;
    flex-shrink: 0; /* 阻止左侧边栏收缩 */
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  /* 内容区，占据剩余空间 */
  .app-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* 占据剩余的垂直空间 */
    overflow: hidden; /* 防止父容器滚动，将滚动行为交给子元素 */
    gap: 8px;

    /* 头部固定高度 */
    .app-header {
      height: auto;
      flex-shrink: 0; /* 阻止头部收缩 */
    }

    // /* 头部固定高度 */
    // .app-tag {
    //   height: 32px;
    //   flex-shrink: 0; /* 阻止头部收缩 */
    // }

    /* 主要内容区，占据剩余空间并允许内部滚动 */
    .app-content__main {
      flex-grow: 1; /* 占据剩余的水平空间 */
      overflow-y: auto; /* 关键：只允许垂直滚动 */
      -webkit-overflow-scrolling: touch;
    }
  }
}

@media (max-width: 768px) {
  .app-container {
    transition: var(--el-transition-all);

    .app-aside {
      display: none;
    }
  }
}

/* 淡入淡出效果的 CSS */

/* 定义过渡的活跃状态 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/* 定义进入和离开的初始/结束状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
