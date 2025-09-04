import { onDeactivated, onUnmounted, ref, type Ref } from 'vue'
import service, { isTokenExpired } from '@/utils/request'
import type { AxiosRequestConfig } from 'axios'
import type { UseRequestReturn } from '#/hooks'

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
      console.log('请求缺少 URL')
      return
    }

    // 在发起请求前，首先检查全局状态
    if (isTokenExpired) {
      console.warn('登录信息已过期，阻止新的请求。')
      error.value = '登录信息已过期'
      return
    }

    cancel(url)

    loading.value = true
    error.value = null

    // 创建一个新的 AbortController 实例并存储
    const abortController = new AbortController()
    controllerMap.set(url, abortController)

    try {
      const response = await service({
        ...config,
        signal: abortController.signal,
      })
      data.value = response as T
    } catch (err: any) {
      error.value = err
      console.error('请求出错:', err)
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

  onUnmounted(() => {
    cancel()
  })

  onDeactivated(() => {
    cancel()
  })

  return {
    data,
    loading,
    error,
    request,
    cancel,
  }
}
