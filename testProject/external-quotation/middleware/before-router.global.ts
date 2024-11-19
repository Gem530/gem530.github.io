export default defineNuxtRouteMiddleware((to: any, from: any) => {
    const headers = useRequestHeaders()
    // useIPLang().value = 'en_US'
    // useMain.setHeadersParams(JSON.stringify(headers))
    useHeadersParams().value = JSON.stringify(headers)
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
    console.log('headers--:', headers)
    // 取消上个页面中还在加载中的接口
    // if (usePenFetch().value) {
    //   usePenFetch().value.map((item: any) => {
    //     if (!['/user/getInfo','/purchase/sale/count'].includes(item.url)) {
    //       item.abort()
    //     }
    //   })
    //   usePenFetch().value = []
    // }
    // // console.log('路由中间件', to, from)
    // $fetch('prod-api1/check', {method: 'GET'}).then((res: any) => {
    //   // if (res.success) {
    //   navigateTo({
    //     path: '/welcome',
    //     replace: true
    //   })
    //   // }
    //   // nextTick(() => {
    //   //   sessionStorage.setItem('useIsCountry', res.success)
    //   // })
    // })
    // // const isCountry = sessionStorage.getItem('useIsCountry')
    // // if (isCountry == 'true') {
    // //   if (to.path != '/welcome') {
    // //     return navigateTo('/welcome')
    // //   }
    // // }
    if (!['/online-count','/pcba-file'].includes(to.path)) {
      usePcbAOrder().value = undefined
      removeLocal('usePcbAOrder')
    }
    // 需要登录的页面
    let token = localStorage.getItem('useAccessToken')
    token = token && JSON.parse(decryptWithAes(token, env().VITE_ABC))
    const checkList = ['/user', '/order', '/address-manage', '/pay', '/pay-result', '/notify']
    if (checkList.includes(to.path)) {
      if (token) {
        // 已登录
        // return navigateTo(`/login?redirect=${to.fullPath}`)
        // 已登录
        getInfo()
        return
      } else {
        // 未登录
        if (to.path != '/login') {
          return navigateTo(`/login?redirect=${to.fullPath}`)
        }
      }
    }
    if (token) {
      // 已登录
      getInfo()
      getOrderNum()
    }
  })