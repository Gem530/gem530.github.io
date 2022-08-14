<template>
    <div class="component theme">
        <g-wirless-list
            ref="refershRef"
            :list="state.list"
            height="calc(100vh - 50px)"
            :itemHeight="90"
            @dropDown="dropDown"
            @pullUp="pullUp">
            <!-- <div v-for="item in state.list" :key="item.Id">{{item.name}}</div> -->
            <template v-slot:default="slot">
                <div style="height: 60px;line-height: 60px;border-bottom: 1px solid #000;" @click="toChatRoom(slot.item)">
                    <div class="chat-item">
                        <div class="chat-name">{{slot.item.name}}</div>
                        <div class="chat-total" v-show="slot.item.total">{{slot.item.total}}</div>
                    </div>
                </div>
            </template>
        </g-wirless-list>
    </div>
</template>

<script lang="ts">
    export default { name: 'g-mobile-home' }
</script>
<script setup lang="ts">
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import { onMounted, reactive } from 'vue'
    import { chatRoom } from '@/util/otherType.ts'
    import GMessage from '@/components/g-message/index'
    import gWirlessList from '@/components/g-wirlessList/index.vue'
    import { userListAPI, getMsgListAPI, getUnreadMsgAPI } from '@/api/index.ts'

    const store = useStore()
    const router = useRouter()
    const refershRef = ref()

    const state = reactive({
        page: 1,
        list: [],
        pageSize: 10
    })

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        //    console.log('onMounted')
        // getUserList()
    })

    // 获取用户列表
    const getUserList = (type: string = 'pull') => {
        // type drop下拉刷新 pull触底加载
        getMsgListAPI(store.getters.user.userId).then((res) => {
            // GMessage({ message: res.message, type: 'success', duration: 2000 })
            // console.log(res)
            if (type === 'drop') {
                refershRef.value.pullSuccess()
            } else {
                if (res.data.length === 1 && res.data[0].send_id === null) {
                    state.list = []
                } else {
                    state.list = [...state.list, ...res.data]
                    getUnreadMsg()
                }
                refershRef.value.noMoreData()
            }
        }).catch(err => {
            GMessage({ message: err.message, type: 'error' })
        })
    }
    
    // 获取未读消息
    const getUnreadMsg = () => {
        getUnreadMsgAPI(store.getters.user.userId).then((res) => {
            // GMessage({ message: res.message, type: 'success', duration: 2000 })
            // console.log(res)
            if (!state.list.length) return
            state.list.forEach(item => {
                res.data.forEach(subitem => {
                    if (item.send_id === subitem.send_id) {
                        item.total = subitem.total
                    } else {
                        item.total = 0
                    }
                })
            })
        }).catch(err => {
            GMessage({ message: err.message, type: 'error' })
        })
    }

    // 跳转到聊天室
    const toChatRoom = (item: chatRoom) => {
        // console.log(item)
        store.dispatch('setChatRoomAction', item)
        router.push(`/chatRoom?id=${item.Id}`)
    }

    // 下拉刷新
    const dropDown = () => {
        state.page = 1
        state.list = []
        getUserList('drop')
    }

    // 触底加载更多
    const pullUp = () => {
        getUserList('pull')
    }
</script>

<style lang="scss" scoped>
.component {
    height: 100%;

    .chat-item {
        @include flex(space-between, center);
        padding: 0 10px;

        .chat-total {
            @include wh(25px, 25px);
            @include flex(center, center, row, nowrap);
            background: red;
            color: $white;
            border-radius: 50%;
        }
    }
}
</style>