import { ElIcon } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'
import { screenSize } from '@/utils/enum'
import { useGlobalStore } from '@/store/globalStore'
import AppBreadcrumb from './appBreadcrumb'

export default defineComponent({
  name: 'AppSetting',
  components: { AppBreadcrumb },
  setup() {
    const menuStore = useMenuStore()
    const globalStore = useGlobalStore()
    const { appWidth } = storeToRefs(globalStore)
    const { appMenuCollapse, appDrawerAside } = storeToRefs(menuStore)

    const isLarge = computed(() => appWidth.value > screenSize.small)

    const handleClickDrawerCollapse = () => {
      menuStore.setAppMenuCollapse(false)
      menuStore.setAppDrawerAside(!appDrawerAside.value)
    }

    const handleClickMenuCollapse = () => {
      menuStore.setAppMenuCollapse(!appMenuCollapse.value)
    }

    return () => (
      <div
        style={{
          transition: 'var(--el-transition-all)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          height: '100%',
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            height: '100%',
            width: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isLarge.value ? (
            <div onClick={handleClickMenuCollapse}>
              <ElIcon size={20}>
                {appMenuCollapse.value ? <Fold /> : <Expand />}
              </ElIcon>
            </div>
          ) : (
            <div onClick={handleClickDrawerCollapse}>
              <ElIcon size={20}>
                {appMenuCollapse.value ? <Fold /> : <Expand />}
              </ElIcon>
            </div>
          )}
        </div>
        <AppBreadcrumb />
      </div>
    )
  },
})
