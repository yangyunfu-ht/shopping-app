export const Api = {
  list: '/admin-api/system/role/page',
  create: '/admin-api/system/role/create',
  detail: '/admin-api/system/role/get',
  change: '/admin-api/system/role/update',
  delete: '/admin-api/system/role/delete',
  menuTree: '/admin-api/system/menu/simple-list',
  getMenuAuthor: '/admin-api/system/permission/list-role-menus',
  roleAuthor: '/admin-api/system/permission/assign-role-menu',
} as const
