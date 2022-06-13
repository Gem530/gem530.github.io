<template>
    <div
        class="contanir"
        :style="`width: ${(props.width / 10)}rem;height: ${(props.height / 10)}rem;`">
        <div class="start-btn" @click="startLuckDraw">
            <div>抽奖</div>
            <div>({{state.number}})次</div>
        </div>
        <div
            :key="i"
            v-for="(item, i) in state.list"
            :class="[
                'item-btn',
                `item${i}`,
                state.index === i ? 'active-btn': ''
            ]">
            <img :src="item.image" alt="">
            <div>{{item.name}}</div>
            <!-- <div>{{item.id}}</div> -->
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'g-shopGame' }
</script>
<script setup lang="ts">
    import { GIFT_LIST } from './config'
    import GMessage from '@/components/g-message/index.ts'

    const props = defineProps({
        gift: {
            type: Number,
            default: 0
        },
        number: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 300
        },
        list: {
            type: Array,
            default: () => GIFT_LIST
        }
    })
    // // withDefaults与defineProps搭配使用，withDefaults第二个参数是给defineProps的值给默认值
    // withDefaults(defineProps<{
    //   msg: string
    // }>(), {
    //   msg: 'Vue3 Message Title'
    // })
    const emits = defineEmits(['luckResult'])
    const state = reactive({
        maxCount: 6, // 最多转动的格子次数，然后开始减速
        number: 0, // 剩余抽奖次数
        speed: 150, // 初始移动速度
        count: 0, // 格子的计算
        index: 0, // 所在格子
        gift: 0, // 中奖结果
        flag: true, // 是否可以点击抽奖
        list: GIFT_LIST // 默认奖品列表
    })

    watch(props, (val, old) => {
        state.gift = val.gift
        state.number = val.number
        if (val.list && val.list.length) {
        state.list = val.list as Array<any>
        }
    }, { deep: true, immediate: true })

    // // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    // onMounted(() => {
    //   console.log('onMounted')
    // })

    // 开始抽奖
    const startLuckDraw = () => {
        if (!state.flag) {
            // alert('正在抽奖中，请勿重复点击')
            GMessage({ message: '正在抽奖中，请勿重复点击', type: 'error', duration: 1000 })
            return
        }
        if (!state.number) {
            // alert('已无抽奖次数')
            GMessage({ message: '已无抽奖次数', type: 'error', duration: 1000 })
            return
        }
        state.flag = false
        // console.log('开始抽奖-中奖结果', state.gift)
        roll()
    }

    let timer: ReturnType<typeof setTimeout> // 定时器
    // 转动
    const roll = () => {
        timer = setTimeout(() => {
        state.count += 1
        state.index = (state.index < state.list.length - 1) ? state.index += 1 : 0 // 控制当前选中的盒子
        if (state.count > state.maxCount + 16 && state.index === state.gift) {
            // 转动次数达标并且index与中奖gift相同 就结束
            clearTimeout(timer)
            reset() // 重置参数 告知父组件抽奖结束
        } else {
            roll() // 递归调用
            state.speed = (state.count < state.maxCount + 3) ?
            (state.speed -= 5) : // 加速转动
            (state.speed += 15) // 减速转动
        }
        }, state.speed)
    }

    // 重置所有参数 告知父组件抽奖结束
    const reset = () => {
        state.speed = 150
        state.count = 0
        state.flag = true
        emits('luckResult', state.list[state.index])
    }
</script>

<style lang="scss" scoped>
    .contanir {
        // width: rem(1500);
        // height: rem(1500);
        position: relative;
        margin: 0 auto;

        .start-btn,
        .item-btn {
            @include wh(33%, 33%);
            background: pink;
            border: 3px solid transparent;
            border-radius: 10px;
            @include flex(center, center, column);

            img {
                @include wh(50%, 50%);
            }

            &.active-btn {
                border: 3px solid red;
            }
        }

        .start-btn {
            @include pcenter();
            background: red;
            font-size: 26px;
            color: #ffffff;
            cursor: pointer;
        }

        .item {
            &0 {
                @include pcenter(0, 0, 0, 0);
            }
            &1 {
                @include pcenter(0, 50%, 0, -50%);
            }
            &2 {
                @include pcenter(0, 100%, 0, -100%);
            }
            &3 {
                @include pcenter(50%, 100%, -50%, -100%);
            }
            &4 {
                @include pcenter(100%, 100%, -100%, -100%);
            }
            &5 {
                @include pcenter(100%, 50%, -100%, -50%);
            }
            &6 {
                @include pcenter(100%, 0, -100%, 0);
            }
            &7 {
                @include pcenter(50%, 0, -50%, 0);
            }
        }
    }
</style>