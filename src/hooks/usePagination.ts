import { reactive, toRefs } from 'vue'

type Callback = () => void

type Options = {
  defaultPageSize?: number
  defaultPageSizes?: number[]
}

export default function usePagination(
  callback: Callback,
  options: Options = { defaultPageSize: 100, defaultPageSizes: [50, 100, 200] }
) {
  const pagination = reactive({
    currentPage: 1,
    pageSize: options.defaultPageSize,
    pageSizes: options.defaultPageSizes,
    total: 0,
    onChange: (size: number) => {
      pagination.currentPage = size
      callback && callback()
    },
    onPagesizeChange: (size: number) => {
      pagination.currentPage = 1
      pagination.pageSize = size
      callback && callback()
    },
  })

  const changeCurrent = pagination.onChange
  const changePageSize = pagination.onPagesizeChange
  const setTotal = (value: number) => (pagination.total = value)

  const { currentPage, pageSize, pageSizes, total } = toRefs(pagination)

  return {
    currentPage,
    pageSize,
    pageSizes,
    total,
    changeCurrent,
    changePageSize,
    setTotal,
  }
}
