import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import directives from './directives'
import * as Icons from '@element-plus/icons-vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import './router/permission'

const app = createApp(App)

// const iconComponent = {
//   install: (app: any) => {
//       const com = Icons as any
//       for (const key in com) {
//           const componentConfig = com[key];
//           app.component(componentConfig.name, componentConfig);
//       }
//   },
// };

directives(app)
app.use(router)
  .use(store)
  // .use(iconComponent)
  // .use(ElementPlus)
  .mount('#app')

for (const [key, component] of Object.entries(Icons)) {
  // app.component(key + 'Icon', component)
  if ('Menu' != key) {
    app.component(key, component)
  } else {
    app.component(key + 'Icon', component)
  }
}
