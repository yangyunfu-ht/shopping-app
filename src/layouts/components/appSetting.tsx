import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Bell, SwitchButton } from '@element-plus/icons-vue'
import { useTokenStore } from '@/store/tokenStore'
import router from '@/router'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    const tokenStore = useTokenStore()
    const handleOnLoginOut = () => {
      tokenStore.removeToken().finally(() => {
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
