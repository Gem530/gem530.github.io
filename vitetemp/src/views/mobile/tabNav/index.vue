<template>
    <div class="component theme list">
        <div
            class="list-item"
            :key="i"
            v-for="(item, i) in props.list"
            :style="`color: ${state.index === i ? props.activeColor : props.color}`"
            @click="handleClick(i)">
            <i :class="`item-icon iconfont ${item.icon}`"></i>
            <div class="item-text">{{item.text}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'tab-nav' }
</script>
<script setup lang="ts">
    interface tabNavType {
        icon: string,
        text: string
    }
    import { onMounted, defineProps, defineEmits, reactive } from 'vue'
    const emit = defineEmits(['tabClick'])
    const props = withDefaults(defineProps<{
        list: tabNavType,
        color?: string,
        activeColor?: string,
        defaultIndex?: number
    }>(), {
        list: () => [],
        color: '#000000',
        activeColor: '#ff0000',
        defaultIndex: 0
    })

    const state = reactive({
        index: props.defaultIndex
    })

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
    //    console.log('onMounted')
    })

    const handleClick = (i: number) => {
        state.index = i
        emit('tabClick', i)
    }
</script>

<style lang="scss" scoped>
    .list {
        @include wh(100%, 50px);
        @include flex(space-around, center);
        @include pcenter(100%, 0, -100%, 0, fixed);
        border-top: 1px solid $borderColor;

        .list-item {
            @include flex(center, center, column);
            font-size: 14px;

            .item-icon {
                font-size: 20px;
            }
        }
    }
</style>