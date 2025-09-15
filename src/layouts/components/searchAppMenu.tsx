import { defineComponent, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElAutocomplete, ElIcon, ElTooltip } from 'element-plus'
import { useMenuStore } from '@/store/menuStore'

interface Link {
  label: any
  value: any
  path: string
}

export default defineComponent({
  name: 'SearchAppMenu',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
    drawerAside: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const state = ref('')
    const visible = ref(false)
    const triggerOnFocus = ref(false)
    const router = useRouter()
    const menuStore = useMenuStore()

    const handleSelect = (item: any) => {
      router.push({ path: item.path })
      emit('select')
      visible.value = false
      state.value = ''
    }

    const generateSearchValue = (): Array<Link> => {
      return router
        .getRoutes()
        .map((el) => {
          return {
            label: el.meta.title,
            value: el.meta.title,
            path: el.path,
            name: el.name,
          }
        })
        .filter((ele) => ele.label && ele.value)
    }

    const querySearchAsync = (
      queryString: string,
      cb: (arg: Link[]) => void
    ) => {
      if (!queryString) {
        return cb([])
      } else {
        cb(
          generateSearchValue().filter((item) =>
            (item.label as string).includes(queryString)
          )
        )
      }
    }

    const handleChange = (value: string) => {
      if (!value) return
      triggerOnFocus.value = true
    }

    const handleClickSearch = () => {
      menuStore.setAppMenuCollapse(false)
    }

    return () => (
      <li
        class={['el-sub-menu', 'flex-center']}
        style={{
          height: '56px',
          width: props.collapse ? '64px' : '210px',
          transition: 'var(--el-transition-all)',
        }}
      >
        {props.collapse && !props.drawerAside ? (
          <ElTooltip
            effect="dark"
            content="搜索"
            placement="right"
            offset={12}
          >
            <div
              class={['flex-center', 'el-sub-menu__title']}
              style={{
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={handleClickSearch}
            >
              <ElIcon
                size={16}
                color={'#000000'}
              >
                <Search />
              </ElIcon>
            </div>
          </ElTooltip>
        ) : (
          <ElAutocomplete
            v-model={state.value}
            fetch-suggestions={querySearchAsync}
            placeholder="输入功能名称搜索"
            trigger-on-focus={triggerOnFocus.value}
            onSelect={handleSelect}
            onChange={handleChange}
            style={{
              width: '100%',
              '--el-input-height': '36px',
              padding: '0 4px',
              boxSize: 'border-box',
              transition: 'var(--el-transition-all)',
            }}
          >
            {{
              prefix: () => (
                <ElIcon
                  size={16}
                  color={'#000000'}
                >
                  <Search />
                </ElIcon>
              ),
            }}
          </ElAutocomplete>
        )}
      </li>
    )
  },
})
