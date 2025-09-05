import { ref, type Ref } from 'vue'
import service from '@/utils/request'
import type { AxiosRequestConfig } from 'axios'
import type { UseRequestReturn } from '#/hooks'
import axios from 'axios'
import { useOnline } from '@vueuse/core'

// 全局状态：锁定所有请求，例如当遇到401或5xx错误时
const isRequestLocked = ref(false)

/**
 * 封装一个通用的请求 Hooks
 * @template T 响应数据的类型
 * @returns {UseRequestReturn<T>} 包含数据、加载状态、错误信息和请求方法的对象
 */
export function useRequest<T = any>(): UseRequestReturn<T> {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<null | string>(null)

  const controllerMap = new Map<string, AbortController>()

  const request = async (config: AxiosRequestConfig) => {
    const { url } = config
    if (!url) {
      return Promise.reject(new Error('缺少请求必要参数url'))
    }

    // 检查设备网络连接
    const online = useOnline()
    if (!online) {
      return Promise.reject(new Error('当前设备网络连接异常'))
    }

    // 1. 在请求发起前检查全局锁定状态
    if (isRequestLocked.value) {
      return Promise.reject(new Error('登录信息过期，无法发起任何新请求'))
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
      data.value = response as T
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log('请求已取消', err.message)
      } else {
        error.value = err
        if (err.response && err.response.status === 401) {
          isRequestLocked.value = true
          cancel()
        }
      }
      throw err
    } finally {
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
      // 如果没有指定 URL，则取消所有请求
      controllerMap.forEach((controller) => controller.abort())
      controllerMap.clear()
    }
  }

  return {
    data,
    loading,
    error,
    request,
    get: (url, options = {}) => request({ url, ...options }),
    post: (url, data, options = {}) => request({ url, data, ...options }),
    cancel,
  }
}
