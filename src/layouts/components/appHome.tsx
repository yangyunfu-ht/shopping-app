import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { menuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import { screenSize } from '@/utils/enum'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    const useMenuStore = menuStore()
    const { appMenuCollapse } = storeToRefs(useMenuStore)

    const { width } = useWindowSize()

    const handleClickCollapse = () => {
      if (width.value < screenSize.small) {
        useMenuStore.setAppMenuCollapse(!appMenuCollapse.value)
        useMenuStore.setAppDrawerAside(true)
      } else {
        useMenuStore.setAppMenuCollapse(!appMenuCollapse.value)
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
