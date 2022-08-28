<template>
    <div class="contanir component theme">
        <div class="title">
            我的好友列表
            <button @click="router.push('/friends')">去添加好友</button>
            <button @click="router.push('/createGroup')">建群</button>
        </div>
        <div class="friend-list friend-request-list">
            <div class="friend-title">好友申请列表</div>
            <template v-if="state.friendRequestList.length">
                <div
                    :key="item.send_id"
                    class="friend-item"
                    v-for="item in state.friendRequestList"
                >
                    <div>{{item.name}}</div>
                    <div>
                        <button @click="updateFriendRequest(item.Id, 1)">同意</button>
                        <button @click="updateFriendRequest(item.Id, 2)">拒绝</button>
                    </div>
                </div>
            </template>
            <div class="friend-empty" v-else>没有更多了</div>
        </div>

        <div class="friend-list">
            <div class="friend-title">好友列表</div>
            <template v-if="state.friendList.length">
                <div
                    :key="item.Id"
                    class="friend-item"
                    v-for="item in state.friendList"
                >{{item.name}}</div>
            </template>
            <div class="friend-empty" v-else>没有更多了</div>
        </div>

        <div class="friend-list">
            <div class="friend-title">群列表</div>
            <template v-if="state.groupList.length">
                <div
                    :key="item.friend_id"
                    class="friend-item"
                    v-for="item in state.groupList"
                >{{item.group_name}}</div>
            </template>
            <div class="friend-empty" v-else>没有更多了</div>
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'MyFriend' }
</script>
<script setup lang="ts">
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import { onMounted, reactive } from 'vue'
    import { userFriendListAPI, userGroupListAPI, userFriendRequestListAPI, updateFriendRequestAPI } from '@/api/index'
    import GMessage from '@/components/g-message/index.ts'
    const store = useStore()
    const router = useRouter()

    const state = reactive({
        userId: store.getters.user.userId,
        groupList: [],
        friendList: [],
        friendRequestList: []
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    // 获取好友列表
    const userFriendList = () => {
        userFriendListAPI(state.userId).then((res) => {
            // console.log(res)
            state.friendList = res.data
        }).catch((err) => {
            GMessage({ type: 'error', message: '获取好友列表失败：' + err.message })
        })
    }
    userFriendList()

    // 获取群列表
    const userGroupList = () => {
        userGroupListAPI(state.userId).then((res) => {
            // console.log(res)
            state.groupList = res.data
        }).catch((err) => {
            GMessage({ type: 'error', message: '获取群列表失败：' + err.message })
        })
    }
    userGroupList()

    // 获取好友申请列表
    const userFriendRequestList = () => {
        userFriendRequestListAPI(state.userId).then((res) => {
            // console.log(res)
            state.friendRequestList = res.data
        }).catch((err) => {
            GMessage({ type: 'error', message: '获取好友申请列表失败：' + err.message })
        })
    }
    userFriendRequestList()

    // 好友申请处理
    const updateFriendRequest = (id: number, state: number) => {
        const data = {
            id,
            state
        }
        console.log(data)
        updateFriendRequestAPI(data).then(() => {
            // console.log(res)
            userFriendList()
            userFriendRequestList()
        }).catch((err) => {
            GMessage({ type: 'error', message: '好友申请处理失败：' + err.message })
        })
    }
</script>

<style lang="scss" scoped>
.friend-list {
    margin-bottom: 15px;
}
</style>