<template>
    <div class="contanir theme" ref="chat">
        <!-- <button @click="sendMessage">发送消息</button> -->
        <div class="content">
            <component :is="componentList[state.index]"/>
        </div>
        <tab-nav :list="state.list" @tabClick="tabClick" :defaultIndex="state.index"></tab-nav>
    </div>
</template>

<script lang="ts">
    export default { name: 'chat' }
</script>
<script setup lang="ts">
    import { onMounted, reactive } from 'vue'
    import { useStore } from 'vuex'
    import { sendWs } from '@/util/ws.js'
    import GMessage from '@/components/g-message/index'
    import tabNav from '@/views/mobile/tabNav/index.vue'
    import home from '@/views/mobile/component/home/index.vue'
    import friends from '@/views/mobile/component/home/friends.vue'
    import main from '@/views/mobile/component/main/index.vue'

    const chat = ref()
    const store = useStore()

    const componentList = [home, friends, main]

    const state = reactive({
        index: 0,
        list: [{
            icon: 'icon-home',
            text: '首页'
        }, {
            icon: 'icon-smile',
            text: '好友'
        }, {
            icon: 'icon-user',
            text: '我的'
        }]
    })

    const sendMessage = () => {
        const msg = {
            name: store.getters.user.name,
            msg: '测试消息'
        }
        console.log(msg)
        sendWs(msg)
    }

    // 用于处理进入页面时tabNav的默认选项
    let localTabNav = Number(sessionStorage.getItem('tabNavIndex'))
    if (!localTabNav) localTabNav = 0
    state.index = localTabNav

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    const tabClick = (i: number) => {
        // console.log('tabClick', i)
        state.index = i
        sessionStorage.setItem('tabNavIndex', i + '')
    }
</script>

<style lang="scss" scoped>
    .contanir {
        @include wh(100vw, 100vh);
        overflow: hidden;

        .content {
            @include wh(100%, calcF(100vh, 50px));
        }
    }
</style>