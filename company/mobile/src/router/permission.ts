import router from './index'

router.beforeEach((to, from, next) => {
  document.title = (to.meta?.title as string) || 'GEM' // 修改标题名称
  next()
})