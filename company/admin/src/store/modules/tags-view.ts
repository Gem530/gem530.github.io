import { tagsView } from '@/api/type'
import router, { routeHome } from '@/router'
import { getItem, setItem } from '@/utils/storage'

const homeRoute = {
  meta: {title: "首页", icon: "House", affix: true},
  name: "Home",
  path: "/home"
}

export default {
  namespaced: true,
  state: {
    // 存储状态 放置变量所用
    tagsView: (getItem('tagsView') || [homeRoute]) as tagsView[]
  },
  getters: {
    // 派生状态 就和vue的computed差不多
    tagsView (state: any) {
      return state
    }
  },
  mutations: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
    pushTagsView (state: any, tagsInfo: tagsView) {
      const i = state.tagsView.findIndex((item: tagsView) => { return item.path === tagsInfo.path })
      // console.log(tagsInfo)
      if (i === -1) state.tagsView.push(tagsInfo)
      setItem('tagsView', state.tagsView)
    },
    delTagsView (state: any, path: string) {
      if (!state.tagsView.length) {
        state.tagsView = routeHome
      }

      const i = state.tagsView.findIndex((item: tagsView) => { return item.path === path })
      if (i !== -1) {
        state.tagsView.splice(i, 1)
        router.push(state.tagsView[i-1]?.path || '/index')
      }
      setItem('tagsView', state.tagsView)
    }
  },
  actions: {}
}