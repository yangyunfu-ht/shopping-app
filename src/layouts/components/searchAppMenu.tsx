import { defineComponent, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElAutocomplete, ElIcon } from 'element-plus'
import { menuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'

interface Link {
  label: any
  value: any
  path: string
}

export default defineComponent({
  setup() {
    const state = ref('')
    const visible = ref(false)
    const triggerOnFocus = ref(false)
    const router = useRouter()
    const useMenuStore = menuStore()
    const { appMenuCollapse } = storeToRefs(useMenuStore)

    const handleSelect = (item: any) => {
      router.push({ path: item.path })
      visible.value = false
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
      useMenuStore.setAppMenuCollapse(false)
    }

    return () => (
      <li
        class={'el-sub-menu'}
        style={{ height: '38px' }}
      >
        {appMenuCollapse.value ? (
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
        ) : (
          <ElAutocomplete
            v-model={state.value}
            fetch-suggestions={querySearchAsync}
            placeholder="输入功能名称搜索"
            trigger-on-focus={triggerOnFocus.value}
            onSelect={handleSelect}
            onChange={handleChange}
            style={{ width: '100%', '--el-input-height': '38px' }}
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
