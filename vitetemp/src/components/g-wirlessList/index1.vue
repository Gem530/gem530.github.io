<template>
    <div class="component theme">
        <div class="list-wrap" ref="listWrap" @scroll="scroll">
            <div class="scroll-bar" ref="scrollBar"></div>
            <div class="list" ref="list">
                <div v-for="(val, i) in showList" :key="i" :style="`width: 100%;height: ${props.itemHeight}px;`">
                    <slot :item="val">{{val}}</slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'g-wirless-list' }
</script>
<script setup lang="ts">
    import { watch, onMounted, defineProps, defineEmits } from 'vue'
    const list: any = ref()
    const listWrap: any = ref()
    const scrollBar: any = ref()
    const emits = defineEmits(['loadmore'])
    const props = withDefaults(defineProps<{
        list?: any[],
        showNum?: number,
        itemHeight?: number
    }>(), {
        list: () => [],
        showNum: 10,
        itemHeight: 30
    })
    const state: any = reactive({
        start: 0, // 滚动过程显示的开始索引
        end: props.showNum // 滚动过程显示的结束索引
    })

    watch(() => props.list, (val, old) => {
        // console.log('list--', val, old)
        nextTick(() => {
            init()
        })
    }, { deep: true })

    // computed
    const showList = computed(() => {
        return props.list.slice(state.start, state.end)
    })
    
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted--', dom.scrollHeight - dom.scrollTop - 5 >= dom.clientHeight)
        init()
    })

    const scroll = () => {
        const dom = listWrap.value
        if (dom.scrollHeight - dom.scrollTop - 5 <= dom.clientHeight) {
            emits('loadmore', true)
            // init()
        }
        // 获取滚动高度
        let scrollTop = listWrap.value.scrollTop
        // 开始的数组索引
        state.start = Math.round(scrollTop / props.itemHeight)
        state.end = state.start + props.showNum
        // 绝对定位对相对定位的偏移量
        list.value.style.top = state.start * props.itemHeight + 'px'
    }

    const init = () => {
        const dom = listWrap.value
        // 计算滚动容器高度
        dom.style.height = props.itemHeight * props.showNum + 'px'
        scrollBar.value.style.height = props.itemHeight * props.list.length + 'px'
        nextTick(() => {
            if (dom.scrollHeight - dom.scrollTop - 5 <= dom.clientHeight) {
                emits('loadmore', true)
            }
        })
    }
</script>

<style lang="scss" scoped>
.component {
    height: 100%;

    .list-wrap {
        position: relative;
        overflow-y: scroll;
        box-sizing: border-box;
        // @include overflowAutoHid();
    }
    
    .list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
}
</style>