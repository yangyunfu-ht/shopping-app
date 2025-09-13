import { defineComponent } from 'vue'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'AppLogo',
  setup() {
    const menuStore = useMenuStore()
    const { appMenuCollapse } = storeToRefs(menuStore)
    return () => (
      <div
        style={{
          width: appMenuCollapse.value ? '64px' : '210px',

          boxSizing: 'border-box',
          transition: 'var(--el-transition-all)',
        }}
      >
        <div style={{ backgroundColor: '#f5f5f5', height: '100%' }}></div>
      </div>
    )
  },
})
