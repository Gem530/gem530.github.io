<template>
    <div class="contanir theme">
        <g-refersh
            ref="refershRef"
            height="500px"
            @dropDown="dropDown"
            @pullUp="pullUp">
            <div v-for="(item, i) in state.list" :key="i">{{item}}</div>
        </g-refersh>
    </div>
</template>

<script lang="ts">
export default { name: 'refersh' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import gRefersh from '@/components/g-refersh/index.vue'

    const refershRef = ref()

    const state = reactive({
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
       console.log('onMounted')
    })

    // 下拉方法回调
    const dropDown = () => {
        setTimeout(() => {
            console.log('下拉成功')
            state.list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            refershRef.value.pullSuccess()
        }, 1000)
    }

    // 触底事件
    const pullUp = () => {
        console.log('触底成功')
        state.list = [...state.list, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
        setTimeout(() => {
            if (state.list.length > 50) {
                    refershRef.value.noMoreData()
            } else {
                    refershRef.value.loadmoreSuccess()
            }
        }, 100)
    }
</script>

<style lang="scss" scoped>

</style>