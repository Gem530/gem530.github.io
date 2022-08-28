<template>
    <div class="contanir theme">
        <div class="friend-list">
            <template v-if="state.friendList.length">
                <div
                    :key="item.friend_id"
                    :class="{
                        'friend-item': true,
                        'active': item.choose
                    }"
                    v-for="item in state.friendList"
                    @click="chooseUser(item)"
                >{{item.name}}</div>
            </template>
            <div class="friend-empty" v-else>没有更多了</div>
        </div>
        <input type="text" v-model="state.groupName" placeholder="请输入群名">
        <button @click="createGroup">建群</button>
    </div>
</template>

<script lang="ts">
    export default { name: 'createGroup' }
</script>
<script setup lang="ts">
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import { onMounted, reactive } from 'vue'
    import { createGroupAPI, userFriendListAPI } from '@/api/index'
    import GMessage from '@/components/g-message/index.ts'
    const store = useStore()
    const router = useRouter()

    const state = reactive({
        groupName: '',
        userId: store.getters.user.userId,
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
            state.friendList.forEach((item) => {
                item.choose = false
            })
        }).catch((err) => {
            GMessage({ type: 'error', message: '获取好友列表失败：' + err.message })
        })
    }
    userFriendList()

    // 选择用户
    const chooseUser = (item) => {
        // console.log(item)
        item.choose = !item.choose
    }

    // 检索条件
    const checkStatus = () => {
        const member = state.friendList.filter(item => { return item.choose })
        let str = ''
        if (!state.groupName) str = '请输入群名'
        else if (!member.length) str = '请输入选择群成员'
        return str
    }

    // 建群
    const createGroup = () => {
        const str = checkStatus()
        if (str) {
            GMessage({ type: 'error', message: str })
            return
        }
        const members = state.friendList.filter(item => { return item.choose }).map((item) => {
            return {
                id: item.friend_id,
                type: 0
            }
        })
        members.push({
            id: store.getters.user.userId,
            type: 1
        })
        const data = {
            groupName: state.groupName,
            members
        }
        // console.log(data)
        createGroupAPI(data).then((res) => {
            // console.log(res)
            GMessage({ type: 'success', message: '建群成功' })
        }).catch((err) => {
            GMessage({ type: 'error', message: '建群成功失败：' + err.message })
        })
    }
</script>

<style lang="scss" scoped>
.friend-list {
    margin-bottom: 15px;

    .friend-item {
        height: 35px;
        &.active {
            background: red;
            color: #fff;
        }
    }
}
</style>