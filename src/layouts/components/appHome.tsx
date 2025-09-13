import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import { screenSize } from '@/utils/enum'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    const menuStore = useMenuStore()
    const { appMenuCollapse } = storeToRefs(menuStore)

    const { width } = useWindowSize()

    const handleClickCollapse = () => {
      if (width.value < screenSize.small) {
        menuStore.setAppMenuCollapse(!appMenuCollapse.value)
        menuStore.setAppDrawerAside(true)
      } else {
        menuStore.setAppMenuCollapse(!appMenuCollapse.value)
      }
    }

    return () => (
      <div style={{ transition: 'var(--el-transition-all)' }}>
        <ElButton
          text
          circle
          bg
          onClick={handleClickCollapse}
        >
          <ElIcon size={20}>
            {appMenuCollapse.value ? <Fold /> : <Expand />}
          </ElIcon>
        </ElButton>
      </div>
    )
  },
})
