import { createStore } from 'vuex'
import base from './modules/base'

export default createStore({
  state: {
    // 存储状态 放置变量所用
  },
  getters: {
    // 派生状态 就和vue的computed差不多
  },
  mutations: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
  },
  actions: {
    // 和mutations类似 支持异步操作
  },
  modules: {
    // store的子模块，内容就相当于是store的一个实例。调用方式和前面介绍的相似，只是要加上当前子模块名，如：store.a.getters.xxx()。
    base
  }
})