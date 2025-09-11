import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Bell, SwitchButton } from '@element-plus/icons-vue'
import { tokenStore } from '@/store/tokenStore'
import router from '@/router'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    const useTokenStore = tokenStore()
    const handleOnLoginOut = () => {
      useTokenStore.removeToken().finally(() => {
        router.replace({
          path: '/login',
        })
        window.location.reload()
      })
    }

    return () => (
      <div>
        <ElButton
          text
          circle
          bg
        >
          <ElIcon size={16}>
            <Bell />
          </ElIcon>
        </ElButton>

        <ElButton
          text
          circle
          bg
          onClick={handleOnLoginOut}
        >
          <ElIcon size={16}>
            <SwitchButton />
          </ElIcon>
        </ElButton>
      </div>
    )
  },
})
