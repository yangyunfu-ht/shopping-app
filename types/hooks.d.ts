import type { Ref } from "vue"
import type { AxiosRequestConfig, AxiosResponse } from "axios"

export interface ResponseResult<T = any> {
  code: number
  data: T
  msg: string
}

export interface UseRequestReturn<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  request: <D = any>(config: AxiosRequestConfig<any>) => Promise<ResponseResult<D>>
  cancel: (url?: string) => void
}


export interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  initialPageSizes?: number[]
  callback: (params: { page: number, pageSize: number }) => Promise<void> | void
}