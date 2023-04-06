import { createRouter, createWebHashHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const constantRoutes: any[] = [
  {
    path: '/child',
    children: [
      {
        path: 'home',
        component: () => import('@/views/index.vue'),
        hidden: true
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(
    // qiankunWindow.__POWERED_BY_QIANKUN__ ? '/vue-child/' : '/'
  ),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;