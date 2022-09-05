<template>
    <div class="contanir component theme">
        图片裁剪页面
        <GClipImg
            :x="150"
            :y="150"
            :width="300"
            :rotate="90"
            :height="300"
            :maxScale="3"
            :minScale="0.01"
            :clipWidth="80"
            :clipHeight="80"
            :scaleStep="0.01"
            maskColor="rgba(0, 0, 0, 0.5)"
            @getImg="getImg"
        ></GClipImg>
    </div>
</template>

<script lang="ts">
    export default { name: 'clip-img' }
</script>
<script setup lang="ts">
    interface imgInfo {
        url: String,
        blob: Blob
    }
    import { onMounted } from 'vue'
    import GClipImg from '@/components/g-clip-img/index.vue'
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    // 获取截取的图片
    const getImg = (item: imgInfo) => {
        console.log(item)
    }
</script>

<style lang="scss" scoped>

</style>