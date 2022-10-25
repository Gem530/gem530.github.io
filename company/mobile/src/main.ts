import { createApp } from 'vue'
import 'amfe-flexible'
import App from './App.vue'
import pinia from './store'
import i18n from './locales'
import './router/permission'
import router from './router'

const app = createApp(App)

app.use(router)
  .use(i18n)
  .use(pinia)
  .mount('#app')
