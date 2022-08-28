import { createRouter, createWebHashHistory } from 'vue-router'
// import store from '@/store/modules/user'
import { menu } from './config'

// 遍历菜单列表并返回meta
function findRouter (path: string, menus: Array<any>) {
    let meta = {}
    function digui (submenu: Array<any>) {
        submenu.forEach((item: any) => {
            if (!item.children && path === item.key) { // 是菜单并且在路由中存在
                meta = item.meta
            }
            if (item.children && path !== item.key) { // 不是菜单
                digui(item.children)
            }
        })
    }
    digui(menus)
    return meta
}

function createRouterChildren () {
    // 如果直接使用import.meta.glob，vscode会报类型ImportMeta上不存在属性“glob”的错误，需要在tsconfig文件下添加类型定义vite/client  有效
    const modules = import.meta.glob('../views/**/**.vue')
    const keys = Object.keys(modules).filter(item => { return item.indexOf('r-') !== -1 })
    const list:{
        path: string,
        name: string,
        meta: Record<string, any>,
        component: any
    }[] = []
    keys.forEach((item) => {
        // console.log(item)
        const num1 = item.indexOf('r-')
        const num2 = item.indexOf('.vue')
        const pathName = item.substring(num1 + 2, num2)
        list.push({
            path: pathName,
            name: pathName,
            meta: findRouter('/' + pathName, menu),
            component: modules[/* @vite-ignore */ item]
        })
    })
    return list
}
// console.log(createRouterChildren())
// console.log(...createRouterChildren())

const routes = [
    // 未输入路径重定向到home
    {
        path: '/',
        redirect: '/index'
    },
    // 配置未定义的路由跳转到404页面
    {
        path: '/:pathMatch(.*)*',
        redirect: '/error'
        // name: 'error',
        // component: () => import('@/views/error.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('@/views/error.vue')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('@/views/index.vue'),
        children: [
            {
                path: '',
                redirect: '/index/home'
            },
            ...createRouterChildren()
        ]
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/chat.vue')
    }
    // { path: '/home', name: 'path', component: () => import('@/views/r-home.vue') },
    // { path: '/canvas', name: 'canvas', component: () => import('@/views/r-canvas.vue') },
    // { path: '/shopGame', name: 'shopGame', component: () => import('@/views/r-shopGame.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// router.beforeEach((to, from, next) => {
//     console.log(to, from, store)
//     next()
// })

function returnMobileRouter () {
    const modules = import.meta.glob('../views/mobile/**/**.vue')
    const keys = Object.keys(modules).filter(item => { return item.indexOf('r-') !== -1 })
    keys.forEach((item) => {
        const num1 = item.indexOf('r-')
        const num2 = item.indexOf('.vue')
        const pathName = item.substring(num1 + 2, num2)
        // console.log(pathName)
        router.addRoute({
            path: '/' + pathName,
            name: pathName,
            component: modules[/* @vite-ignore */ item]
        })
    })
}
returnMobileRouter()


export default router