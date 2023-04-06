import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps
} from 'vite-plugin-qiankun/dist/helper'

let app: any

const render = (container?: any) => {
  app = createApp(App)
  app.use(router).mount(container ? container.querySelector('#childModule') : '#childModule')
}

const initQiankun = () => {
  renderWithQiankun({
    bootstrap() { },
    mount(props: QiankunProps) {
      const { container, token } = props
      console.log('微应用-child：renderWithQiankun', props)
      sessionStorage.setItem('token', token)
      render(container)
    },
    unmount() {
      console.log('微应用-child：unmount')
      app.unmount()
    },
    update: function (props: QiankunProps): void | Promise<void> {
      console.log("微应用-child：update", props);
    }
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQiankun() : render()
