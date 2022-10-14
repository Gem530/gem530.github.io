import router from './index'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import store from '@/store/index'
import { getLocalItem } from '@/utils/storage'

let initRoute = false // 初始化动态路由
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const token = getLocalItem('token')
  // console.log('beforeEach--', to, from)
  // console.log(store.state.menus)
  // console.log(router.getRoutes())
  if (to.path == '/login') {
    next()
    return false
  }
  if (!token) {
    next({ path: '/login' })
    return false
  } else {
    if (store.state.roles.length === 0) {
      await store.dispatch('getInfo')
    }
    if (store.state.menus.length === 0) {
      await store.dispatch('getRouters')
      .then((res) => {
        // console.log('permission-----', res)
        // 处理刷新时空白页问题
        if (to.matched.length == 0) {
          router.push(to.path);
        }
      })
      next({ ...to, replace: true })
    } else {
      let routeInfo = {
        name: to.name,
        path: to.path,
        meta: to.meta
      }
      store.commit('pushTagsView', routeInfo)
      next()
    }
    // next()
  }
})

router.afterEach(() => {
  NProgress.done()
})