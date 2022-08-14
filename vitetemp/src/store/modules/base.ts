export default {
  state: {
    // 存储状态 放置变量所用
    isPC: true, // true为pc，false为mobile
    navFlag: false // true为文字+icon  false为icon
  },
  getters: {
    // 派生状态 就和vue的computed差不多
    base (state: any) {
      return state
    }
  },
  mutations: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
    setBaseMutation (state: any, data: any) {
      Object.assign(state, data)
    }
  },
  actions: {
    // 和mutations类似 支持异步操作
    setBaseAction (ctx: any, data: any) {
      ctx.commit('setBaseMutation', data)
    }
  },
  modules: {
    // store的子模块，内容就相当于是store的一个实例。调用方式和前面介绍的相似，只是要加上当前子模块名，如：store.a.getters.xxx()。
  }
}