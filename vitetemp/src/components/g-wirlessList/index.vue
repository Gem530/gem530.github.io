<template>
    <div class="component theme">
        <div class="list-wrap" ref="listWrap" @scroll="scroll">
            <div class="scroll-bar" ref="scrollBar"></div>
            <div class="list" ref="list">
                <div v-for="(val, i) in showList" :key="i" :style="`height: ${heightRound()}px;`">{{val}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'g-wirlessList' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    const list: any = ref()
    const listWrap: any = ref()
    const scrollBar: any = ref()
    const state: any = reactive({
        list: [], // 超长的显示数据
        itemHeight: 30, // 每一列的高度
        showNum: 10, // 显示几条数据
        start: 0, // 滚动过程显示的开始索引
        end: 10 // 滚动过程显示的结束索引
    })

    // computed
    const showList = computed(() => {
        return state.list.slice(state.start, state.end)
    })
    
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
       console.log('onMounted')
        // 构造一个超长列表
        for (let i = 0; i < 10; i++) {
          state.list.push('列表' + i)
        }
        // 计算滚动容器高度
        listWrap.value.style.height = state.itemHeight * state.showNum + 'px'
        scrollBar.value.style.height = state.itemHeight * state.list.length + 'px'
    })

    const heightRound = () => {
        return Math.floor(Math.random() * (60 - 30 + 1) + 30)
    }

    const scroll = () => {
        const dom = listWrap.value
        if (dom.scrollHeight - dom.scrollTop - 5 <= dom.clientHeight) {
            init()
        }
        // 获取滚动高度
        let scrollTop = listWrap.value.scrollTop
        // 开始的数组索引
        state.start = Math.round(scrollTop / state.itemHeight)
        state.end = state.start + state.showNum
        // 绝对定位对相对定位的偏移量
        list.value.style.top = state.start * state.itemHeight + 'px'
    }

    const init = () => {
        const num = state.list.length
        const list = []
        for (let i = num; i < num + 10; i++) {
            list.push('列表' + i)
        }
        state.list = [...state.list, ...list]
        // 计算滚动容器高度
        listWrap.value.style.height = state.itemHeight * state.showNum + 'px'
        scrollBar.value.style.height = state.itemHeight * state.list.length + 'px'
    }
</script>

<style lang="scss" scoped>
.list-wrap {
    position: relative;
    overflow-y: scroll;
    width: 200px;
    margin: 100px auto;
    box-sizing: border-box;
    border: 1px solid #ccc;
}
.list {
    position: absolute;
    top: 0;
    left: 0;
}
.list div {
    border: 1px solid blue;
    line-height: 30px;
}
</style>