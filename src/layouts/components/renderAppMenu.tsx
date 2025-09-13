import { House } from '@element-plus/icons-vue'
import { ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { defineComponent, type PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'RenderAppMenu',
  props: {
    menus: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true,
      default: () => [],
    },
    collapse: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute()

    const renderMenu = (menus: RouteRecordRaw[]) => {
      return menus.map((menu) => {
        if (menu.meta?.hidden) {
          return null
        }

        if (menu.children && menu.children.length > 0) {
          return (
            <ElSubMenu
              index={menu.path}
              key={menu.path}
              v-slots={{
                title: () => (
                  <>
                    <svgIcon
                      icon={'expand'}
                      size={16}
                    />

                    <span>{menu.meta?.title}</span>
                  </>
                ),
              }}
            >
              {renderMenu(menu.children)}
            </ElSubMenu>
          )
        }

        return (
          <ElMenuItem
            index={menu.path}
            key={menu.path}
            v-slots={{
              title: () => (
                <>
                  <span
                    class={'ellipsis-text'}
                    style={{ paddingLeft: '8px' }}
                  >
                    {menu.meta?.title}
                  </span>
                </>
              ),
            }}
          />
        )
      })
    }

    return () => (
      <ElMenu
        uniqueOpened
        router
        collapse={props.collapse}
        popper-offset={8}
        defaultActive={route.path}
        style={{
          borderRight: 'none',
          userSelect: 'none',
          height: '100%',
          fontSize: '14px',
          backgroundColor: '#fff',
        }}
      >
        <ElMenuItem
          index={'/home/homePage'}
          v-slots={{
            default: () => (
              <ElIcon size={16}>
                <House />
              </ElIcon>
            ),
            title: () => <span>首页</span>,
          }}
        ></ElMenuItem>
        {renderMenu(props.menus)}
      </ElMenu>
    )
  },
})
