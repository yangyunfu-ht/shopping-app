import axios from 'axios'
import { useTokenStore } from '@/store/tokenStore'
import type { AxiosResponse } from 'axios'
import type { LoginReturn } from '#/user'
import type { ResponseResult } from '#/hooks'
import { Api } from '@/pages/login/api'

const refreshTokenInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST_URL,
  timeout: 10000,
})

export const refreshAccessToken = async (): Promise<string> => {
  const tokenStore = useTokenStore()
  const refreshToken = tokenStore.refreshToken

  if (!refreshToken) {
    throw new Error('没有可用的 refresh token。')
  }

  try {
    const response: AxiosResponse<ResponseResult<LoginReturn>> =
      await refreshTokenInstance.post(Api.refreshToken, {
        refreshToken: refreshToken,
      })

    tokenStore.setToken(response.data.data)

    return response.data.data.accessToken
  } catch (error) {
    console.error('刷新令牌失败:', error)
    tokenStore.removeToken()
    throw error
  }
}
