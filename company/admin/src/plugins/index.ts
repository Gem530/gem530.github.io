import { App } from 'vue'
import auth from './auth'
import modal from './modal'
export default function installPlugins(app: App) {
  app.config.globalProperties.$auth = auth
  app.config.globalProperties.$modal = modal
}