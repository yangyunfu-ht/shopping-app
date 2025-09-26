export const Api = {
  list: '/admin-api/product/attribute/page',
  create: '/admin-api/product/attribute/create',
  detail: '/admin-api/product/attribute/get',
  change: '/admin-api/product/attribute/update',
  delete: '/admin-api/product/attribute/delete',
} as const

export const ApiValue = {
  list: '/admin-api/product/property/value/page',
  create: '/admin-api/product/property/value/create',
  detail: '/admin-api/product/property/value/get',
  change: '/admin-api/product/property/value/update',
  delete: '/admin-api/product/property/value/delete',
} as const
