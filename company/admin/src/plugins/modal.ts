import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  MessageParams,
  ElNotification,
  ElMessageBoxOptions
} from "element-plus"
let loadingInstance: { close: () => void };
export default {
  // 通知弹窗
  notif (content: any) {
    ElNotification(content)
  },
  // 消息弹窗
  message (content: MessageParams|string) {
    let container: MessageParams
    if (typeof content === 'string') {
      container = { type: 'success', message: content }
    } else {
      container = content
    }
    ElMessage(container)
  },
  // 确认窗体
  confirm (content: string, title: string, config: ElMessageBoxOptions = {}) {
    return ElMessageBox.confirm(content, title || "系统提示", Object.assign({
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning",
    }, config))
  },
  // 提交内容
  prompt (content: string, title: string, config: ElMessageBoxOptions = {}) {
    return ElMessageBox.prompt(content, title || "系统提示", Object.assign({
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }, config))
  },
  // 加载动画
  loading (content: string, color: string) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: content || '正在加载中...',
      background: color || 'rgba(0, 0, 0, 0.7)'
    })
  },
  // 关闭加载动画
  closeLoading () {
    loadingInstance.close();
  }
}