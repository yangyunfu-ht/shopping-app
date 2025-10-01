import type { UsePaginationOptions } from '#/hooks'
import { ref } from 'vue'

/**
 * 封装分页逻辑的 Hooks
 * @param {object} options - 配置项
 * @param {number} options.initialPage - 初始页码，默认为 1
 * @param {number} options.initialPageSize - 初始每页条数，默认为 10
 * @param {function} options.callback - 页码或每页条数改变后的回调函数
 */
export function usePagination(options: UsePaginationOptions) {
  const {
    initialPage = 1,
    initialPageSize = 50,
    initialPageSizes = [10, 20, 30, 40, 50, 100],
  } = options

  // 核心状态
  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const pageSizes = ref(initialPageSizes)
  const total = ref(0)

  // 方法：改变页码
  const changeCurrent = (page: number) => {
    currentPage.value = page
    options.callback &&
      options.callback({ page: currentPage.value, pageSize: pageSize.value })
  }

  // 方法：改变每页条数
  const changePageSize = (size: number) => {
    pageSize.value = size
    options.callback &&
      options.callback({ page: currentPage.value, pageSize: pageSize.value })
  }

  // 暴露给外部使用
  return {
    currentPage,
    pageSize,
    pageSizes,
    total,
    changeCurrent,
    changePageSize,
    setTotal: (newTotal: number) => {
      total.value = newTotal
    },
  }
}
