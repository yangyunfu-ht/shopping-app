import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'
// import { addDynamicRoutes } from './addDynamicRouter'
// import type { DynamicRoute } from '#/router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'loginPage',
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
        path: '',
        name: 'homePage',
        component: () => import('@/pages/home/homePage.vue'),
        meta: {
          keepAlive: true,
          title: '首页',
        },
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'aboutPage',
        component: () => import('@/pages/about/aboutPage.vue'),
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
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'minePage',
        component: () => import('@/pages/mine/minePage.vue'),
        meta: {
          keepAlive: true,
          title: '我的',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'notFoundPage',
        component: () => import('@/pages/notFound/notFoundPage.vue'),
      },
    ],
  },
  // 匹配所有路径的路由，必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

// let hasAddedDynamicRoutes = false
// router.beforeEach(async (to, _from, next) => {
//   // 获取 token，用于判断用户是否登录
//   const token = localStorage.getItem('token')

//   // 1. 如果是访问登录页，直接放行
//   if (to.path === '/') {
//     next()
//     return // 结束守卫
//   }

//   // 2. 如果没有 token（未登录）
//   if (!token) {
//     // 强制跳转到登录页
//     next({ path: '/', query: { redirect: to.fullPath } })
//     return
//   }

//   // 3. 如果有 token（已登录）
//   if (token) {
//     // 检查是否已经添加了动态路由
//     if (!hasAddedDynamicRoutes) {
//       try {
//         // 模拟获取用户路由数据的 API 请求
//         // 实际项目中，这里会调用你的API
//         const mockRoutes = [
//           { path: '/dashboard', name: 'Dashboard' },
//           { path: '/products', name: 'Products' },
//         ]

//         // 调用动态添加路由的函数
//         addDynamicRoutes(mockRoutes as DynamicRoute[], router).catch(() => {
//           // 如果添加路由失败，强制返回登录页
//           localStorage.removeItem('token')
//           next('/')
//         })

//         // 标记为已添加，避免重复执行
//         hasAddedDynamicRoutes = true

//         // 确保路由被正确添加后再进行跳转
//         // 使用 next(to.fullPath) 确保这次的导航可以重新执行，
//         // 并且能找到刚刚添加的新路由
//         next({ ...to, replace: true })
//       } catch (error) {
//         // 如果获取路由失败，可能是 token 无效，强制返回登录页
//         console.error('Failed to get dynamic routes:', error)
//         localStorage.removeItem('token')
//         next('/')
//       }
//     } else {
//       // 动态路由已添加，直接放行
//       next()
//     }
//   }
// })

router.afterEach((to) => {
  document.title = to.meta?.title as string
})

export default router
