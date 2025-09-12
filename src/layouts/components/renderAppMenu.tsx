import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { defineComponent, type PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

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
                    <svg-icon
                      icon={'expand'}
                      size={16}
                    />
                    <span style={{ paddingLeft: props.collapse ? 0 : '8px' }}>
                      {menu.meta?.title}
                    </span>
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
                    style={{ paddingLeft: props.collapse ? 0 : '8px' }}
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
        style={{
          borderRight: 'none',
          userSelect: 'none',
          height: '100%',
          fontSize: '14px',
          backgroundColor: '#fff',
        }}
      >
        {renderMenu(props.menus)}
      </ElMenu>
    )
  },
})
