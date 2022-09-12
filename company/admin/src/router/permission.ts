import router from './index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log('beforeEach--', to, from)
  next()
})

router.afterEach(() => {
  NProgress.done()
})