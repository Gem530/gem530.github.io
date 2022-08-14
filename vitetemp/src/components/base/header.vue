<template>
    <div class="component theme">
        <div class="header">
            <i class="iconfont icon-arrow-left-bold" @click="router.go(-1)"></i>
            <div><slot name="title">标题</slot></div>
            <div><slot name="right">icon</slot></div>
        </div>
        
        <div style="height: 45px;"></div>
    </div>
</template>

<script lang="ts">
    export default { name: 'Headers' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })
</script>

<style lang="scss" scoped>
.header {
    @include wh(100%, 45px);
    @include flex(space-between, center);
    @include pcenter(0, 0, 0, 0, fixed);
    background: $white;
    padding: 0 15px;
    color: $black;
    box-shadow: 0 2px 5px rgba($color: #000000, $alpha: 0.2);
}
</style>