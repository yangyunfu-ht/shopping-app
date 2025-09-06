import { defineComponent, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElAutocomplete, ElIcon } from 'element-plus'

interface Link {
  label: any
  value: any
  path: string
}

export default defineComponent({
  setup() {
    const state = ref('')
    const triggerOnFocus = ref(false)
    const router = useRouter()

    const handleSelect = (item: any) => {
      router.push({ path: item.path })
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

    return () => (
      <div
        class={'flex-center'}
        style={{ padding: '8px' }}
      >
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
                size={14}
                color={'#000000'}
              >
                <Search />
              </ElIcon>
            ),
          }}
        </ElAutocomplete>
      </div>
    )
  },
})
