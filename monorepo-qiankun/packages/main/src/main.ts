import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

let app = createApp(App)

import './utils/registerApp'

app.use(router).mount('#app')
