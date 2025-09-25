import { useTokenStore } from '@/store/tokenStore'
import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import router from '@/router'
import { refreshAccessToken } from './refreshToken'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 60000,
})

const tokenStore = useTokenStore()
let isRefreshing = false
let failedQueue: ((token: string) => void)[] = []
const processQueue = (_error: boolean, token: string | null = null) => {
  failedQueue.forEach((prom) => prom(token as string))
  failedQueue = []
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.token
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: any) => {
    const originalRequest = error.config

    if (axios.isCancel(error) || !error.response) {
      let message = ''
      if (axios.isCancel(error)) {
        console.warn('请求已取消:', error.message)
        return Promise.reject(error)
      } else if (error.message.includes('Network Error')) {
        message = '网络连接异常'
      } else {
        message = error.message
      }
      return Promise.reject({ ...error, message })
    }

    const status = error.response.status
    let message = ''

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(service(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        processQueue(false, newAccessToken)

        return service(originalRequest)
      } catch (refreshError) {
        processQueue(true)
        tokenStore.removeToken()
        router.push('/login')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    switch (status) {
      case 400:
        message = '请求错误'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = `请求的地址不存在: ${originalRequest?.url}`
        break
      case 500:
        message = '服务器内部错误'
        break
      default:
        message = `${status}———未知错误`
    }

    return Promise.reject({ ...error, message: message || error.message })
  }
)

export default service
