import type { RouteRecordRaw } from 'vue-router'
import type { DynamicRoute } from '#/router'
import router from '@/router'

const appLayoutsMap = import.meta.glob('@/layouts/**/**.{vue,tsx}')
const appPagesMap = import.meta.glob('@/pages/**/**.{vue,tsx}')

const loadComponent = (componentPath: string) => {
  return appLayoutsMap[componentPath] || appPagesMap[componentPath]
}

const transformRoute = (
  dynamicRoutes: DynamicRoute[],
  parentRoutePath = ''
): RouteRecordRaw[] => {
  return dynamicRoutes.map((route) => {
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentRoutePath}/${route.path}`

    return {
      path: fullPath,
      name: route.name,
      component: loadComponent(route.component),
      children:
        route.children && route.children.length > 0
          ? transformRoute(route.children, fullPath)
          : [],
      meta: route.meta,
    }
  })
}

export const addDynamicRoutes = (dynamicRoutes: DynamicRoute[]) => {
  return new Promise<RouteRecordRaw[]>((resolve, reject) => {
    if (!dynamicRoutes || dynamicRoutes.length === 0) {
      reject('No dynamic routes to add')
    }

    const transformedRoutes = transformRoute(dynamicRoutes)

    transformedRoutes.forEach((route) => {
      router.addRoute(route)
    })

    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'notFoundWrapper',
      meta: { title: '异常页面' },
      component: () => import('@/layouts/appLayout.vue'),
      children: [
        {
          path: '',
          name: 'notFound',
          component: () => import('@/pages/notFound/notFoundPage.vue'),
          meta: { title: '404' },
        },
      ],
    })

    resolve(transformedRoutes)
  })
}
