import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'


export const routeHome = [{
  path: '/home',
  component: () => import(/* webpackChunkName: "home" */ '@/views/index.vue'),
  name: 'Home',
  meta: { title: '首页', icon: 'House', affix: true }
}]

const routes = [
  // {
  //   path: "/:pathMatch(.*)*",
  //   component: () => import(/* webpackChunkName: "error" */ '@/views/error.vue'),
  //   hidden: true
  // },
  // {
  //   path: '/login',
  //   component: () => import(/* webpackChunkName: "login" */ '@/views/login.vue'),
  //   hidden: true
  // },
  // {
  //   path: '/404',
  //   component: () => import(/* webpackChunkName: "error" */ '@/views/error.vue'),
  //   hidden: true
  // },
  {
    path: '',
    component: import (/* webpackChunkName: "home" */ '@/views/index.vue'),
    redirect: '/home',
    children: routeHome
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // console.log('scrollBehavior--', to, from, savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router