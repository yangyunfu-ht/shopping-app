import { computed, defineComponent, KeepAlive, Transition } from 'vue'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'
import { screenSize } from '@/utils/enum'
import LargeAside from './components/largeAside.vue'
import AppHeader from './components/appHeader.vue'
import { RouterView, useRouter } from 'vue-router'
import '../styles/layout.scss'

export default defineComponent({
  name: 'AppLayout',
  components: {
    LargeAside,
    AppHeader,
  },
  setup() {
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

    return () => (
      <div class="layout-app">
        {isLarge.value ? <LargeAside class="layout-app__aside" /> : null}

        <section class="layout-app__content">
          <AppHeader class="layout-app__content__header" />

          <main class="layout-app__content__main">
            <RouterView
              v-slots={{
                default: ({ Component }: { Component: any }) => (
                  <KeepAlive include={cachedRoutes.value}>
                    <Transition
                      name="fade"
                      mode="out-in"
                    >
                      {Component ? <Component /> : null}
                    </Transition>
                  </KeepAlive>
                ),
              }}
            />
          </main>
        </section>
      </div>
    )
  },
})
