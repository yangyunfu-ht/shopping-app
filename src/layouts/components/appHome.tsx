import { ElButton, ElIcon } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'
import { screenSize } from '@/utils/enum'
import { useGlobalStore } from '@/store/globalStore'

export default defineComponent({
  name: 'AppSetting',
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
      <div style={{ transition: 'var(--el-transition-all)' }}>
        {isLarge.value ? (
          <ElButton
            text
            circle
            bg
            size="large"
            onClick={handleClickMenuCollapse}
          >
            <ElIcon size={20}>
              {appMenuCollapse.value ? <Fold /> : <Expand />}
            </ElIcon>
          </ElButton>
        ) : (
          <ElButton
            text
            circle
            bg
            size="large"
            onClick={handleClickDrawerCollapse}
          >
            <ElIcon size={20}>
              {appMenuCollapse.value ? <Fold /> : <Expand />}
            </ElIcon>
          </ElButton>
        )}
      </div>
    )
  },
})
