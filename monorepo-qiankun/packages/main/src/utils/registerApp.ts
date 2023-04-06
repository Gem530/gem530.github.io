import { start, registerMicroApps } from 'qiankun'

const env = import.meta.env.VITE_BASIC_ENV // dev开发 prod生产
const getActiveRule = (hash: any) => (location: any) => location.hash.startsWith(hash)
const appList = [
  {
    name: 'childModule', // 子应用名称，跟package.json一致
    entry: env == 'dev' ? '//192.168.2.103:9001/' : '/child/index.html', // 子应用入口，本地环境下指定端口
    container: '#sub-child', // 挂载子应用的dom
    activeRule: getActiveRule('#/child'), // 路由匹配规则
    props: {
      token: '123123'
    } // 主应用与子应用通信传值
  }
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
  sandbox: {
    experimentalStyleIsolation: true // 样式隔离
  }
})