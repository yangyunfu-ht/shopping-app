import type { Router, RouteRecordRaw } from 'vue-router'
import type { DynamicRoute } from '#/router'

const appLayoutsMap = import.meta.glob('@/layouts/**/**.vue')
const appPagesMap = import.meta.glob('@/pages/**/**.vue')

const loadComponent = (componentPath: string) => {
  return appLayoutsMap[componentPath] || appPagesMap[componentPath]
}

const transformRoute = (dynamicRoutes: DynamicRoute[]): RouteRecordRaw[] => {
  return dynamicRoutes.map((route) => {
    return {
      path: route.path,
      name: route.name,
      component: loadComponent(route.component),
      children:
        route.children && route.children.length > 0
          ? transformRoute(route.children)
          : [],
      meta: route.meta,
    }
  })
}

export const addDynamicRoutes = (
  dynamicRoutes: DynamicRoute[],
  router: Router
) => {
  return new Promise<RouteRecordRaw[]>((resolve, reject) => {
    if (!dynamicRoutes || dynamicRoutes.length === 0) {
      reject('No dynamic routes to add')
    }

    const transformedRoutes = transformRoute(dynamicRoutes)

    transformedRoutes.forEach((route) => {
      router.addRoute(route)
    })

    resolve(transformedRoutes)
  })
}
