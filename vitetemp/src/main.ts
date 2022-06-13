import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import directive from './directive'

import '@/assets/css/iconfont.css'

const app = createApp(App)

directive(app)

app.config.globalProperties.foo = 'foo-bar'
app.config.globalProperties.$con = () => { console.log('app-fun') }

// ---------------------- 路由拦截 方法 -----------------------------------//
router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem('token')
    // 无token，一律跳转到登录页
    if (!token && to.path !== '/login') {
        next('/login')
    }
    next()
})
// --------------------------- 路由拦截 方法---------------------------------------------- //

app.use(store)
  .use(router)
  .mount('#app')
