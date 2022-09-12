import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import directives from './directives'
import * as Icons from '@element-plus/icons-vue'

import './router/permission'

const app = createApp(App)

directives(app)
app.use(router)
  .use(store)
  .mount('#app')

for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}
