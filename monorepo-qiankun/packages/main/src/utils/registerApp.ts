import { start, registerMicroApps } from 'qiankun'

const env = import.meta.env.VITE_BASIC_ENV // dev开发 prod生产
const getActiveRule = (hash: any) => (location: any) => location.hash.startsWith(hash)
const appList = [
  {
    name: 'childModule', // 子应用名称，跟package.json一致
    entry: env == 'dev' ? 'http://192.168.2.103:9001/' : 'https://57k67j9137.zicp.fun/children/child/index.html', // 子应用入口，本地环境下指定端口
    container: '#sub-child', // 挂载子应用的dom
    activeRule: getActiveRule('#/child'), // 路由匹配规则
    props: {
      token: '123123'
    } // 主应用与子应用通信传值
  },
  {
    name: 'admin', // 子应用名称，跟package.json一致
    entry: env == 'dev' ? 'http://192.168.2.103:9002/' : 'https://57k67j9137.zicp.fun/children/admin/index.html', // 子应用入口，本地环境下指定端口
    container: '#sub-admin', // 挂载子应用的dom
    activeRule: getActiveRule('#/admin'), // 路由匹配规则
    props: {
      token: 'admin'
    } // 主应用与子应用通信传值
  },
]

registerMicroApps(appList, {
  beforeLoad: async (app) => {
    console.log('乾坤beforeLoad...', app.name)
  },
  beforeMount: async (app) => {
    console.log('乾坤beforeMount...', app.name)
  },
  afterMount: async (app) => {
    console.log('乾坤afterMount...', app.name)
  },
  afterUnmount: async (app) => {
    console.log('乾坤afterUnmount...', app.name)
  }
})

start({
  prefetch: false,
  sandbox: true,
  // sandbox: {
  //   // strictStyleIsolation: true,
  //   experimentalStyleIsolation: true // 样式隔离
  // },
  // excludeAssetFilter: (assetUrl: string) => {
  //   const whiteList = ['https://api.map.baidu.com/api?v=3.0&ak=viZsULjRTV2XTd5bGXNLv2Gy9XnFUn3a']
  //   // 白名单协议:子应用下如需要放行动态加载的css/js资源,可以在链接上带上参数 _custom-exclude_=MAIN ;该功能未测试过,不知效果如何
  //   const whiteWords = ['_custom-exclude_=MAIN']
  //   let flag = false
  //   if (whiteList.includes(assetUrl)) {
  //     flag =  true
  //   }
  //   // console.log(flag)
  //   return flag
  // }
})