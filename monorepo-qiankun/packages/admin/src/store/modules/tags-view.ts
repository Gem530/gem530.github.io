import { defineStore } from 'pinia'
import { tagsView } from '@/api/type'
import router from '@/router'
import { getItem, setItem } from '@/utils/storage'

const routeHome = [{
  path: '/admin/home',
  component: () => import(/* webpackChunkName: "home" */ '@/views/index.vue'),
  name: 'Home',
  meta: { title: '首页', icon: 'House', affix: true }
}]

const homeRoute = {
  meta: {title: "首页", icon: "House", affix: true},
  name: "Home",
  path: "/admin/home"
}

const useTagsStore = defineStore('tagsStore', {
  state: () => {return {
    // 存储状态 放置变量所用
    tagsView: (getItem('tagsView') || [homeRoute]) as tagsView[]
  }},
  // getters: {
  //   // 派生状态 就和vue的computed差不多
  //   tagsView (state: any) {
  //     return state
  //   }
  // },
  actions: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
    pushTagsView (tagsInfo: tagsView) {
      const i = this.tagsView.findIndex((item: tagsView) => { return item.path === tagsInfo.path })
      // console.log(tagsInfo)
      if (i === -1) this.tagsView.push(tagsInfo)
      setItem('tagsView', this.tagsView)
    },
    delTagsView (path: string) {
      if (!this.tagsView.length) {
        this.tagsView = routeHome
      }

      const i = this.tagsView.findIndex((item: tagsView) => { return item.path === path })
      if (i !== -1) {
        this.tagsView.splice(i, 1)
        router.push(this.tagsView[i-1]?.path || '/index')
      }
      setItem('tagsView', this.tagsView)
    }
  }
})
export default useTagsStore