import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  }
  // { path: '/home', name: 'path', component: () => import('@/views/r-home.vue') },
  // { path: '/canvas', name: 'canvas', component: () => import('@/views/r-canvas.vue') },
  // { path: '/shopGame', name: 'shopGame', component: () => import('@/views/r-shopGame.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 如果直接使用import.meta.glob，vscode会报类型ImportMeta上不存在属性“glob”的错误，需要在tsconfig文件下添加类型定义vite/client  有效
const modules = import.meta.glob('../views/**/**.vue')
const keys = Object.keys(modules).filter(item => { return item.indexOf('r-') !== -1 })
keys.forEach((item) => {
  // console.log(item)
  const num1 = item.indexOf('r-')
  const num2 = item.indexOf('.vue')
  const pathName = item.substring(num1 + 2, num2)
  router.addRoute({
    path: '/' + pathName,
    name: pathName,
    component: modules[/* @vite-ignore */ item]
  })
})

export default router