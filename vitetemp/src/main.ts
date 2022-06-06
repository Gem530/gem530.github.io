import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import '@/assets/css/iconfont.css'

const app = createApp(App)

// 注册一个全局自定义指令 `v-focus`
app.directive('loadmores', {
    // 当被绑定的元素挂载到 DOM 中时…… 
    mounted (el, binding) {
        const SELECTWRAP_DOM = el
        SELECTWRAP_DOM.addEventListener('scroll', function () {
            //  - Number(binding.arg)
            const CONDITION = Math.floor(SELECTWRAP_DOM.scrollHeight) - Math.ceil(SELECTWRAP_DOM.scrollTop) - 20 <= SELECTWRAP_DOM.clientHeight
            // const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
            // console.log('----', CONDITION, SELECTWRAP_DOM.scrollHeight, SELECTWRAP_DOM.scrollTop, SELECTWRAP_DOM.clientHeight)
            if (CONDITION) {
                binding.value()
            }
        })
    }
})

app.config.globalProperties.foo = 'foo-bar'
app.config.globalProperties.$con = () => { console.log('app-fun') }

app.use(store)
  .use(router)
  .mount('#app')
