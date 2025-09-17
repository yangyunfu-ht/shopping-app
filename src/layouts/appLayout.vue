<template>
  <div class="layout-app">
    <AppAside
      v-if="isLarge"
      class="layout-app__aside"
    />

    <section class="layout-app__content">
      <AppHeader class="layout-app__content__header" />

      <main class="layout-app__content__main">
        <RouterView v-slot="{ Component }">
          <Transition
            name="fade"
            mode="out-in"
          >
            <KeepAlive
              :include="cachedRoutes"
              :max="10"
            >
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </main>
    </section>

    <appAsideDrawer v-if="!isLarge" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'
import { screenSize } from '@/utils/enum'
import AppAside from './components/appAside.vue'
import appAsideDrawer from './components/appAsideDrawer.vue'
import AppHeader from './components/appHeader.vue'
import { RouterView, useRouter } from 'vue-router'

defineOptions({
  name: 'AppLayout',
})

const globalStore = useGlobalStore()
const { appWidth } = storeToRefs(globalStore)

const isLarge = computed(() => appWidth.value > screenSize.small)

const router = useRouter()
const cachedRoutes = computed(() => {
  return router
    .getRoutes()
    .filter((route) => route.meta.keepAlive)
    .map((route) => route.name as string)
})
</script>

<style lang="scss">
@use '../styles/layout.scss';
</style>
