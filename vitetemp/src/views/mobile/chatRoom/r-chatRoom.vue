<template>
    <div class="contanir theme" ref="mainDom">
        <Headers>
            <template #title>聊天室</template>
        </Headers>
        
        <main class="main">
            <div :class="{'message-item':true, 'right': isMyselfy(item.send_id)}" v-for="item in state.list" :key="item.Id">
                <img class="message-avator" :src="item.avator" v-if="item.avator">
                <img class="message-avator" src="@/assets/img/avator.jpg" v-else>
                <div class="message-info">
                    <div class="message-name">{{isMyselfy(item.send_id) ? item.send_name : item.recv_name}}</div>
                    <div class="message-time">{{formatDate(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</div>
                    <div class="message-box">{{item.msg}}</div>
                </div>
            </div>
        </main>

        <Sends @send="sendMsg"></Sends>
    </div>
</template>

<script lang="ts">
    export default { name: 'r-chatRoom' }
</script>
<script setup lang="ts">
    import { useStore } from 'vuex'
    import { sendWs } from '@/util/ws.js'
    import { parseTime, toScrollTop } from '@/util/index'
    import { nextTick, onMounted, reactive, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import Sends from '@/components/base/send.vue'
    import Headers from '@/components/base/header.vue'
    import GMessage from '@/components/g-message/index'
    import { sendMsgFriendAPI, updateUnreadMsgAPI, getUserMsgRecordAPI } from '@/api/index'

    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const mainDom = ref()

    const state = reactive({
        Id: 0, // 当前用户
        recvId: 0, // 聊天好友
        list: []
    })

    state.Id = store.getters.user.userId
    state.recvId = store.getters.chatRoom.Id

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('route:' + route.query.id)
        // console.log('chatRoom:')
        // console.log(store.getters.user)
        // console.log('chatRoomVuex:')
        // console.log(store.getters.chatRoom)
    })

    // 获取webscoket消息
    const getSocketData = ({ detail }) => {
        const item = JSON.parse(detail.data)
        // console.log('getSocketData', item)
        if ((item.send_id === state.Id && item.recv_id === state.recvId) || (item.send_id === state.recvId && item.recv_id === state.Id)) {
            state.list.push(item)
        }
    }

    window.addEventListener('onmessageWS', getSocketData)

    // 发送消息
    const sendMsg = (msg: string) => {
        // console.log('msg--', msg)
        const param = {
            msg, // 消息
            sendId: state.Id, // 发送人id
            recvId: state.recvId // 接受人id
        }
        sendMsgFriendAPI(param).then((res) => {
            const data = {
                msg,
                send_id: store.getters.user.userId,
                send_name: store.getters.user.name,
                createTime: new Date(),
                recv_id: store.getters.chatRoom.Id,
                recv_name: store.getters.chatRoom.name,
                avator: store.getters.user.avator
            }
            sendWs(data)
            // console.log(res)
        }).catch((err) => {
            GMessage({message: '消息发送失败：' + err.message, type: 'error', duration: 1500})
        })
    }

    // 更新消息状态
    const updateUnreadMsg = () => {
        const param = {
            sendId: state.recvId,
            recvId: state.Id
        }
        updateUnreadMsgAPI(param).then((res) => {
            console.log(res)
        }).catch((err) => {
            GMessage({message: '更新消息状态失败：' + err.message, type: 'error', duration: 1500})
        })
    }
    updateUnreadMsg()

    // 获取用户与该好友聊天记录
    const getUserMsgRecord = (msg: string) => {
        // console.log('msg--', msg)
        const param = {
            page: 1,
            sendId: state.Id, // 发送人id
            recvId: state.recvId, // 接受人id
            pageSize: 10
        }
        getUserMsgRecordAPI(param).then((res) => {
            // console.log(res)
            state.list = res.data
            toScrollTop(mainDom.value, mainDom.value.scrollHeight)
        }).catch((err) => {
            GMessage({message: '获取与好友的聊天记录失败：' + err.message, type: 'error', duration: 1500})
        })
    }
    getUserMsgRecord()

    // 格式化时间
    const formatDate = (time: any, format: string) => {
        return parseTime(time, format)
    }
    // 判断是否为本身
    const isMyselfy = (id: number) => {
        return id === store.getters.user.userId
    }
</script>

<style lang="scss" scoped>
.contanir {
    height: 100vh;
    overflow-y: auto;
}
.main {
    min-height: calcF(100vh, 90px);
    padding: 20px;
    background: rgba($color: #eeeeee, $alpha: 0.5);

    .message-item {
        @include flex(flex-start, flex-start);
        margin-bottom: 15px;

        &.right {
            flex-flow: row-reverse;

            .message-avator {
                margin-right: 0;
                margin-left: 5px;
            }

            .message-info {
                @include flex(flex-start, flex-end, column);

                .message-name,
                .message-time {
                    @include flex(flex-end, center);
                }
            }
        }

        .message-avator {
            width: 40px;
            height: 40px;
            margin-right: 5px;
            border-radius: 50%;
        }

        .message-info {
            flex: 1;

            .message-name {
                margin-bottom: 3px;
                font-weight: bold;
            }

            .message-time {
                margin-bottom: 10px;
                font-size: 12px;
                color: #999999;
            }

            .message-box {
                display: inline-block;
                padding: 5px 10px;
                background: #ffffff;
                border-radius: 6px;
            }
        }
    }
}
</style>