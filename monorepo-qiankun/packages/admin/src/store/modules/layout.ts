import { defineStore } from 'pinia'
import { tagsView } from '@/api/type'
import { changeScssData } from '@/utils/theme'
import { getItem, setItem } from '@/utils/storage'

const useLayoutStore = defineStore('layoutStore', {
  state: () => {return {
    // 存储状态 放置变量所用
    isCollapse: false,
    isMobileCollapse: true,
    defaultActive: (getItem('defaultActive') || ''),
    activeCollapse: (getItem('activeCollapse') || [])
  }},
  getters: {
    // 派生状态 就和vue的computed差不多
    tagsView (state: any) {
      return state
    }
  },
  actions: {
    // 获取set方法
    changeCollapse (flag: boolean) {
      this.isCollapse = flag
      changeScssData('--base-side-bar-width', flag ? '64px' : '200px')
    },
    changeMobileCollapse (flag: boolean) {
      this.isMobileCollapse = flag
      changeScssData('--base-side-bar-fixed-width', flag ? '0px' : '200px')
    },
    setDefaultActive (path: string) {
      this.defaultActive = path
      setItem('defaultActive', this.defaultActive)
    },
    pushCollapse (path: string) {
      if (this.activeCollapse.indexOf(path) === -1) this.activeCollapse.push(path)
      setItem('activeCollapse', this.activeCollapse)
    },
    removeCollapse (path: string) {
      const num = this.activeCollapse.findIndex((v: string) => v == path)
      if (num !== -1) this.activeCollapse.splice(num, 1)
      setItem('activeCollapse', this.activeCollapse)
    },
  }
})
export default useLayoutStore