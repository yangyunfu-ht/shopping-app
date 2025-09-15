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
    component: () => import('@/layouts/appLayout'),
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
    component: '/src/layouts/appLayout.tsx',
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
    component: '/src/layouts/appLayout.tsx',
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
    component: '/src/layouts/appLayout.tsx',
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
  {
    path: '/error',
    name: 'error',
    component: '/src/layouts/appLayout.tsx',
    meta: {
      keepAlive: false,
      title: '异常管理',
    },
    children: [
      {
        path: '404',
        name: '404',
        component: '/src/pages/notFound/notFoundPage.vue',
        meta: {
          keepAlive: true,
          title: '404-notFound',
        },
      },
    ],
  },
  {
    path: '/goods',
    name: 'goods',
    component: '/src/layouts/appLayout.tsx',
    meta: {
      keepAlive: false,
      title: '商品管理',
    },
    children: [
      {
        path: 'kind',
        name: 'kind',
        component: '/src/pages/goods/goodsPage.vue',
        meta: {
          keepAlive: true,
          title: 'goods-kind',
        },
      },
    ],
  },
  {
    path: '/person',
    name: 'person',
    component: '/src/layouts/appLayout.tsx',
    meta: {
      keepAlive: false,
      title: '烦人管理',
    },
    children: [
      {
        path: 'man',
        name: 'man',
        component: '/src/layouts/subLayout.vue',
        meta: {
          keepAlive: true,
          title: 'person-man',
        },
        children: [
          {
            name: 'woMan',
            path: 'woMan',
            component: '/src/pages/person/personPage.vue',
            meta: {
              keepAlive: true,
              title: 'person-man',
            },
          },
          {
            name: 'sexMan',
            path: 'sexMan',
            component: '/src/pages/man/manPage.vue',
            meta: {
              keepAlive: true,
              title: 'sex-man',
            },
          },
        ],
      },
      {
        path: 'button',
        name: 'button',
        component: '/src/layouts/subLayout.tsx',
        meta: {
          keepAlive: true,
          title: '按钮管理',
        },
        children: [
          {
            name: 'large',
            path: 'large',
            component: '/src/pages/button/large/largePage.vue',
            meta: {
              keepAlive: true,
              title: '大的按钮',
            },
          },
          {
            name: 'small',
            path: 'small',
            component: '/src/pages/button/small/smallPage.vue',
            meta: {
              keepAlive: true,
              title: '小的按钮',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    component: '/src/layouts/appLayout.tsx',
    meta: {
      keepAlive: false,
      title: '系统管理',
    },
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: '/src/pages/system/menu/menuPage.vue',
        meta: {
          keepAlive: true,
          title: '菜单管理',
        },
      },
      {
        path: 'role',
        name: 'role',
        component: '/src/pages/system/role/rolePage.vue',
        meta: {
          keepAlive: true,
          title: '角色管理',
        },
      },
      {
        path: 'post',
        name: 'post',
        component: '/src/pages/system/post/postPage.vue',
        meta: {
          keepAlive: true,
          title: '岗位管理',
        },
      },
      {
        path: 'branch',
        name: 'branch',
        component: '/src/pages/system/branch/branchPage.vue',
        meta: {
          keepAlive: true,
          title: '部门管理',
        },
      },
    ],
  },
]
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
