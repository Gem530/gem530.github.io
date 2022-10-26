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
    component:()=>import(/* webpackChunkName: "me" */ '@/views/me/index.vue'),
    meta:{ title: t('router.me.title') }
  },
  {
    path: '/detail',
    name: 'Detail',
    component:()=>import(/* webpackChunkName: "home" */ '@/views/detail/index.vue'),
    meta:{ title: t('router.detail.title') }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: savedPosition?.top || 0 } // 当前页面刷新，会保存滚动条位置
  }
})

export default router

