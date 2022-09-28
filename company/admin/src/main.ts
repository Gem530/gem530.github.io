import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import directives from './directives'
import * as Icons from '@element-plus/icons-vue'

import 'element-plus/theme-chalk/el-message.css'
// import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message-box.css'
// import 'element-plus/theme-chalk/el-notification.css'

import './router/permission'

const app = createApp(App)

directives(app)
app.use(router)
  .use(store)
  .mount('#app')

for (const [key, component] of Object.entries(Icons)) {
  if ('Menu' != key) {
    app.component(key, component)
  } else {
    app.component(key + 'Icon', component)
  }
}
