import { createRouter, createWebHashHistory } from 'vue-router'

const constantRoutes: any[] = [
  {
    path: '/',
    component: () => import('@/views/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
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