import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 60000,
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 假设你的 token 存储在 localStorage
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 处理请求错误
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { data } = response
    // 根据你后端的返回格式，判断请求是否成功
    if (data.code === 200) {
      return data.data // 返回业务数据
    } else {
      // 处理业务错误，例如弹出提示
      console.error('业务错误:', data.message)
      return Promise.reject(new Error(data.message || 'Error'))
    }
  },
  (error) => {
    // 处理 HTTP 状态码错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401: 未登录或 Token 过期，可以跳转到登录页
          console.error('未授权，请重新登录')
          break
        case 404:
          // 404: 资源不存在
          console.error('请求的资源不存在')
          break
        default:
          console.error(`HTTP 错误: ${error.response.status}`)
      }
    } else {
      // 处理网络错误
      console.error('网络错误或请求超时')
    }
    return Promise.reject(error)
  }
)

export default service
