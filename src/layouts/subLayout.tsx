import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import appAside from '@/layouts/components/appAside'
import appHeader from '@/layouts/components/appHeader.vue'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'
import { Transition, KeepAlive } from 'vue'

export default defineComponent({
  name: 'SmallLayout',
  components: {
    appAside,
    appHeader,
  },
  setup() {
    const router = useRouter()
    const globalStore = useGlobalStore()
    const { appWidth } = storeToRefs(globalStore)

    const cachedRoutes = computed(() => {
      return router
        .getRoutes()
        .filter((route) => route.meta.keepAlive)
        .map((route) => route.name as string)
    })

    return () => (
      <div class="app-container">
        <appAside
          appWidth={appWidth.value}
          class="app-aside"
        />

        <section class="app-content">
          <appHeader class="app-header" />

          <main class="app-content__main">
            <router-view
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
