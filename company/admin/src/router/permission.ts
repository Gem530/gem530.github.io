import router from './index'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { getLocalItem } from '@/utils/storage'
import useUserStore from '@/store/modules/user'
import useTagsStore from '@/store/modules/tags-view'

let initRoute = false // 初始化动态路由
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const tagsStore = useTagsStore()
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
    if (userStore.roles.length === 0) {
      await userStore.getInfo()
    }
    if (userStore.menus.length === 0) {
      await userStore.getRouters()
      .then((res: any) => {
        // console.log('permission-----', res)
        // 处理刷新时空白页问题
        if (to.matched.length == 0) {
          router.push(to.path);
        }
      })
      next({ ...to, replace: true })
    } else {
      let routeInfo = {
        name: to.name as string,
        path: to.path,
        meta: to.meta
      }
      tagsStore.pushTagsView(routeInfo)
      next()
    }
    // next()
  }
})

router.afterEach(() => {
  NProgress.done()
})