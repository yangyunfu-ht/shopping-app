import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Bell, Setting, SwitchButton, User } from '@element-plus/icons-vue'
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
      <>
        <ElButton text>
          <ElIcon size={16}>
            <Bell />
          </ElIcon>
        </ElButton>
        <ElButton text>
          <ElIcon size={16}>
            <Setting />
          </ElIcon>
        </ElButton>
        <ElButton text>
          <ElIcon size={16}>
            <User />
          </ElIcon>
        </ElButton>
        <ElButton
          text
          onClick={handleOnLoginOut}
        >
          <ElIcon size={16}>
            <SwitchButton />
          </ElIcon>
        </ElButton>
      </>
    )
  },
})
