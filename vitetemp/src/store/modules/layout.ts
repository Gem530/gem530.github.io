import router from "@/router"

export default {
    state: {
        // 存储状态 放置变量所用
        currentRouter: { // 当前路由对象
            // name: '', // 菜单名称
            // key: '', // 菜单唯一值
            // type: '', // 传参方式
            // data: '' // 菜单跳转带的数据
        },
        routerList: [{
            name: '首页',
            key: '/home'
        }] // 路由列表
    },
    getters: {
        // 派生状态 就和vue的computed差不多
        currentRouterGetter (state: any) {
            return state.currentRouter
        },
        routerListGetter (state: any) {
            return state.routerList
        }
    },
    mutations: {
        // 获取set方法
        // 提交状态修改 不支持异步操作
        // 修改当前路由对象
        setCurrentRouter (state: any, data: any) {
            // Object.assign(state, data)
            state.currentRouter = data
            if (data.type === 'query') {
                router.push({
                    name: data.key.substring(1),
                    query: data.data
                })
            } else {
                router.push({
                    name: data.key.substring(1),
                    params: data.data
                })
            }
        },
        // 添加路由列表
        addRouterList (state: any, data: any) {
            const index = state.routerList.findIndex((item: any) => { return item.key === data.key })
            if (index === -1) {
                // 如果在已有路由列表中不存在，直接添加
                state.routerList.push(data)
            } else {
                // 如果在已有路由列表中存在，就替换之前的
                state.routerList[index] = data
            }
            // console.log(state.routerList)
        },
        // 删除路由列表
        removeRouterList (state: any, data: any) {
            const index = state.routerList.findIndex((item: any) => { return item.key === data.key })
            state.routerList.splice(index, 1)
        }
    },
    actions: {
        // 和mutations类似 支持异步操作
        // setCurrentRouterAction (ctx: any, data: any) {
        //   ctx.commit('setBaseMutation', data)
        // }
    },
    modules: {
        // store的子模块，内容就相当于是store的一个实例。调用方式和前面介绍的相似，只是要加上当前子模块名，如：store.a.getters.xxx()。
    }
}