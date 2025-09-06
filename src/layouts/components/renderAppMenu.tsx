import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { defineComponent, type PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'RenderAppMenu',
  props: {
    menus: {
      type: Array as PropType<RouteRecordRaw[]>,
      default: () => [],
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
                      size={18}
                    />
                    <span style={{ paddingLeft: '8px', fontSize: '16px' }}>
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

        // 如果只有一个子菜单，直接渲染为 ElMenuItem
        // 这是一种常见的处理方式，避免菜单层级过深
        // if (menu.children && menu.children.length === 1) {
        //   const onlyOneChild = menu.children[0]

        //   return (
        //     <ElMenuItem
        //       index={menu.path}
        //       key={menu.path}
        //     >
        //       <template v-slot:title>
        //         <span>{onlyOneChild.meta?.title || onlyOneChild.name}</span>
        //       </template>
        //     </ElMenuItem>
        //   )
        // }

        return (
          <ElMenuItem
            index={menu.path}
            key={menu.path}
            v-slots={{
              title: () => (
                <span style={{ paddingLeft: '8px', fontSize: '16px' }}>
                  {menu.meta?.title}
                </span>
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
        style={{
          borderRight: 'none',
          userSelect: 'none',
          height: '100%',
          fontSize: '16px',
          backgroundColor: 'var(--el-color-primary)',
        }}
      >
        {renderMenu(props.menus)}
      </ElMenu>
    )
  },
})
