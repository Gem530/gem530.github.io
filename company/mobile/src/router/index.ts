import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import I18n from '@/locales'
const { t } = I18n.global

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component:()=>import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
    meta:{ title: t('router.home.title') }
  },
  {
    path: '/me',
    name: 'Me',
    component:()=>import(/* webpackChunkName: "home" */ '@/views/me/index.vue'),
    meta:{ title: t('router.me.title') }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router

