import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'
import { addDynamicRoutes } from './addDynamicRouter'
import { useMenuStore } from '@/store/menuStore'
import { useTokenStore } from '@/store/tokenStore'
import { mockRoutes } from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/loginPage.vue'),
    meta: {
      keepAlive: false,
      title: '登录',
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
          title: '首页',
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
// 在 router.js 或 main.js 中
router.beforeEach((to, _from, next) => {
  NProgress.start()

  const menuStore = useMenuStore()
  const tokenStore = useTokenStore()
  const token = tokenStore.token

  document.title = to.meta?.title as string

  // 如果没有 token 且目标路径不是登录页，则重定向到登录页
  if (!token && to.path !== '/login') {
    return next('/login')
  }

  // 如果有 token 且目标路径是登录页，则重定向到主页
  if (token && to.path === '/login') {
    return next('/home/homePage')
  }

  // 如果有 token 且动态路由还未添加
  if (token && !hasAddedDynamicRoutes) {
    // 异步添加动态路由
    // 注意：这里必须使用 next() 来放行，或者返回一个 Promise
    addDynamicRoutes(mockRoutes)
      .then((data) => {
        menuStore.setAppMenus(data)
        hasAddedDynamicRoutes = true
        // 动态路由添加成功后，确保本次导航能继续，
        // 并且利用 next() 的参数来重新触发一次导航。
        // 这次导航会因为 hasAddedDynamicRoutes 为 true 而直接放行。
        return next({ ...to, replace: true })
      })
      .catch(() => {
        // 如果添加失败，则移除 token 并重定向到登录页
        menuStore.setAppMenus([])
        localStorage.removeItem('token')
        return next('/login')
      })
  } else {
    // 动态路由已添加，或者没有 token，直接放行
    return next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
