import { useTokenStore } from '@/store/tokenStore'
import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import router from '@/router'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 60000,
})

const tokenStore = useTokenStore()

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
    const { code, data, msg } = response.data
    if (code !== 200) {
      return Promise.reject(new Error(msg || '请求失败'))
    }
    return data
  },
  (error: any) => {
    let message = ''
    if (axios.isCancel(error)) {
      console.warn('Request canceled:', error.message)
      return Promise.reject(error)
    }
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '登录过期，请重新登录'
          tokenStore.removeToken()
          router.push('/login')
          break
        case 403:
          message = '无权访问'
          break
        case 404:
          message = `请求的地址不存在: ${error.config?.url}`
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `${error.response.status}———未知错误`
      }
    } else if (error.message.includes('Network Error')) {
      message = '网络连接异常'
    } else {
      message = error.message
    }

    return Promise.reject({ ...error, message: message || error.message })
  }
)

export default service
