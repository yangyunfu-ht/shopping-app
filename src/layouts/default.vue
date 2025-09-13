<template>
  <div class="app-container">
    <app-aside
      :app-width="appWidth"
      class="app-aside"
    />

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
import appAside from '@/layouts/components/appAside'
import appHeader from '@/layouts/components/appHeader.vue'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const globalStore = useGlobalStore()
const { appWidth } = storeToRefs(globalStore)

const cachedRoutes = computed(() => {
  return router
    .getRoutes()
    .filter((route) => route.meta.keepAlive)
    .map((route) => route.name as string)
})
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
  .app-container {
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;
    grid-template-rows: 1fr;
    background-color: var(--bg-color);

    .app-aside {
      box-shadow: var(--box-shadow);
    }

    .app-content {
      min-height: 100%;
      display: grid;
      grid-template-rows: 56px 1fr;
      row-gap: 8px;
      grid-template-columns: 1fr;
      overflow: hidden;

      .app-header {
        height: 100%;
      }

      .app-content__main {
        height: 100%;
        padding-right: 8px;
        padding-bottom: 8px;
        box-sizing: border-box;
        overflow-y: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
    }
  }
}

@media (max-width: 768px) {
  .app-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    background-color: var(--bg-color);

    .app-content {
      height: 100%;
      display: grid;
      grid-template-rows: 56px 1fr;
      grid-template-columns: 1fr;
      row-gap: 8px;
      padding: 8px;
      box-sizing: border-box;
      overflow: hidden;

      .app-header {
        height: 100%;
      }

      .app-content__main {
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}

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
