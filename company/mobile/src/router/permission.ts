import router from './index'

router.beforeEach((to, from, next) => {
  // console.log(to, from)
  document.title = to.meta.title as string // 修改标题名称
  next()
})