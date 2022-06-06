<template>
    <div class="contanir theme">
        头部菜单{{navFlag}}
        <button @click="changeTheme">切换主题色</button>
        <button @click="changeLeftWidth">切换侧边栏宽度</button>
        <button @click="removeLoaclStorage">清除缓存</button>

        <div class="router-list">
            <div
                class="router-item"
                v-for="item in routerList" :key="item.key"
                :class="{
                    'router-item-home': item.key === '/home',
                    'router-item-active': item.key === pathKey
                }"
                @click="toRouter(item)">
                {{item.name}}
                <i class="iconfont icon-close-bold close" @click.stop="removeRouter(item)" v-if="item.key !== '/home'"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'top' }
</script>
<script setup lang="ts">
    import { computed, watch } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    // onMounted(() => {
    //   console.log('onMounted')
    // })

    const store = useStore()
    const router = useRouter()
    // computed
    const navFlag = computed(() => {
        return store.getters.base.navFlag
    })
    const routerList = computed(() => {
        return store.getters.routerListGetter
    })

    const pathKey = computed(() => {
        return store.getters.currentRouterGetter.key
    })

    if (routerList.value.length <= 1) {
        store.commit('setCurrentRouter', {
            name: '首页',
            key: '/home'
        })
    }

    // watch(() => store.getters.routerListGetter, (val, old) => {
    //   console.log('----', val, old)
    // }, { deep: true, immediate: true })

    // 删除路由列表
    const removeRouter = (item: Record<string, any>) => {
        store.commit('removeRouterList', item)
    }

    // 跳转路由
    const toRouter = (item: Record<string, any>) => {
        // console.log(item)
        store.commit('setCurrentRouter', item)
    }

    // 切换主题色
    const changeTheme = () => {
        changeScssData('--colorWhite', returnColor())
        changeScssData('--colorBlack', returnColor())
    }

    // 切换侧边栏宽度
    const changeLeftWidth = () => {
        // console.log(!navFlag.value)
        store.dispatch('setBaseAction', { navFlag: !navFlag.value })
        // changeScssData('--leftWidth', twoNumberBetween(50, 200) + 'px')
    }

    // 清除缓存
    const removeLoaclStorage = () => {
        localStorage.clear()
    }

    // 改变scss全局变量方法
    const changeScssData = (varName: string, varValue: string) => {
        // 使用这个方法改变scss全局变量时，scss定义需要这样：$white: var(--colorWhite, #ffffff); 要加上var(--xxx, xxx)
        document.getElementsByTagName('body')[0].style.setProperty(varName, varValue)
    }

    // 返回随机颜色
    const returnColor = () => {
        const r = twoNumberBetween(0, 255)
        const g = twoNumberBetween(0, 255)
        const b = twoNumberBetween(0, 255)
        return `rgb(${r},${g},${b})`
    }

    // 取两数之间的随机整数
    const twoNumberBetween = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) + min)
    }
</script>

<style lang="scss" scoped>
// body{
//   background: $white;
// }
.contanir {
    position: fixed;
    top: 0;
    left: $leftWidth;
    @include wh(calcF(100vw, $leftWidth), $topHeight);
    border-bottom: 1px solid $borderColor;
    z-index: 2;

    .router-list {
        @include wh(100%, 50px);
        @include pcenter(100%, 0, -100%, 0);
        @include flex(flex-start, flex-end, row, nowrap);
        overflow-x: auto;
        overflow-y: hidden;

        .router-item {
            flex: none;
            position: relative;
            height: 30px;
            font-size: 14px;
            padding: 0 19px 0 5px;
            border: 1px solid $black;
            cursor: pointer;
            @include textcenter(28px);
            @include text_overflow();

            &.router-item-home {
                padding: 0 5px;
            }

            &.router-item-active {
                color: $white;
                background: $black;
            }

            .close {
                @include pcenter(50%, 100%, -50%, -110%);
            }
        }
    }
}
</style>