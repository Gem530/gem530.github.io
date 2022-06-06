<template>
    <div class="contanir theme">
        <g-wirless-list
            :list="state.list"
            :showNum="state.showNum"
            :itemHeight="state.itemHeight"
            @loadmore="loadmore">
            <template v-slot:default="slot">
                <div style="color: red;box-sizing: border-box;border: 1px solid blue;">{{slot.item}}</div>
            </template>
        </g-wirless-list>
    </div>
</template>

<script lang="ts">
export default { name: 'wirlessList' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import gWirlessList from '@/components/g-wirlessList/index.vue'

    const state = reactive({
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        showNum: 10,
        itemHeight: 30
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
    //    console.log('onMounted')
    })

    const loadmore = (data: boolean) => {
        state.list = [...state.list, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
        // console.log(data, '0000', state.list)
    }
</script>

<style lang="scss" scoped>

</style>