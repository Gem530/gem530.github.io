import { tagsView } from '@/api/type'
import { getItem, setItem } from '@/utils/storage'

export default {
  namespaced: true,
  state: {
    // 存储状态 放置变量所用
    isCollapse: false,
    defaultActive: (getItem('defaultActive') || ''),
    activeCollapse: (getItem('activeCollapse') || [])
  },
  // getters: {
  //   // 派生状态 就和vue的computed差不多
  //   tagsView (state: any) {
  //     return state
  //   }
  // },
  mutations: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
    toggleCollapse (state: any) {
      state.isCollapse = !state.isCollapse
      // setItem('isCollapse', state.isCollapse)
    },
    setDefaultActive (state: any, name: string) {
      state.defaultActive = name
      setItem('defaultActive', state.defaultActive)
    },
    pushCollapse (state: any, name: string) {
      if (state.activeCollapse.indexOf(name) === -1) state.activeCollapse.push(name)
      setItem('activeCollapse', state.activeCollapse)
    },
    removeCollapse (state: any, name: string) {
      const num = state.activeCollapse.findIndex((v: string) => v == name)
      if (num !== -1) state.activeCollapse.splice(num, 1)
      setItem('activeCollapse', state.activeCollapse)
    },
  },
  actions: {}
}