import type { Ref } from "vue"
import type { AxiosRequestConfig } from "axios"

export interface UseRequestReturn<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  request: (config: AxiosRequestConfig) => Promise<void> | void
  get: (url: string, options: Omit<AxiosRequestConfig, 'url'>) => Promise<void> | void
  post: (url: string, data: any, options: Omit<AxiosRequestConfig, 'url' | 'data'>) => Promise<void> | void
  cancel: (url?: string) => void
}


export interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  initialPageSizes?: number[]
  callback: (params: { page: number, pageSize: number }) => Promise<void> | void
}