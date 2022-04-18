import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)

app.config.globalProperties.foo = 'foo-bar'
app.config.globalProperties.$con = () => { console.log('app-fun') }

app.use(store)
  .use(router)
  .mount('#app')
