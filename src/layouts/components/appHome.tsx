import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { menuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    const useMenuStore = menuStore()
    const { appMenuCollapse, appDrawerAside } = storeToRefs(useMenuStore)

    const { width } = useWindowSize()

    const handleClickCollapse = () => {
      useMenuStore.setAppMenuCollapse(!appMenuCollapse.value)
    }

    const handleClickOpen = () => {
      useMenuStore.setAppDrawerAside(!appDrawerAside.value)
    }

    return () => (
      <div style={{ transition: 'var(--el-transition-all)' }}>
        {width.value >= 900 ? (
          <ElButton
            text
            circle
            bg
            onClick={handleClickCollapse}
          >
            <ElIcon size={16}>
              {appMenuCollapse.value ? <Fold /> : <Expand />}
            </ElIcon>
          </ElButton>
        ) : (
          <ElButton
            text
            circle
            bg
            onClick={handleClickOpen}
          >
            <ElIcon size={16}>
              {appMenuCollapse.value ? <Fold /> : <Expand />}
            </ElIcon>
          </ElButton>
        )}
      </div>
    )
  },
})
