<template>
    <div class="contanir theme">
        <div style="width: 400px;height: 710px;">
            <g-poster :list="state.list"></g-poster>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'poster' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import gPoster from '@/components/g-poster/index.vue'

    const state = reactive({ // 按照顺序渲染，建议第一个放底图
        list: [
            {
                type: 'image',
                url: 'https://gem530.github.io/img/u=1819817697,2457372120&fm=26&fmt=auto&gp=0.jpg',
                x: 0,
                y: 0,
                width: 400,
                height: 714
            },
            {
                type: 'image',
                url: 'https://gem530.github.io/img/lADPD26eNnXBjezNAuPNAuM_739_739.jpg',
                x: 10,
                y: 630,
                width: 70,
                height: 70
            },
            {
                type: 'text',
                url: '绘制文字',
                x: 100,
                y: 640
            }
        ]
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        console.log('onMounted')
    })
</script>

<style lang="scss" scoped>

</style>