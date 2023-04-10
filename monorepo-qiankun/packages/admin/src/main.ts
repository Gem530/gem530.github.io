import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import directives from './directives'
import installPlugins from './plugins'
import * as Icons from '@element-plus/icons-vue'
import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps
} from 'vite-plugin-qiankun/dist/helper'

import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-notification.css'


import './router/permission'

// const app = createApp(App)

// installPlugins(app)

// directives(app)
// app.use(router)
//   .use(store)
//   .mount('#app')

// for (const [key, component] of Object.entries(Icons)) {
//   if ('Menu' != key) {
//     app.component(key, component)
//   } else {
//     app.component(key + 'Icon', component)
//   }
// }

let app: any

const render = (container?: any) => {
  app = createApp(App)
  installPlugins(app)
  directives(app)
  app
  .use(router)
  .use(store)
  .mount(container ? container.querySelector('#admin') : '#admin')

  for (const [key, component] of Object.entries(Icons)) {
    if ('Menu' != key) {
      app.component(key, component)
    } else {
      app.component(key + 'Icon', component)
    }
  }
}

const initQiankun = () => {
  renderWithQiankun({
    bootstrap() { },
    mount(props: QiankunProps) {
      const { container, token } = props
      console.log('微应用-admin：renderWithQiankun', props)
      sessionStorage.setItem('token', token)
      render(container)
    },
    unmount() {
      console.log('微应用-admin：unmount')
      app.unmount()
    },
    update: function (props: QiankunProps): void | Promise<void> {
      console.log("微应用-admin：update", props);
    }
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQiankun() : render()