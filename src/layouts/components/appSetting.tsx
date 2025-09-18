import { ElBadge, ElButton, ElIcon, ElPopover, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import { Bell, FullScreen } from '@element-plus/icons-vue'
import { useTokenStore } from '@/store/tokenStore'
import { useGlobalStore } from '@/store/globalStore'
import router from '@/router'
import { useFullscreen } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import AppMessage from './appMessage.vue'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    const tokenStore = useTokenStore()
    const globalStore = useGlobalStore()
    const { appMessageVisible } = storeToRefs(globalStore)
    const { toggle, isSupported, isFullscreen } = useFullscreen(document.body)

    const handleFullScreen = () => {
      toggle()
    }

    const handleClickMessage = () => {
      globalStore.setAppMessageVisible(!appMessageVisible.value)
    }

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
        {isSupported.value ? (
          <ElTooltip
            effect="dark"
            content={isFullscreen.value ? '退出全屏' : '全屏模式'}
            placement="bottom"
          >
            <ElButton
              text
              circle
              bg
              size="large"
              onClick={handleFullScreen}
            >
              <ElIcon size={16}>
                <FullScreen />
              </ElIcon>
            </ElButton>
          </ElTooltip>
        ) : null}

        <ElTooltip
          effect="dark"
          content="通知消息"
          placement="bottom"
        >
          <ElBadge
            isDot
            offset={[-5, 5]}
          >
            <ElButton
              text
              circle
              bg
              size="large"
              onClick={handleClickMessage}
            >
              <ElIcon size={16}>
                <Bell />
              </ElIcon>
            </ElButton>
          </ElBadge>
        </ElTooltip>

        <ElPopover
          placement="bottom-start"
          width={100}
          trigger="click"
          v-slots={{
            reference: () => (
              <ElButton
                text
                circle
                bg
                size="large"
                style={{
                  '--el-fill-color-light': 'var(--el-menu-hover-bg-color)',
                }}
              >
                <span>杨</span>
              </ElButton>
            ),
            default: () => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <ElButton
                  text
                  style={{ width: '100%', margin: 0 }}
                >
                  修改密码
                </ElButton>

                <ElButton
                  text
                  onClick={handleOnLoginOut}
                  style={{ width: '100%', margin: 0 }}
                >
                  退出登录
                </ElButton>
              </div>
            ),
          }}
        ></ElPopover>

        <AppMessage />
      </div>
    )
  },
})
