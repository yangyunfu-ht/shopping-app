export const mockRoutes = [
  {
    path: '/productManagement',
    name: 'productManagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '商品管理',
      icon: 'goods',
    },
    children: [
      {
        path: 'productList',
        name: 'productList',
        component: '/src/pages/productManagement/productList/index.vue',
        meta: {
          keepAlive: true,
          title: '商品列表',
        },
      },
      {
        path: 'productCategories',
        name: 'productCategories',
        component: '/src/pages/productManagement/productCategories/index.vue',
        meta: {
          keepAlive: false,
          title: '商品分类',
        },
      },
      {
        path: 'productBrand',
        name: 'productBrand',
        component: '/src/pages/productManagement/productBrand/index.vue',
        meta: {
          keepAlive: false,
          title: '商品品牌',
        },
      },
      {
        path: 'productAttributes',
        name: 'productAttributes',
        component: '/src/pages/productManagement/productAttributes/index.vue',
        meta: {
          keepAlive: false,
          title: '商品属性',
        },
      },
      {
        path: 'productParameters',
        name: 'productParameters',
        component: '/src/pages/productManagement/productParameters/index.vue',
        meta: {
          keepAlive: false,
          title: '商品参数',
        },
      },
    ],
  },
  {
    path: '/orderManagement',
    name: 'orderManagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: true,
      title: '订单管理',
      icon: 'order',
    },
    children: [
      {
        path: 'orderList',
        name: 'orderList',
        component: '/src/pages/orderManagement/orderList/index.vue',
        meta: {
          keepAlive: true,
          title: '订单列表',
        },
      },
      {
        path: 'refundAfterSales',
        name: 'refundAfterSales',
        component: '/src/pages/orderManagement/refundAfterSales/index.vue',
        meta: {
          keepAlive: true,
          title: '退款售后',
        },
      },
      {
        path: 'deliveryManagement',
        name: 'deliveryManagement',
        component: '/src/pages/orderManagement/deliveryManagement/index.vue',
        meta: {
          keepAlive: true,
          title: '配送管理',
        },
      },
    ],
  },
  {
    path: '/marketingManagement',
    name: 'marketingManagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '营销管理',
      icon: 'marketing',
    },
    children: [
      {
        path: 'contentManagement',
        name: 'contentManagement',
        component: '/src/layouts/subLayout.vue',
        meta: {
          keepAlive: false,
          title: '内容管理',
        },
        children: [
          {
            path: 'articleCategories',
            name: 'articleCategories',
            component:
              '/src/pages/marketingManagement/contentManagement/articleCategories/index.vue',
            meta: {
              keepAlive: true,
              title: '文章分类',
            },
          },
          {
            path: 'articleList',
            name: 'articleList',
            component:
              '/src/pages/marketingManagement/contentManagement/articleList/index.vue',
            meta: {
              keepAlive: true,
              title: '文章列表',
            },
          },
          {
            path: 'carousel',
            name: 'carousel',
            component:
              '/src/pages/marketingManagement/contentManagement/carousel/index.vue',
            meta: {
              keepAlive: true,
              title: '轮播图',
            },
          },
        ],
      },
      {
        path: 'coupons',
        name: 'coupons',
        component: '/src/layouts/subLayout.vue',
        meta: {
          keepAlive: false,
          title: '优惠券',
        },
        children: [
          {
            path: 'couponsList',
            name: 'couponsList',
            component:
              '/src/pages/marketingManagement/coupons/couponsList/index.vue',
            meta: {
              keepAlive: true,
              title: '优惠券列表',
            },
          },
          {
            path: 'collectionRecord',
            name: 'collectionRecord',
            component:
              '/src/pages/marketingManagement/coupons/collectionRecord/index.vue',
            meta: {
              keepAlive: true,
              title: '领取记录',
            },
          },
        ],
      },
      {
        path: 'discountActivity',
        name: 'discountActivity',
        component: '/src/layouts/subLayout.vue',
        meta: {
          keepAlive: false,
          title: '优惠活动',
        },
        children: [
          {
            path: 'limitTimeDiscount',
            name: 'limitTimeDiscount',
            component:
              '/src/pages/marketingManagement/discountActivity/limitTimeDiscount/index.vue',
            meta: {
              keepAlive: true,
              title: '限时活动',
            },
          },
          {
            path: 'freeGifts',
            name: 'freeGifts',
            component:
              '/src/pages/marketingManagement/discountActivity/freeGifts/index.vue',
            meta: {
              keepAlive: true,
              title: '满减送',
            },
          },
        ],
      },
      {
        path: 'mallDecoration',
        name: 'mallDecoration',
        component: '/src/layouts/subLayout.vue',
        meta: {
          keepAlive: false,
          title: '商城装修',
        },
        children: [
          {
            path: 'decorationTemplate',
            name: 'decorationTemplate',
            component:
              '/src/pages/marketingManagement/mallDecoration/decorationTemplate/index.vue',
            meta: {
              keepAlive: true,
              title: '装修模板',
            },
          },
          {
            path: 'decorationPage',
            name: 'decorationPage',
            component:
              '/src/pages/marketingManagement/mallDecoration/decorationPage/index.vue',
            meta: {
              keepAlive: true,
              title: '装修页面',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/statisticsCenter',
    name: 'statisticsCenter',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '统计中心',
      icon: 'statistics',
    },
    children: [
      {
        path: 'dataPage',
        name: 'dataPage',
        component: '/src/pages/statisticsCenter/couponStatistics/index.vue',
        meta: {
          keepAlive: false,
          title: '优惠券统计',
        },
      },
      {
        path: 'memberStatistics',
        name: 'memberStatistics',
        component: '/src/pages/statisticsCenter/memberStatistics/index.vue',
        meta: {
          keepAlive: false,
          title: '会员统计',
        },
      },
      {
        path: 'goodsStatistics',
        name: 'goodsStatistics',
        component: '/src/pages/statisticsCenter/goodsStatistics/index.vue',
        meta: {
          keepAlive: false,
          title: '商品统计',
        },
      },
      {
        path: 'transactionStatistics',
        name: 'transactionStatistics',
        component:
          '/src/pages/statisticsCenter/transactionStatistics/index.vue',
        meta: {
          keepAlive: false,
          title: '交易统计',
        },
      },
    ],
  },
  {
    path: '/payManagement',
    name: 'payManagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '支付管理',
      icon: 'pay',
    },
    children: [
      {
        path: 'payOrder',
        name: 'payOrder',
        component: '/src/pages/payManagement/payOrder/index.vue',
        meta: {
          keepAlive: false,
          title: '支付订单',
        },
      },
      {
        path: 'refundOrder',
        name: 'refundOrder',
        component: '/src/pages/payManagement/refundOrder/index.vue',
        meta: {
          keepAlive: false,
          title: '退款订单',
        },
      },
    ],
  },
  {
    path: '/shopMallmanagement',
    name: 'shopMallmanagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '商场管理',
      icon: 'mall',
    },
    children: [
      {
        path: 'shopMallList',
        name: 'shopMallList',
        component: '/src/pages/shopMallmanagement/shopMallList/index.vue',
        meta: {
          keepAlive: false,
          title: '商场列表',
        },
      },
    ],
  },
  {
    path: '/membershipManagement',
    name: 'membershipManagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '会员管理',
      icon: 'memberShip',
    },
    children: [
      {
        path: 'memberList',
        name: 'memberList',
        component: '/src/pages/membershipManagement/memberList/index.vue',
        meta: {
          keepAlive: false,
          title: '会员列表',
        },
      },
      {
        path: 'memberPoints',
        name: 'memberPoints',
        component: '/src/pages/membershipManagement/memberPoints/index.vue',
        meta: {
          keepAlive: false,
          title: '会员积分',
        },
      },

      {
        path: 'signConfig',
        name: 'signConfig',
        component: '/src/pages/membershipManagement/signConfig/index.vue',
        meta: {
          keepAlive: false,
          title: '签到配置',
        },
      },
      {
        path: 'signRecord',
        name: 'signRecord',
        component: '/src/pages/membershipManagement/signRecord/index.vue',
        meta: {
          keepAlive: false,
          title: '签到记录',
        },
      },
    ],
  },
  {
    path: '/customerServiceCenter',
    name: 'customerServiceCenter',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '客服中心',
      icon: 'customerService',
    },
    children: [
      {
        path: 'mallCustomerService',
        name: 'mallCustomerService',
        component:
          '/src/pages/customerServiceCenter/mallCustomerService/index.vue',
        meta: {
          keepAlive: false,
          title: '商场客服',
        },
      },
    ],
  },
  {
    path: '/systemManagement',
    name: 'systemManagement',
    component: '/src/layouts/appLayout.vue',
    meta: {
      keepAlive: false,
      title: '系统管理',
      icon: 'system',
    },
    children: [
      {
        path: 'userManagement',
        name: 'userManagement',
        component: '/src/pages/systemManagement/userManagement/index.vue',
        meta: {
          keepAlive: true,
          title: '用户管理',
        },
      },
      {
        path: 'roleManagement',
        name: 'roleManagement',
        component: '/src/pages/systemManagement/roleManagement/index.vue',
        meta: {
          keepAlive: true,
          title: '角色管理',
        },
      },
      {
        path: 'branchManagement',
        name: 'branchManagement',
        component: '/src/pages/systemManagement/branchManagement/index.vue',
        meta: {
          keepAlive: true,
          title: '部门管理',
        },
      },
      {
        path: 'postManagement',
        name: 'postManagement',
        component: '/src/pages/systemManagement/postManagement/index.vue',
        meta: {
          keepAlive: true,
          title: '岗位管理',
        },
      },
      {
        path: 'menuManagement',
        name: 'menuManagement',
        component: '/src/pages/systemManagement/menuManagement/index.vue',
        meta: {
          keepAlive: false,
          title: '菜单管理',
        },
      },
      {
        path: 'dictManagement',
        name: 'dictManagement',
        component: '/src/pages/systemManagement/dictManagement/index.vue',
        meta: {
          keepAlive: false,
          title: '字典管理',
        },
      },
      {
        path: 'areaManagement',
        name: 'areaManagement',
        component: '/src/pages/systemManagement/areaManagement/index.vue',
        meta: {
          keepAlive: false,
          title: '地区管理',
        },
      },

      {
        path: 'loginLog',
        name: 'loginLog',
        component: '/src/pages/systemManagement/loginLog/index.vue',
        meta: {
          keepAlive: true,
          title: '登录日志',
        },
      },
      {
        path: 'operationLog',
        name: 'operationLog',
        component: '/src/pages/systemManagement/operationLog/index.vue',
        meta: {
          keepAlive: false,
          title: '操作日志',
        },
      },
    ],
  },
]
