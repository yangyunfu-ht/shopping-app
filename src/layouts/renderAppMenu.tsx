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
        // 如果路由有隐藏属性，则不渲染
        if (menu.meta?.hidden) {
          return null
        }

        // 检查是否有子菜单
        if (menu.children && menu.children.length > 0) {
          return (
            <ElSubMenu
              index={menu.path}
              key={menu.path}
              v-slots={{
                title: () => <span>{menu.meta?.title}</span>,
              }}
            >
              {/* 递归调用时，传入当前路径作为 basePath */}
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

        // 渲染为单个 ElMenuItem
        return (
          <ElMenuItem
            index={menu.path}
            key={menu.path}
            v-slots={{
              title: () => <span>{menu.meta?.title}</span>,
            }}
          ></ElMenuItem>
        )
      })
    }

    return () => (
      <ElMenu
        uniqueOpened
        router
        style={{ borderRight: 'none', userSelect: 'none', height: '100%' }}
      >
        {renderMenu(props.menus)}
      </ElMenu>
    )
  },
})
