export const Api = {
  login: '/admin-api/system/auth/login',
  loginOut: '/admin-api/system/auth/logout',
  check: '/admin-api/system/captcha/check',
  permission: '/admin-api/system/auth/get-permission-info',
  refreshToken: '/admin-api/system/auth/refresh-token',
} as const
