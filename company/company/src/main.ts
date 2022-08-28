import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// app.use(ElementPlus)
createApp(App).use(ElementPlus).mount('#app')
