// import { routes } from '@/router'
import { defineStore } from 'pinia'
import { routesList } from '@/router/config'
import { loginInfo, tagsView } from '@/api/type'
import { getAddRoutes } from '@/router/add-routes'
import { loginAPI, getInfoAPI, logoutAPI, getRoutersAPI } from '@/api/user/user'
import { getItem, setItem, removeAllItem, getLocalItem, setLocalItem, removeLocalItem } from '@/utils/storage'

const useUserStore = defineStore('userStore' , {
  state: () => {return {
    // 存储状态 放置变量所用
    id: 0,
    name: '',
    user: '',
    roles: <any>[],
    avator: '',
    avatar: '',
    nodeRole: undefined,
    menus: <tagsView[]>[],
    userInfo: <any>undefined,
    serverTime: <any>undefined,
    token: getLocalItem('token') || '',
    permissions: getItem('permissions') || [],
  }},
  // getters: {
  //   // 派生状态 就和vue的computed差不多
  //   user (state: any) {
  //     return state
  //   }
  // },
  actions: {
    // 获取set方法
    // 提交状态修改 不支持异步操作
    setToken (token: any) {
      this.token = token
      setLocalItem('token', token)
    },
    setMenus (menus: tagsView[]) {
      this.menus = menus
      // setItem('menus', menus)
    },
    setUserInfo (res: any) {
      const user = res.user

      if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        this.roles = res.roles
        this.permissions = res.permissions
        setItem('permissions', res.permissions)
      } else {
        this.roles = ['ROLE_DEFAULT']
      }
      this.userInfo = user
      this.name = user.userName
      this.nodeRole=res.nodeRole
      this.serverTime = new Date(res.sysTime)
      this.avatar = (user.avatar == "" || user.avatar == null) ? '' : user.avatar;
      setItem('userInfo', user)
    },
    login(data: loginInfo) {
      // console.log('state', state)
      return new Promise((resolve, reject) => {
        loginAPI(data).then(async (res: any) => {
          this.setToken(res.token)
          await this.getRouters()
          resolve(res)
        }).catch((err: Error) => {
          reject(err)
        })
      })
    },
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfoAPI().then((res: any) => {
          this.setUserInfo(res)
          resolve(res)
        }).catch((err: Error) => {
          reject(err)
        })
      })
    },
    getRouters () {
      return new Promise((resolve, reject) => {
        getRoutersAPI().then((res: any) => {
          this.setMenus(getAddRoutes(routesList || []))
          resolve(res)
        }).catch((err: Error) => {
          reject(err)
        })
      })
    },
    loginOut () {
      return new Promise((resolve, reject) => {
        logoutAPI().then(() => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeLocalItem('token')
          removeAllItem()
          resolve(true)
        }).catch((err: Error) => {
          reject(err)
        })
      })
    }
  },
})

export default useUserStore