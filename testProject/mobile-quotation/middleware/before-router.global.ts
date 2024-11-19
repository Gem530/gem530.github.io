export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const headers = useRequestHeaders()
  // useIPLang().value = 'ru_RU'
  // useMain.setHeadersParams(JSON.stringify(headers))
  console.log('headers:', headers)
  if (headers['x-ipcountry']) {
    let lang = 'en_US'
    if (headers['x-ipcountry'] == 'RU') {
      lang = 'ru_RU'
    } else if (headers['x-ipcountry'] == 'KR') {
      lang = 'ko_KR'
    }
    // console.log('lang--', lang, headers, headers['x-ipcountry'])
    useIPLang().value = lang
  }
    // 在服务器端跳过中间件
    if (process.server) return
    // console.log(33)
    getLocal()
    if (!['/online-count','/pcba-file'].includes(to.path)) {
      usePcbAOrder().value = undefined
      removeLocal('usePcbAOrder')
    }
    // console.log('路由中间件', to, from)
    // 需要登录的页面
    let token = localStorage.getItem('useAccessToken')
    token = token && JSON.parse(decryptWithAes(token, env().VITE_ABC))
    const checkList = ['/user', '/order', '/address-manage', '/pay', '/pay-result', '/notify']
    if (checkList.includes(to.path)) {
      if (token) {
        // 已登录
        // return navigateTo(`/login?redirect=${to.fullPath}`)
        // getInfo()
        return
      } else {
        // 未登录
        // if (to.path != '/login') {
        //   return navigateTo(`/login?redirect=${to.fullPath}`)
        // }
      }
    }
    if (token) {
      // 已登录
      getInfo()
      getOrderNum()
    }
  })