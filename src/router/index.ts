import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'
import { addDynamicRoutes } from './addDynamicRouter'
import { useMenuStore } from '@/store/menuStore'
import { useTokenStore } from '@/store/tokenStore'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { storeToRefs } from 'pinia'

NProgress.configure({ showSpinner: false })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: '/login',
    component: () => import('@/pages/login/loginPage.vue'),
    meta: {
      keepAlive: false,
      name: '登录',
    },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layouts/appLayout.vue'),
    children: [
      {
        path: 'homePage',
        name: 'homePage',
        component: () => import('@/pages/home/homePage.vue'),
        meta: {
          keepAlive: false,
          name: '首页',
        },
      },
    ],
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

let hasAddedDynamicRoutes = false

router.beforeEach((to, _from, next) => {
  NProgress.start()

  const menuStore = useMenuStore()
  const tokenStore = useTokenStore()
  const { appMenus } = storeToRefs(menuStore)
  const { token } = storeToRefs(tokenStore)

  document.title = ('得胜家居' + ' | ' + to.meta?.name) as string

  if (!token.value && to.path !== '/login') {
    return next('/login')
  }

  if (token.value && to.path === '/login') {
    return next('/home/homePage')
  }

  if (token.value && !hasAddedDynamicRoutes) {
    addDynamicRoutes(appMenus.value)
      .then(() => {
        hasAddedDynamicRoutes = true

        return next({ ...to, replace: true })
      })
      .catch(() => {
        menuStore.setAppMenus([])
        tokenStore.removeToken()
        hasAddedDynamicRoutes = false
        return next('/login')
      })
  } else {
    return next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
