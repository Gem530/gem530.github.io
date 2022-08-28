<template>
    <div class="contanir component theme">
        <div>Id：{{state.userInfo.Id}}</div>
        <div>名称：{{state.userInfo.name}}</div>
        <div><button @click="addFriend">添加好友</button></div>
    </div>
</template>

<script lang="ts">
    export default { name: 'MyFriend' }
</script>
<script setup lang="ts">
    import { useStore } from 'vuex'
    import { useRoute, useRouter } from 'vue-router'
    import { onMounted, reactive } from 'vue'
    import { getUserInfoAPI, friendApplyAPI } from '@/api/index'
    import GMessage from '@/components/g-message/index.ts'
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
        userId: store.getters.user.userId,
        friendId: route.query.id,
        userInfo: {
            Id: 0,
            name: '',
            avator: ''
        }
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    // 获取用户信息
    const getUserInfo = () => {
        getUserInfoAPI(state.friendId).then((res) => {
            // console.log(res)
            state.userInfo = res.data[0]
        }).catch((err) => {
            GMessage({ type: 'error', message: '获取用户信息失败：' + err.message })
        })
    }
    getUserInfo()

    // 添加好友
    const addFriend = () => {
        const data = {
            sendId: Number(state.userId),
            recvId: Number(state.friendId)
        }
        // console.log(data)
        friendApplyAPI(data).then((res) => {
            console.log(res)
            router.push('/chat')
        }).catch((err) => {
            GMessage({ type: 'error', message: '添加好友失败：' + err.message })
        })
    }
</script>

<style lang="scss" scoped>

</style>