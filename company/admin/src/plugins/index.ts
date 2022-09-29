import { App } from 'vue'
import modal from './modal'
export default function installPlugins(app: App) {
  app.config.globalProperties.$modal = modal
}