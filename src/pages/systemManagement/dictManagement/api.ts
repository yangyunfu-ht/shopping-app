export const Api = {
  list: '/admin-api/system/dict-type/page',
  create: '/admin-api/system/dict-type/create',
  detail: '/admin-api/system/dict-type/get',
  change: '/admin-api/system/dict-type/update',
  delete: '/admin-api/system/dict-type/delete',
} as const

export const DictApi = {
  list: '/admin-api/system/dict-data/page',
  create: '/admin-api/system/dict-data/create',
  detail: '/admin-api/system/dict-data/get',
  change: '/admin-api/system/dict-data/update',
  delete: '/admin-api/system/dict-data/delete',
} as const
