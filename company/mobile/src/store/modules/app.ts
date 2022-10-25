import { defineStore } from 'pinia'
import device from '@/utils/device'
import { getLocalItem, setLocalItem } from '@/utils/storage'

const useApp = defineStore('app', {
  state: () => {
    return {
      lang: getLocalItem('lang') || 'zh_CN',
      count: 99,
      device: device()
    }
  },
  getters: {
    doubleCount (state: any) {
      return state.count * 2
    }
  },
  actions: {
    changeDevice () {
      console.log(this.device)
    },
    setLang (type: string) {
      return new Promise((resolve, reject) => {
        try {
          this.lang = type
          setLocalItem('lang', type)
          resolve(true)
        } catch (err) {
          reject(err)
        }
      })
    }
  }
})

export default useApp