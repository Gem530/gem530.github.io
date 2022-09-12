import { loginAPI } from '@/api/user'
import { loginInfo } from '@/api/type'

export default {
  state: {
    // 存储状态 放置变量所用
    id: 0,
    name: '',
    roles: [],
    token: '',
    avator: '',
    userInfo: undefined,
  },
  getters: {
    // 派生状态 就和vue的computed差不多
    user (state: any) {
      return state
    }
  },
  mutations: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
    setUserMutation (state: any, data: any) {
      Object.assign(state, data)
    }
  },
  actions: {
    login({ commit }: any, data: loginInfo) {
      console.log('login-vuex')
      loginAPI(data).then((res: any) => {
        console.log(res)
      }).catch((err: Error) => {
        console.log(err.message)
      })
    },
    // 和mutations类似 支持异步操作
    setUserAction ({ commit }: any, data: any) {
      commit('setUserMutation', data)
    }
  }
}