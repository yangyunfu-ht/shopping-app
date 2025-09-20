import { ElBadge, ElButton, ElIcon, ElPopover, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import {
  ArrowRight,
  Bell,
  FullScreen,
  SwitchButton,
  Unlock,
} from '@element-plus/icons-vue'
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
      <div
        style={{
          transition: 'var(--el-transition-all)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '36px',
        }}
      >
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
          width={200}
          trigger="click"
          v-slots={{
            reference: () => (
              <div
                role="button"
                style={{
                  height: 'var(--el-component-size-large)',
                  width: 'var(--el-component-size-large)',
                  backgroundColor: 'var(--el-color-primary)',
                  color: 'var(--el-color-white)',
                  borderRadius: 'var(--el-border-radius-circle)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span>杨</span>
              </div>
            ),
            default: () => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div class="app-setting-row">
                  <div class="app-setting-icon">
                    <ElIcon size={16}>
                      <Unlock />
                    </ElIcon>
                  </div>
                  <div class="app-setting-label">修改密码</div>
                  <div class="app-setting-icon">
                    <ElIcon size={16}>
                      <ArrowRight />
                    </ElIcon>
                  </div>
                </div>
                <div
                  class="app-setting-row"
                  onClick={handleOnLoginOut}
                >
                  <div class="app-setting-icon">
                    <ElIcon size={16}>
                      <SwitchButton />
                    </ElIcon>
                  </div>
                  <div class="app-setting-label">退出登录</div>
                  <div class="app-setting-icon">
                    <ElIcon size={16}>
                      <ArrowRight />
                    </ElIcon>
                  </div>
                </div>
              </div>
            ),
          }}
        ></ElPopover>

        <AppMessage />
      </div>
    )
  },
})
