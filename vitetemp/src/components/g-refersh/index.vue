<template>
    <div class="component theme">
        <div
            ref="box"
            class="box"
            :style="`height: ${props.height};`"
            v-loadmores="loadmore">
            <!-- @touchend.stop="touchend"
            @touchmove.stop="touchmove"
            @touchstart.stop="touchstart"
            @mouseup.stop="touchend"
            @mousemove.stop="touchmove"
            @mousedown.stop="touchstart" -->
            <div :style="`height: ${state.referHeight}px;`" class="refersh">
                {{state.referFlag === 1 ? '松开手指即可刷新' : state.referFlag === 2 ? '正在加载中...' : '刷新成功'}}
            </div>
            <slot>
                <!-- <div v-for="(item, index) in state.list" :key="index">{{item}}</div> -->
            </slot>
            <div class="pull">{{state.pullFlag === 1 ? '没有更多了' : '加载中...'}}</div>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'g-refersh' }
</script>
<script setup lang="ts">
    import { watch, onMounted, nextTick, defineProps, defineEmits, defineExpose } from 'vue'

    const emits = defineEmits(['dropDown', 'pullUp'])
    const props = withDefaults(defineProps<{
        height?: string
    }>(), {
        height: '100%'
    })

    const box: any = ref()
    const state: any = reactive({
        moveY: 0, // 下拉刷新文字div高度 同时也是下拉高度
        startY: 0, // 鼠标按下起始点
        pullFlag: 0, // 上拉加载 0加载中... 1没有更多了
        bottomPx: 30, // 距离底部多少px，进行上拉加载
        referFlag: 0, // 下拉刷新 0未下拉  1手指下拉中  2手指移开，执行接口等。。  3加载成功
        referHeight: 0, // 下拉刷新文字div高度
        isMobile: true, // 是否未移动端
        trueFlag: false, // 是否按下鼠标
        isLoading: true // 是否触发下拉加载
    })

    watch(() => state.isLoading, (val, old) => {
        // console.log(old, val)
        if (old === false && val === true) {
            nextTick(() => {
                checkHeight()
            })
        }
    }, { deep: true })

    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        // alert('移动端')
        state.isMobile = true
    } else {
        // alert('pc端')
        state.isMobile = false
    }
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')

        window.addEventListener('mouseup', touchend)
        window.addEventListener('mousemove', touchmove)
        window.addEventListener('mousedown', touchstart)
        window.addEventListener('touchend', touchend, { passive: false })
        window.addEventListener('touchmove', touchmove, { passive: false })
        window.addEventListener('touchstart', touchstart, { passive: false })
        checkHeight()
    })

    // 检查是否填满高度
    const checkHeight = () => {
        nextTick(() => {
            const CONDITION = box.value.scrollHeight - box.value.scrollTop - 5 <= box.value.clientHeight
            // console.log(CONDITION, box.value.scrollHeight - box.value.scrollTop, box.value.clientHeight)
            // console.log(dom.scrollHeight - dom.scrollTop, dom.clientHeight, dom.scrollHeight - dom.scrollTop <= dom.clientHeight, 'checkHeight')
            if (CONDITION) {
                loadmore()
            }
        })
    }

    // 鼠标按下
    const touchstart = (e: any) => {
        e = e || window.event
        if (!box.value.contains(e.target)) {
            return
        }
        // console.log('手指接触屏幕')
        state.startY = state.isMobile ? e.touches[0].pageY : e.pageY
        state.trueFlag = true
    }

    // 鼠标移动
    const touchmove = (e: any) => {
        e = e || window.event
        if (!box.value.contains(e.target)) {
            return
        }
        // console.log('手指移动屏幕')
        const num = box.value.scrollTop
        if (num < 1 && state.trueFlag) {
            // 只有在顶部时，才执行
            state.moveY = (state.isMobile ? e.touches[0].pageY : e.pageY) - state.startY
            state.referHeight = state.moveY
            if (state.moveY > 0) {
                // 只有值为整数，才是下拉，才执行
                e.preventDefault()
                if (state.moveY > 80) {
                    // 设置下拉最大值
                    state.referHeight = 80
                    state.referFlag = 1
                }
            }
        }
    }

    // 鼠标弹起
    const touchend = () => {
        state.trueFlag = false
        if (state.moveY > 0) {
            state.referFlag = 2
            emits('dropDown')
            // setTimeout(() => {
            //     state.referFlag = 3
            //     state.referHeight = 0
            // }, 1000)
        }
    }

    // 触底事件
    const loadmore = () => {
        // console.log(11)
        if (state.isLoading) {
            state.isLoading = false
            emits('pullUp')
            // console.log('上拉加载')
            // if (state.list.length > 100) {
            //     state.pullFlag = 1
            // } else {
            //     setTimeout(() => {
            //         state.list = state.list.concat([1,2,3,5,1,2,3,5,1,2,3,5,1,2,3,5])
            //         console.log('调用接口', state.list)
            //         state.isLoading = true
            //         callBack && callBack()
            //     }, 1000)
            // }
        }
    }

    // 下拉加载成功方法
    const pullSuccess = () => {
        state.pullFlag = 0
        state.isLoading = true
        state.referFlag = 3
        state.referHeight = 0
        checkHeight()
    }

    // 触底事件成功方法
    const loadmoreSuccess = () => {
        state.isLoading = true
    }

    // 没有更多数据了
    const noMoreData = () => {
        state.pullFlag = 1
    }

    // 把方法抛出去，父组件才可以调用
    defineExpose({ noMoreData, pullSuccess, loadmoreSuccess })
</script>

<style lang="scss" scoped>
.pull,
.refersh {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.refersh {
    overflow: hidden;
    transition: all 0.2s;
}
.box {
    width: 100%;
    overflow: auto;
}
</style>