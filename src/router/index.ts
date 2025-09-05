import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'
import { addDynamicRoutes } from './addDynamicRouter'
import { menuStore } from '@/store/menuStore'

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
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'homePage',
        name: 'homePage',
        component: () => import('@/pages/home/homePage.vue'),
        meta: {
          keepAlive: true,
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
const mockRoutes = [
  {
    path: '/about',
    name: 'about',
    component: '/src/layouts/default.vue',
    meta: {
      keepAlive: false,
      title: '关于管理',
    },
    children: [
      {
        path: 'aboutPage',
        name: 'aboutPage',
        component: '/src/pages/about/aboutPage.vue',
        meta: {
          keepAlive: false,
          title: '关于',
        },
      },
    ],
  },
  {
    path: '/mine',
    name: 'mine',
    component: '/src/layouts/default.vue',
    meta: {
      keepAlive: false,
      title: '我的管理',
    },
    children: [
      {
        path: 'minePage',
        name: 'minePage',
        component: '/src/pages/mine/minePage.vue',
        meta: {
          keepAlive: true,
          title: '我的',
        },
      },
    ],
  },
  {
    path: '/data',
    name: 'data',
    component: '/src/layouts/default.vue',
    meta: {
      keepAlive: false,
      title: '数据管理',
    },
    children: [
      {
        path: 'dataPage',
        name: 'dataPage',
        component: '/src/pages/data/dataPage.vue',
        meta: {
          keepAlive: true,
          title: '数据',
        },
      },
    ],
  },
]
// 在 router.js 或 main.js 中
router.beforeEach((to, _from, next) => {
  const useMenuStore = menuStore()
  const token = localStorage.getItem('token')

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
        useMenuStore.setAppMenus(data)
        hasAddedDynamicRoutes = true
        // 动态路由添加成功后，确保本次导航能继续，
        // 并且利用 next() 的参数来重新触发一次导航。
        // 这次导航会因为 hasAddedDynamicRoutes 为 true 而直接放行。
        return next({ ...to, replace: true })
      })
      .catch(() => {
        // 如果添加失败，则移除 token 并重定向到登录页
        useMenuStore.setAppMenus([])
        localStorage.removeItem('token')
        return next('/login')
      })
  } else {
    // 动态路由已添加，或者没有 token，直接放行
    return next()
  }
})

// router.afterEach((to) => {
//   document.title = to.meta?.title as string
// })

export default router
