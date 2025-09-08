import { tokenStore } from '@/store/tokenStore'
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 60000,
})

const useTokenStore = tokenStore()

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useTokenStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
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
  (error) => {
    let message = ''
    if (axios.isCancel(error)) {
      // 请求已取消，不进行任何提示
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
          useTokenStore.removeToken()
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

    ElMessage.error(message)

    return Promise.reject(error)
  }
)

export default service
