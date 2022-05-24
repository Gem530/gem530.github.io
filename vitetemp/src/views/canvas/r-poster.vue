<template>
    <div class="contanir theme">
        <g-poster></g-poster>
    </div>
</template>

<script lang="ts">
export default { name: 'poster' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import gPoster from '@/components/g-poster/index.vue'
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        console.log('onMounted')
    })
</script>

<style lang="scss" scoped>

</style>