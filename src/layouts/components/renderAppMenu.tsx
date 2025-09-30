import type { Menu } from '#/router'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { computed, defineComponent, type PropType } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'RenderAppMenu',
  props: {
    menus: {
      type: Array as PropType<Menu[]>,
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

    const defaultActive = computed(() => route.path)

    const renderMenu = (menus: Menu[], parentPath = '') => {
      return menus.map((menu) => {
        if (!menu.visible) {
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
                    {menu.icon ? (
                      <svgIcon
                        icon={menu.icon}
                        size={18}
                        color="#BFCBD9"
                      />
                    ) : null}

                    <span>{menu.name}</span>
                  </>
                ),
              }}
            >
              {renderMenu(
                menu.children,
                parentPath !== '' ? parentPath + '/' + menu.path : menu.path
              )}
            </ElSubMenu>
          )
        }

        return (
          <ElMenuItem
            index={parentPath + '/' + menu.path}
            key={parentPath + '/' + menu.path}
            v-slots={{
              title: () => (
                <>
                  {menu.icon ? (
                    <svgIcon
                      icon={menu.icon}
                      size={18}
                      color="#BFCBD9"
                    />
                  ) : null}
                  <span class={'ellipsis-text'}>{menu.name}</span>
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
        defaultActive={defaultActive.value}
        style={{
          borderRight: 'none',
          userSelect: 'none',
          height: '100%',
          fontSize: '14px',
        }}
      >
        <ElMenuItem
          index={'/home/homePage'}
          v-slots={{
            default: () => (
              <svgIcon
                size={18}
                icon="home"
                color="#BFCBD9"
              />
            ),
            title: () => <span>首页</span>,
          }}
        ></ElMenuItem>
        {renderMenu(props.menus)}
      </ElMenu>
    )
  },
})
