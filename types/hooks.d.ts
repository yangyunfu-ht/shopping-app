import type { Ref } from "vue"
import type { AxiosRequestConfig } from "axios"

export interface UseRequestReturn<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  request: (config: AxiosRequestConfig) => Promise<void>
  cancel: (url?: string) => void
}
