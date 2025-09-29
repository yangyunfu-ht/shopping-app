import type { Menu } from "./router"

export interface LoginReturn {
  accessToken: string
  expiresTime: number
  refreshToken: string
  userId: number
}

export interface User {
    id: number | null
    username: string
    nickname: string
    deptId: number | null
    avatar: string
    email: string
}

export interface permissionReturn {
  menus: Array<Menu>
  permissions: Array<string>
  roles: Array<string>
  user: User
}