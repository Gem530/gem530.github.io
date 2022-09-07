<template>
    <div class="contanir component theme">
        图片标注页面
        <GImgOverlays
            :width="300"
            :height="300"
            @getImg="getImg"
        ></GImgOverlays>
    </div>
</template>

<script setup lang="ts" name="img-overLays">
    interface imgInfo {
        url: String,
        blob: Blob
    }
    import { onMounted } from 'vue'
    import GImgOverlays from '@/components/g-img-overlays/index.vue'
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