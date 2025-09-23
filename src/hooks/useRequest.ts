import { ref, type Ref } from 'vue'
import service from '@/utils/request'
import type { AxiosRequestConfig } from 'axios'
import type { UseRequestReturn } from '#/hooks'
import axios from 'axios'
import { useOnline } from '@vueuse/core'
import { useGlobalStore } from '@/store/globalStore'

/**
 * 封装一个通用的请求 Hooks
 * @template T 响应数据的类型
 * @returns {UseRequestReturn<T>} 包含数据、加载状态、错误信息和请求方法的对象
 */
export function useRequest<T = any>(): UseRequestReturn<T> {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<null | string>(null)

  const online = useOnline()
  const controllerMap = new Map<string, AbortController>()
  const globalStore = useGlobalStore()

  const request = async <D = any>(config: AxiosRequestConfig): Promise<D> => {
    const { url } = config
    if (!url) {
      throw new Error('缺少请求必要参数url')
    }

    // 检查设备网络连接
    if (!online) {
      throw new Error('当前设备网络连接异常')
    }

    // 1. 在请求发起前检查全局锁定状态
    if (globalStore.isRequestLocked) {
      throw new Error('登录信息过期，无法发起任何新请求')
    }

    // 判断相同url是否存在未完成的请求，存在则取消该请求
    cancel(url)

    loading.value = true
    error.value = null

    const abortController = new AbortController()
    controllerMap.set(url, abortController)

    try {
      const response = await service({
        ...config,
        signal: abortController.signal,
      })
      return response.data
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log('请求已取消', err.message)
      } else {
        error.value = err
        if (err.response && err.response.status === 401) {
          globalStore.lockREquests()
          cancel()
        }
      }
      throw err
    } finally {
      controllerMap.delete(url)
      loading.value = false
    }
  }

  const cancel = (url?: string) => {
    if (url) {
      const controller = controllerMap.get(url)
      if (controller) {
        controller.abort()
        controllerMap.delete(url)
      }
    } else {
      controllerMap.forEach((controller) => controller.abort())
      controllerMap.clear()
    }
  }

  return {
    data,
    loading,
    error,
    request,
    cancel,
  }
}
